import {ScheduleBlock} from "../models/index.js";

class ScheduleBlockController {
   static create = async (req, res, next) => {
     try {
       const { dentistId, date, startTime, endTime, type, reason } = req.body;

       const block = await ScheduleBlock.create({
         dentistId,
         date,
         startTime,
         endTime,
         type,
         reason,
       });

       res.json({ status: 'ok', block });
     } catch (e) {
       next(e);
     }
   }; 

   static list = async (req, res, next) => {
     try {
       const { dentistId, date, startTime, endTime, type } = req.query;

       const where = {};

       if (dentistId !== undefined) where.dentistId = dentistId;
       if (date !== undefined) where.date = date;
       if (startTime !== undefined) where.startTime = startTime;
       if (endTime !== undefined) where.endTime = endTime;
       if (type !== undefined) where.type = type;

       const blocks = await ScheduleBlock.findAll({
         where,
         order: [
           ['date', 'ASC'],
           ['startTime', 'ASC'],
         ],
       });

       res.json({ status: 'ok', blocks });
     } catch (e) {
       next(e);
     }
   };

   static update = async (req, res, next) => {
     try {
       const { id } = req.params;
       const { dentistId, date, startTime, endTime, type, reason } = req.body || {};

       const block = await ScheduleBlock.findByPk(id);
       if (!block) {
         return res.status(404).json({ status: 'error', message: 'Schedule block not found' });
       }

       const patch = {};

       if (dentistId !== undefined) patch.dentistId = dentistId;
       if (date !== undefined) patch.date = date;
       if (startTime !== undefined) patch.startTime = startTime;
       if (endTime !== undefined) patch.endTime = endTime;
       if (type !== undefined) patch.type = type;
       if (reason !== undefined) patch.reason = reason;

       await block.update(patch);

       res.json({ status: 'ok', block });
     } catch (e) {
       next(e);
     }
   };

   static remove = async (req, res, next) => {
     try {
       const { id } = req.params;

       const block = await ScheduleBlock.findByPk(id);
       if (!block) {
         return res.status(404).json({ status: 'error', message: 'Schedule block not found' });
       }

       await block.destroy();

       res.json({ status: 'ok' });
     } catch (e) {
       next(e);
     }
   };
 }

 export default ScheduleBlockController;
