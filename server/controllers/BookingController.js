import { Op } from 'sequelize';
import {BookingSlot, Users, Clinic, ScheduleBlock} from '../models/index.js';

// ─── Helpers ──────────────────────────────────────────
function toHMS(value) {
  if (!value) return value;
  const parts = String(value).split(':');
  if (parts.length === 2) return `${parts[0].padStart(2,'0')}:${parts[1].padStart(2,'0')}:00`;
  if (parts.length === 3) return `${parts[0].padStart(2,'0')}:${parts[1].padStart(2,'0')}:${parts[2].padStart(2,'0')}`;
  return value;
}
function getLocalDate() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
}
function isValidDateOnly(str) {
  return /^\d{4}-\d{2}-\d{2}$/.test(str);
}

async function hasOverlap({ dentistId, date, startTime, endTime, excludeId = null }) {
  const hasBlock = await ScheduleBlock.count({
    where: {
      dentistId,
      date,
      startTime: { [Op.lt]: endTime },
      endTime:   { [Op.gt]: startTime },
    },
  });
  const where = {
    dentistId,
    date,
    startTime: { [Op.lt]: endTime },
    endTime:   { [Op.gt]: startTime },
    status: {
      [Op.in]: ['pending', 'confirmed'],
    },
  };

  if (excludeId) where.id = { [Op.ne]: excludeId };
  const cnt = await BookingSlot.count({ where });
  return cnt > 0 || hasBlock > 0;
}

class BookingController {

  // GET /bookings?dentistId=&date=&from=&to=
  static list = async (req, res, next) => {
    try {
      const {
        dentistId,
        clinicId = 1,
        date,
        from,
        to,
        page = 1,
        limit = 100,
        status,
        isBusySlots = false,
      } = req.query;
      const now = new Date();
      const userId = req.userId;
      const today = now.toISOString().slice(0, 10);
      const safeLimit = Math.min(parseInt(limit, 10) || 100, 200);
      const offset = (parseInt(page, 10) - 1) * safeLimit;
      const currentTime = now.toTimeString().slice(0, 8);

      const where = {};
      if (dentistId) where.dentistId = Number(dentistId);
      if (date)  where.date  = date;
      if(status) where.patientId = Number(userId);
      if (from) {
        where.startTime = {
          ...(where.startTime || {}),
          [Op.gte]: toHMS(from),
        };
      }

      if (to) {
        where.endTime = {
          ...(where.endTime || {}),
          [Op.lte]: toHMS(to),
        };
      }

      if (status === 'upcoming') {
        where.status = {
          [Op.in]: ['pending', 'confirmed'],
        };

        where[Op.or] = [
          {
            date: { [Op.gt]: today },
          },
          {
            date: today,
            startTime: { [Op.gte]: currentTime },
          },
        ];
      }
      if (status==='finished') {
        where.status = status;
      }
      if (status==='cancelled') {
        where.status = status;
      }

      if(status){
        where.patientId = req.userId;
        where[Op.or] = [
          {
            date: { [Op.gt]: today },
          },
          {
            date: today,
            startTime: { [Op.gte]: currentTime },
          },
        ];
      }
      if(Boolean(isBusySlots)){
        where.status = {
          [Op.in]: ['pending', 'confirmed'],
        };
      }
      console.log(where)
      const { rows: slots, count } = await BookingSlot.findAndCountAll({
        where,
        include: [
          { model: Users, as: 'dentist' },
          { model: Clinic, as: 'clinic' },
        ],
        order: [['date', 'ASC'], ['startTime', 'ASC']],
        limit: safeLimit,
        offset,
      });
      res.json({
        status: 'ok',
        pagination: {
          limit: safeLimit,
          total: count,
          totalPages: Math.ceil(count / safeLimit),
          page: Number(page),
        },
        slots,
      });

    } catch (e) {
      next(e);
    }
  };


  // ✅ GET /booking/next?dentistId=
  static nextBooking = async (req, res, next) => {
    try {
      const now = new Date();
       const patientId = req.userId;
      console.log({patientId})
      // текущая дата YYYY-MM-DD
      const today = now.toISOString().slice(0, 10);
      // текущее время HH:mm:ss
      const currentTime = now.toTimeString().slice(0, 8);
      console.log({currentTime})
      const slot = await BookingSlot.findOne({
        where: {
          patientId,
          status: {
            [Op.in]: ['pending', 'confirmed'],
          },
          [Op.or]: [
            // будущие даты
            {
              date: { [Op.gt]: today },
            },
            // сегодня, но время ещё впереди
            {
              date: today,
              startTime: { [Op.gte]: currentTime },
            },
          ],
        },

        include: [
          {
            model: Users,
            as: 'dentist',

          },
          {
            model: Clinic,
            as: 'clinic',
          },
        ],

        order: [
          ['date', 'ASC'],
          ['startTime', 'ASC'],
        ],
      });
      console.log(163,slot && slot.toJSON())
      if (!slot) {
        return res.json({
          status: 'ok',
          slot: null,
        });
      }
      res.json({
        status: 'ok',
        slot,
      });
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
          date: { [Op.between]: [from, to] },
        },
        attributes: ['date'],
        group:  ['date'],
        order:  [['date', 'ASC']],
        raw:    true,
      });
      console.log({rows})
      const dates = rows.map(r => r.date);
      res.json({ status: 'ok', dates });
    } catch (e) {
      next(e);
    }
  };

  // POST /slot
  static create = async (req, res, next) => {
    try {
      const { dentistId, date, startTime, endTime, notes = null, service } = req.body || {};
      const userId = req.userId

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
        return res.status(409).json({ status: 'error', message: 'Это время записа занято, выбирайте другое время!' });
      }
     const dentistClinic = dentist.toJSON().clinicId;
      const created = await BookingSlot.create({ dentistId, clinicId: dentistClinic, date, startTime: s, endTime: e, notes,isBooked:true,service, createdById: userId, patientId:userId });

      await created.reload({
        include: [
          {
            model: Users,
            as: 'dentist',
            attributes: ['id', 'name', 'lname', 'fname', 'speciality', 'clinicId', 'phone', 'avatar']
          },
          {
            model: Clinic,
            as: 'clinic',
            attributes: ['id', 'name', 'address', 'lat', 'long']
          }
        ]
      });
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
        return res.status(409).json({ status: 'error', message: 'Время записи занят, выберите другою...' });
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
      await slot.destroy();
      res.json({ status: 'ok' });
    } catch (e) {
      next(e);
    }
  };

  // PATCH /:id
  static changeStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.userId;
      const allowedStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];

      if (!status || !allowedStatuses.includes(status)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid status value',
        });
      }

      const slot = await BookingSlot.findByPk(id, {
        where: {
          patientId: userId,
        },
        include: [
          { model: Users, as: 'dentist' },
          { model: Users, as: 'patient' },
        ],
      });

      if (!slot) {
        return res.status(404).json({
          status: 'error',
          message: 'Slot not found',
        });
      }

      // доступ (пациент или врач)
      if (slot.patientId !== userId && slot.dentistId !== userId) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied',
        });
      }

      const transitions = {
        pending: ['confirmed', 'cancelled'],
        confirmed: ['completed', 'cancelled'],
        cancelled: [],
        completed: [],
      };

      if (!transitions[slot.status]?.includes(status)) {
        return res.status(400).json({
          status: 'error',
          message: `Cannot change status from ${slot.status} to ${status}`,
        });
      }

      // логика отмены — освобождаем слот
      if (status !== 'cancelled') {
        await slot.update({
          status,
          isBooked: false,
          patientId: null,
        });
      } else {
        await slot.update({ status });
      }

      // 🔔 отправка уведомления
      // await sendBookingNotification(slot, status);

      res.json({
        status: 'ok',
        slot,
      });

    } catch (e) {
      next(e);
    }
  };
}

export default BookingController;