// src/features/booking/models/useBookingActions.ts
import { useCallback } from 'react';
import { Appointment, Doctor, Patient, Service } from '@shared/types';
import { useBookingStore } from './bookingStore';

export function useBookingActions() {
  const { state, dispatch } = useBookingStore();

  const selectService = useCallback((service: Service) => {
    dispatch({ type: 'SELECT_SERVICE', payload: service });
  }, [dispatch]);

  const selectDoctor = useCallback((doctor: Doctor) => {
    dispatch({ type: 'SELECT_DOCTOR', payload: doctor });
  }, [dispatch]);

  const selectDateTime = useCallback((date: string, time: string) => {
    dispatch({ type: 'SELECT_DATETIME', date, time });
  }, [dispatch]);

  const confirmBooking = useCallback((): Appointment | null => {
    const { service, doctor, date, time } = state.draft;
    if (!service || !doctor || !date || !time) return null;

    const appointment: Appointment = {
      id: `a${Date.now()}`,
      serviceId: service.id,
      dentistId: doctor.id,
      date,
      time,
      status: 'upcoming',
      serviceName: service.title,
      doctorName:
        doctor.name.split(' ').slice(0, 2).join(' ') + '.',
    };
    dispatch({ type: 'CONFIRM_BOOKING', payload: appointment });
    return appointment;
  }, [state.draft, dispatch]);

  const cancelAppointment = useCallback((id: string) => {
    dispatch({ type: 'CANCEL_APPOINTMENT', id });
  }, [dispatch]);

  const resetDraft = useCallback(() => {
    dispatch({ type: 'RESET_DRAFT' });
  }, [dispatch]);

  const updatePatient = useCallback((data: Partial<Patient>) => {
    dispatch({ type: 'UPDATE_PATIENT', payload: data });
  }, [dispatch]);

  return {
    selectService,
    selectDoctor,
    selectDateTime,
    confirmBooking,
    cancelAppointment,
    resetDraft,
    updatePatient,
  };
}
