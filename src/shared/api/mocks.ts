
export const doctors = [
  {
    id: '1',
    name: 'Dr. Arnold Chen',
    spec: 'Ортопед',
    rating: 4.9,
    reviews: 124,
    image: 'https://www.pinnacledentalgroupmi.com/wp-content/uploads/2023/11/general-dentistry-img.jpeg'
  },
  {
    id: '2',
    name: 'Dr. Marcus Vance',
    spec: 'Хирург',
    rating: 5.0,
    reviews: 98,
    image: 'https://t4.ftcdn.net/jpg/02/40/98/21/360_F_240982187_auR9cM9G0gGmXvh1RZJoBufjTKVIclC3.jpg',
  },
  {
    id: '3',
    name: 'Dr. Elena Rodriguez',
    spec: 'Имплантолог',
    rating: 4.8,
    reviews: 210,
    image: 'https://www.pinnacledentalgroupmi.com/wp-content/uploads/2023/11/FemaleDentist_1110x700.jpeg',
  },
  {
    id: '4',
    name: 'Dr. Arnold Chen',
    spec: 'Терапевт',
    rating: 4.9,
    reviews: 124,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4Taw2jOKl8OTdYdL6ZW4i5J79LimZrjhKkw&s'
  },
  {
    id: '5',
    name: 'Dr. Marcus Vance',
    spec: 'Хирург',
    rating: 5.0,
    reviews: 98,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjoQgcjD2kQjbcZ6zs3BzRhmu94HAN03tI2Q&s',
  },
];

interface Appointment {
  doctorName: string;
  specialty: string;
  procedure: string;
  day: number;
  month: string;
  time: string;
  rating: number;
}

// const APPOINTMENT: Appointment = {
//   doctorName: 'Саакян Д.',
//   specialty: 'Терапевт',
//   procedure: 'Ани Саргсян',
//   day: 12,
//   month: 'НОЯ',
//   time: '11:00',
//   rating: 4.9,
// };

