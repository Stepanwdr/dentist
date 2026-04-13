import { Op } from 'sequelize';
import { BookingSlot, Users, Clinic } from '../models/index.js';

// ─── Helpers ──────────────────────────────────────────
function toHMS(value) {
  if (!value) return value;
  const parts = String(value).split(':');
  if (parts.length === 2) return `${parts[0].padStart(2,'0')}:${parts[1].padStart(2,'0')}:00`;
  if (parts.length === 3) return `${parts[0].padStart(2,'0')}:${parts[1].padStart(2,'0')}:${parts[2].padStart(2,'0')}`;
  return value;
}

function isValidDateOnly(str) {
  return /^\d{4}-\d{2}-\d{2}$/.test(str);
}

async function hasOverlap({ dentistId, date, startTime, endTime, excludeId = null }) {
  const where = {
    dentistId,
    date,
    startTime: { [Op.lt]: endTime },
    endTime:   { [Op.gt]: startTime },
  };
  if (excludeId) where.id = { [Op.ne]: excludeId };
  const cnt = await BookingSlot.count({ where });
  return cnt > 0;
}

class BookingController {

  // GET /bookings?dentistId=&date=&isBooked=&from=&to=
  static list = async (req, res, next) => {
    try {
      const { dentistId, clinicId, date, isBooked, from, to } = req.query;
      const where = {};
      if (dentistId) where.dentistId = dentistId;
      if (clinicId)  where.clinicId  = clinicId;
      if (date)      where.date      = date;
      if (typeof isBooked !== 'undefined') where.isBooked = String(isBooked) === 'true';
      if (from) where.startTime = { ...(where.startTime || {}), [Op.gte]: toHMS(from) };
      if (to)   where.endTime   = { ...(where.endTime   || {}), [Op.lte]: toHMS(to) };

      const slots = await BookingSlot.findAll({
        where,
        include: [
          { model: Users,  as: 'dentist', attributes: ['id', 'name', 'lname', 'fname', 'speciality', 'clinicId'] },
          { model: Clinic, as: 'clinic',  attributes: ['id', 'name'] },
        ],
        order: [['date', 'ASC'], ['startTime', 'ASC']],
      });
      res.json({ status: 'ok', slots });
    } catch (e) {
      next(e);
    }
  };

  // ✅ GET /available-dates?dentistId=&from=&to=
  // Возвращает массив дат у которых есть хотя бы 1 свободный слот
  // Используется для точек в горизонтальном календаре
  static availableDates = async (req, res, next) => {
    try {
      const { dentistId, from, to } = req.query;

      if (!dentistId || !from || !to) {
        return res.status(400).json({
          status: 'error',
          message: 'dentistId, from, to are required',
        });
      }
      if (!isValidDateOnly(from) || !isValidDateOnly(to)) {
        return res.status(400).json({
          status: 'error',
          message: 'from and to must be YYYY-MM-DD',
        });
      }

      const rows = await BookingSlot.findAll({
        where: {
          dentistId,
          isBooked: false,
          date: { [Op.between]: [from, to] },
        },
        attributes: ['date'],
        group:  ['date'],
        order:  [['date', 'ASC']],
        raw:    true,
      });

      const dates = rows.map(r => r.date);
      res.json({ status: 'ok', dates });
    } catch (e) {
      next(e);
    }
  };

  // POST /slot
  static create = async (req, res, next) => {
    try {
      const { dentistId, clinicId = null, date, startTime, endTime, notes = null } = req.body || {};

      if (!dentistId || !date || !startTime || !endTime) {
        return res.status(400).json({ status: 'error', message: 'dentistId, date, startTime, endTime are required' });
      }
      if (!isValidDateOnly(date)) {
        return res.status(400).json({ status: 'error', message: 'Invalid date format, expected YYYY-MM-DD' });
      }

      const s = toHMS(startTime);
      const e = toHMS(endTime);
      if (s >= e) {
        return res.status(400).json({ status: 'error', message: 'startTime must be earlier than endTime' });
      }

      const dentist = await Users.findByPk(dentistId);
      if (!dentist) return res.status(404).json({ status: 'error', message: 'Dentist not found' });

      if (await hasOverlap({ dentistId, date, startTime: s, endTime: e })) {
        return res.status(409).json({ status: 'error', message: 'Overlapping slot exists for this dentist and date' });
      }

      const created = await BookingSlot.create({ dentistId, clinicId, date, startTime: s, endTime: e, notes,isBooked:true });
      res.status(201).json({ status: 'ok', slot: created });
    } catch (e) {
      next(e);
    }
  };

  // POST /slots  (batch)
  static createBatch = async (req, res, next) => {
    try {
      const { dentistId, clinicId = null, date, startTime, endTime, stepMin = 30, notes = null } = req.body || {};

      if (!dentistId || !date || !startTime || !endTime) {
        return res.status(400).json({ status: 'error', message: 'dentistId, date, startTime, endTime are required' });
      }
      if (!Number.isInteger(stepMin) || stepMin <= 0 || stepMin > 480) {
        return res.status(400).json({ status: 'error', message: 'stepMin must be a positive integer (<= 480)' });
      }
      if (!isValidDateOnly(date)) {
        return res.status(400).json({ status: 'error', message: 'Invalid date format, expected YYYY-MM-DD' });
      }

      const s0 = toHMS(startTime);
      const e0 = toHMS(endTime);
      if (s0 >= e0) {
        return res.status(400).json({ status: 'error', message: 'startTime must be earlier than endTime' });
      }

      function toDate(t) {
        const [H, M, S] = t.split(':').map(Number);
        const d = new Date(0);
        d.setUTCHours(H, M, S || 0, 0);
        return d;
      }
      function toStr(d) {
        return `${String(d.getUTCHours()).padStart(2,'0')}:${String(d.getUTCMinutes()).padStart(2,'0')}:00`;
      }

      const startD = toDate(s0);
      const endD   = toDate(e0);
      const stepMs = stepMin * 60 * 1000;

      const requested = [];
      for (let t = startD.getTime(); t + stepMs <= endD.getTime(); t += stepMs) {
        requested.push({ startTime: toStr(new Date(t)), endTime: toStr(new Date(t + stepMs)) });
      }

      const existing = await BookingSlot.findAll({ where: { dentistId, date }, raw: true });
      const created  = [];
      const skipped  = [];

      function overlapsAny(s, e) {
        return existing.some(ex => ex.startTime < e && ex.endTime > s) ||
          created.some(ex => ex.startTime  < e && ex.endTime > s);
      }

      for (const r of requested) {
        if (overlapsAny(r.startTime, r.endTime)) {
          skipped.push(r);
          continue;
        }
        const row = await BookingSlot.create({ dentistId, clinicId, date, startTime: r.startTime, endTime: r.endTime, notes });
        created.push(row);
      }

      res.status(201).json({ status: 'ok', createdCount: created.length, skippedCount: skipped.length, created, skipped });
    } catch (e) {
      next(e);
    }
  };

  // PATCH /:id
  static update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { date, startTime, endTime, notes } = req.body || {};

      const slot = await BookingSlot.findByPk(id);
      if (!slot)        return res.status(404).json({ status: 'error', message: 'Slot not found' });
      if (slot.isBooked) return res.status(409).json({ status: 'error', message: 'Booked slot cannot be changed' });

      const patch = {};
      let newDate  = slot.date;
      let newStart = slot.startTime;
      let newEnd   = slot.endTime;

      if (notes     !== undefined) patch.notes = notes;
      if (date      !== undefined) {
        if (!isValidDateOnly(date)) return res.status(400).json({ status: 'error', message: 'Invalid date format' });
        newDate = date;
      }
      if (startTime !== undefined) newStart = toHMS(startTime);
      if (endTime   !== undefined) newEnd   = toHMS(endTime);

      if (newStart >= newEnd) {
        return res.status(400).json({ status: 'error', message: 'startTime must be earlier than endTime' });
      }
      if (await hasOverlap({ dentistId: slot.dentistId, date: newDate, startTime: newStart, endTime: newEnd, excludeId: slot.id })) {
        return res.status(409).json({ status: 'error', message: 'Overlapping slot exists for this dentist and date' });
      }

      patch.date      = newDate;
      patch.startTime = newStart;
      patch.endTime   = newEnd;

      await slot.update(patch);
      res.json({ status: 'ok', slot });
    } catch (e) {
      next(e);
    }
  };

  // DELETE /:id
  static remove = async (req, res, next) => {
    try {
      const { id } = req.params;
      const slot = await BookingSlot.findByPk(id);
      if (!slot)         return res.status(404).json({ status: 'error', message: 'Slot not found' });
      if (slot.isBooked) return res.status(409).json({ status: 'error', message: 'Cannot delete a booked slot' });
      await slot.destroy();
      res.json({ status: 'ok' });
    } catch (e) {
      next(e);
    }
  };
}

export default BookingController;