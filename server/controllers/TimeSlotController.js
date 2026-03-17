import { Op } from 'sequelize';
import { TimeSlot, Users, Clinic } from '../models/index.js';

// Helpers
function toHMS(value) {
  if (!value) return value;
  // Accepts "HH:mm" or "HH:mm:ss" and normalizes to HH:mm:ss
  const parts = String(value).split(':');
  if (parts.length === 2) return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}:00`;
  if (parts.length === 3) return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}:${parts[2].padStart(2, '0')}`;
  return value;
}

function isValidDateOnly(str) {
  return /^\d{4}-\d{2}-\d{2}$/.test(str);
}

async function hasOverlap({ dentistId, date, startTime, endTime, excludeId = null }) {
  // Overlap condition: existing.start < newEnd AND existing.end > newStart
  const where = {
    dentistId,
    date,
    startTime: { [Op.lt]: endTime },
    endTime: { [Op.gt]: startTime },
  };
  if (excludeId) where.id = { [Op.ne]: excludeId };
  const cnt = await TimeSlot.count({ where });
  return cnt > 0;
}

class TimeSlotController {
  // GET /time-slots
  static list = async (req, res, next) => {
    try {
      const { dentistId, clinicId, date, isBooked, from, to } = req.query;
      const where = {};
      if (dentistId) where.dentistId = dentistId;
      if (clinicId) where.clinicId = clinicId;
      if (date) where.date = date;
      if (typeof isBooked !== 'undefined') where.isBooked = String(isBooked) === 'true';
      if (from) where.startTime = { ...(where.startTime || {}), [Op.gte]: toHMS(from) };
      if (to) where.endTime = { ...(where.endTime || {}), [Op.lte]: toHMS(to) };

      const slots = await TimeSlot.findAll({
        where,
        include: [
          { model: Users, as: 'dentist', attributes: ['id', 'name', 'lname', 'fname', 'speciality', 'clinicId'] },
          { model: Clinic, as: 'clinic', attributes: ['id', 'name'] },
        ],
        order: [['date', 'ASC'], ['startTime', 'ASC']],
      });

      res.json({ status: 'ok', slots });
    } catch (e) {
      next(e);
    }
  };

  // POST /time-slots
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

      // ensure dentist exists
      const dentist = await Users.findByPk(dentistId);
      if (!dentist) return res.status(404).json({ status: 'error', message: 'Dentist not found' });

      if (await hasOverlap({ dentistId, date, startTime: s, endTime: e })) {
        return res.status(409).json({ status: 'error', message: 'Overlapping slot exists for this dentist and date' });
      }

      const created = await TimeSlot.create({ dentistId, clinicId, date, startTime: s, endTime: e, notes });
      res.status(201).json({ status: 'ok', slot: created });
    } catch (e) {
      next(e);
    }
  };

  // POST /time-slots/batch
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

      // Build time points in HH:mm:ss as strings using a Date helper (epoch base ignored, only time portion used)
      function toDate(t) { const [H, M, S] = t.split(':').map(Number); const d = new Date(0); d.setUTCHours(H, M, S || 0, 0); return d; }
      function toStr(d) { return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}:00`; }

      const startD = toDate(s0);
      const endD = toDate(e0);
      const stepMs = stepMin * 60 * 1000;

      const requested = [];
      for (let t = startD.getTime(); t + stepMs <= endD.getTime(); t += stepMs) {
        const a = new Date(t);
        const b = new Date(t + stepMs);
        requested.push({ startTime: toStr(a), endTime: toStr(b) });
      }

      const created = [];
      const skipped = [];

      // Preload all existing slots for the dentist/date to speed overlap checking
      const existing = await TimeSlot.findAll({ where: { dentistId, date } });

      function overlapsAny(s, e) {
        return existing.some(ex => ex.startTime < e && ex.endTime > s) ||
               created.some(ex => ex.startTime < e && ex.endTime > s);
      }

      for (const r of requested) {
        if (overlapsAny(r.startTime, r.endTime)) {
          skipped.push(r);
          continue;
        }
        const row = await TimeSlot.create({ dentistId, clinicId, date, startTime: r.startTime, endTime: r.endTime, notes });
        created.push(row);
      }

      res.status(201).json({ status: 'ok', createdCount: created.length, skippedCount: skipped.length, created, skipped });
    } catch (e) {
      next(e);
    }
  };

  // PATCH /time-slots/:id
  static update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { date, startTime, endTime, notes } = req.body || {};
      const slot = await TimeSlot.findByPk(id);
      if (!slot) return res.status(404).json({ status: 'error', message: 'Slot not found' });
      if (slot.isBooked) return res.status(409).json({ status: 'error', message: 'Booked slot cannot be changed' });

      const patch = {};
      if (notes !== undefined) patch.notes = notes;
      let newDate = slot.date;
      let newStart = slot.startTime;
      let newEnd = slot.endTime;

      if (date !== undefined) {
        if (!isValidDateOnly(date)) return res.status(400).json({ status: 'error', message: 'Invalid date format' });
        newDate = date;
      }
      if (startTime !== undefined) newStart = toHMS(startTime);
      if (endTime !== undefined) newEnd = toHMS(endTime);

      if (newStart >= newEnd) return res.status(400).json({ status: 'error', message: 'startTime must be earlier than endTime' });

      if (await hasOverlap({ dentistId: slot.dentistId, date: newDate, startTime: newStart, endTime: newEnd, excludeId: slot.id })) {
        return res.status(409).json({ status: 'error', message: 'Overlapping slot exists for this dentist and date' });
      }

      patch.date = newDate;
      patch.startTime = newStart;
      patch.endTime = newEnd;

      await slot.update(patch);
      res.json({ status: 'ok', slot });
    } catch (e) {
      next(e);
    }
  };

  // DELETE /time-slots/:id
  static remove = async (req, res, next) => {
    try {
      const { id } = req.params;
      const slot = await TimeSlot.findByPk(id);
      if (!slot) return res.status(404).json({ status: 'error', message: 'Slot not found' });
      if (slot.isBooked) return res.status(409).json({ status: 'error', message: 'Cannot delete a booked slot' });
      await slot.destroy();
      res.json({ status: 'ok' });
    } catch (e) {
      next(e);
    }
  };
}

export default TimeSlotController;
