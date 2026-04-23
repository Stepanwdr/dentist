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
 }

 export default ScheduleBlockController;