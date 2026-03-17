// src/entities/service/models/mockData.ts
import { Service } from '@shared/types';

export const SERVICES: Service[] = [
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
