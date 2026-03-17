// import { PrismaClient, Role } from '@prisma/client';
//
// const prisma = new PrismaClient();
//
// async function main() {
//   // Create some services
//   const cleaning = await prisma.service.upsert({
//     where: { id: 'svc_cleaning' },
//     update: {},
//     create: {
//       id: 'svc_cleaning',
//       name: 'Teeth Cleaning',
//       durationMin: 30,
//       priceCents: 3000,
//       active: true,
//     },
//   });
//   const filling = await prisma.service.upsert({
//     where: { id: 'svc_filling' },
//     update: {},
//     create: {
//       id: 'svc_filling',
//       name: 'Dental Filling',
//       durationMin: 45,
//       priceCents: 7000,
//       active: true,
//     },
//   });
//
//   // Create a provider with linked user
//   const user = await prisma.user.upsert({
//     where: { email: 'doctor@example.com' },
//     update: { name: 'Dr. Smith', role: 'PROVIDER' },
//     create: { email: 'doctor@example.com', name: 'Dr. Smith', role: Role.PROVIDER },
//   });
//
//   const provider = await prisma.provider.upsert({
//     where: { userId: user.id },
//     update: { bio: 'Experienced dentist', clinic: 'Downtown Clinic' },
//     create: { userId: user.id, bio: 'Experienced dentist', clinic: 'Downtown Clinic' },
//   });
//
//   // Link services to provider
//   await prisma.providerService.upsert({
//     where: { providerId_serviceId: { providerId: provider.id, serviceId: cleaning.id } },
//     update: {},
//     create: { providerId: provider.id, serviceId: cleaning.id },
//   });
//   await prisma.providerService.upsert({
//     where: { providerId_serviceId: { providerId: provider.id, serviceId: filling.id } },
//     update: {},
//     create: { providerId: provider.id, serviceId: filling.id },
//   });
//
//   // Generate some time slots for today and tomorrow
//   const now = new Date();
//   const days = [0, 1];
//   for (const d of days) {
//     const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + d, 0, 0, 0));
//     // 9:00 to 17:00, every 30 minutes
//     for (let h = 9; h < 17; h++) {
//       for (let m = 0; m < 60; m += 30) {
//         const start = new Date(date.getTime());
//         start.setUTCHours(h, m, 0, 0);
//         const end = new Date(start.getTime() + 30 * 60 * 1000);
//         await prisma.timeSlot.upsert({
//           where: { id: `${provider.id}_${start.toISOString()}` },
//           update: {},
//           create: { id: `${provider.id}_${start.toISOString()}`, providerId: provider.id, start, end },
//         });
//       }
//     }
//   }
//
//   console.log('Seed completed');
// }
//
// main().catch((e) => {
//   console.error(e);
//   process.exit(1);
// }).finally(async () => {
//   await prisma.$disconnect();
// });
