// src/features/booking/models/bookingStore.tsx
import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
} from 'react';
import { Appointment, BookingDraft, Doctor, Patient, Service } from '@shared/types';
import { MOCK_APPOINTMENTS } from '@entities/appointment';
import { DEFAULT_PATIENT } from '@entities/patient';

// ─── State ────────────────────────────────────────────────────────────────────

interface BookingState {
  draft: BookingDraft;
  appointments: Appointment[];
  patient: Patient;
}

const initialState: BookingState = {
  draft: { service: null, doctor: null, date: null, time: null },
  appointments: MOCK_APPOINTMENTS,
  patient: DEFAULT_PATIENT,
};

// ─── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SELECT_SERVICE'; payload: Service }
  | { type: 'SELECT_DOCTOR'; payload: Doctor }
  | { type: 'SELECT_DATETIME'; date: string; time: string }
  | { type: 'CONFIRM_BOOKING'; payload: Appointment }
  | { type: 'CANCEL_APPOINTMENT'; id: string }
  | { type: 'RESET_DRAFT' }
  | { type: 'UPDATE_PATIENT'; payload: Partial<Patient> };

function reducer(state: BookingState, action: Action): BookingState {
  switch (action.type) {
    case 'SELECT_SERVICE':
      return {
        ...state,
        draft: { service: action.payload, doctor: null, date: null, time: null },
      };
    case 'SELECT_DOCTOR':
      return {
        ...state,
        draft: { ...state.draft, doctor: action.payload, date: null, time: null },
      };
    case 'SELECT_DATETIME':
      return {
        ...state,
        draft: { ...state.draft, date: action.date, time: action.time },
      };
    case 'CONFIRM_BOOKING':
      return {
        ...state,
        appointments: [action.payload, ...state.appointments],
        draft: { service: null, doctor: null, date: null, time: null },
      };
    case 'CANCEL_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map(a =>
          a.id === action.id ? { ...a, status: 'cancelled' } : a
        ),
      };
    case 'RESET_DRAFT':
      return { ...state, draft: { service: null, doctor: null, date: null, time: null } };
    case 'UPDATE_PATIENT':
      return { ...state, patient: { ...state.patient, ...action.payload } };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface BookingContextValue {
  state: BookingState;
  dispatch: React.Dispatch<Action>;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
};

export function useBookingStore(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBookingStore must be used inside BookingProvider');
  return ctx;
}
