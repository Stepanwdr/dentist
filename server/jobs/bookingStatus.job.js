import cron from 'node-cron';
import { Op } from 'sequelize';
import BookingSlot from '../models/BookingSlot.js';

function getNow() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const currentTime = now.toTimeString().slice(0, 8);
  return { today, currentTime };
}

export function startBookingStatusJob() {
  cron.schedule('*/5 * * * *', async () => {
    try {
      const { today, currentTime } = getNow();

      const updated = await BookingSlot.update(
        { status: 'finished' },
        {
          where: {
            status: 'confirmed',
            [Op.or]: [
              { date: { [Op.lt]: today } },
              {
                date: today,
                endTime: { [Op.lt]: currentTime },
              },
            ],
          },
        }
      );

      console.log('✅ Cron: finished slots updated', updated[0]);
    } catch (e) {
      console.error('❌ Cron error:', e);
    }
  });
}