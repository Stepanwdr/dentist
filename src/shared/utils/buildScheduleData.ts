import { ScheduleBlock } from "@entities/schedule-block";
import { AppointmentsTab } from "@shared/types/booking";
import { Patient } from "@shared/types/patient";
import { TimeSlot } from "@shared/types/slot";

export type ScheduleItem = {
  id: string;
  time: string;
  patient: Patient;
  service: string;
  status: AppointmentsTab;
};

const emptyPatient: Patient = {
  id: 0,
  name: '',
  lname: '',
  fname: '',
  phone: '',
  address: '',
};

export function buildScheduleData(
  slots: TimeSlot[],
  blocks: ScheduleBlock[] = [],
): ScheduleItem[] {
  return slots.map((slot) => {
    const hasBlock = blocks.some((block) =>
      block.startTime < slot.endTime && block.endTime > slot.startTime
    );

    if (hasBlock) {
      return {
        id: `blocked-${slot.startTime}`,
        time: slot.startTime.slice(0, 5),
        patient: emptyPatient,
        service: 'Break / Unavailable',
        status: 'blocked',
      };
    }

    if (slot.isBooked) {
      return {
        id: `booking-${slot.id}`,
        time: slot.startTime.slice(0, 5),
        patient: slot.patient || emptyPatient,
        service: slot.service || 'Appointment',
        status: slot.status === 'pending' ? 'pending' : 'booked',
      };
    }

    return {
      id: `free-${slot.startTime}`,
      time: slot.startTime.slice(0, 5),
      patient: emptyPatient,
      service: '',
      status: 'free',
    };
  });
}
