import { Service } from '@shared/types';

export const FULL_SERVICES: Service[] = [
  {
    id: '1',
    title: 'Терапия',
    description: 'Лечение кариеса, пульпита, пломбирование',
    iconName: 'medical',
    color: '#4A90D9',
    duration: '60 мин',
    price: '2 500 – 8 000 ₽',
  },
  {
    id: '2',
    title: 'Хирургия',
    description: 'Удаление зубов, имплантация',
    iconName: 'medkit',
    color: '#E05C5C',
    duration: '45 мин',
    price: '3 000 – 15 000 ₽',
  },
  {
    id: '3',
    title: 'Ортодонтия',
    description: 'Брекеты, элайнеры, коррекция прикуса',
    iconName: 'git-branch',
    color: '#9B59B6',
    duration: '40 мин',
    price: '5 000 – 120 000 ₽',
  },
  {
    id: '4',
    title: 'Гигиена',
    description: 'Профчистка, отбеливание, фторирование',
    iconName: 'sparkles',
    color: '#27AE60',
    duration: '60 мин',
    price: '3 500 – 12 000 ₽',
  },
  {
    id: '5',
    title: 'Протезирование',
    description: 'Коронки, виниры, мостовидные протезы',
    iconName: 'layers-outline',
    color: '#F39C12',
    duration: '90 мин',
    price: '8 000 – 50 000 ₽',
  },
  {
    id: '6',
    title: 'Детская',
    description: 'Лечение молочных и постоянных зубов',
    iconName: 'happy-outline',
    color: '#1ABC9C',
    duration: '45 мин',
    price: '1 500 – 6 000 ₽',
  },
];

export const SERVICES = [
  { id: 'consult', label: 'Консультация',  price: 'Free',    icon: '🦷' },
  { id: 'xray',    label: 'Рентген',        price: '₽3 300',  icon: '📸' },
  { id: 'clean',   label: 'Чистка зубов',   price: '₽2 500',  icon: '🪥' },
  { id: 'treat',   label: 'Лечение',         price: '₽4 000',  icon: '💉' },
  { id: 'white',   label: 'Отбеливание',     price: '₽6 000',  icon: '✨' },
];

export const WEEK   = [
  { day: 'Пн', num: 14 }, { day: 'Вт', num: 15 }, { day: 'Ср', num: 16 },
  { day: 'Чт', num: 17 }, { day: 'Пт', num: 18 }, { day: 'Сб', num: 19 },
];