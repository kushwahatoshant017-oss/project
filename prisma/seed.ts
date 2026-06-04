import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('Admin@123456', 12);
  const userPassword = await bcrypt.hash('User@123456', 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@weathersphere.com' },
    update: {},
    create: {
      email: 'superadmin@weathersphere.com',
      passwordHash: adminPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: Role.SUPER_ADMIN,
      isEmailVerified: true,
      isActive: true,
    },
  });
  console.log(`Created super admin: ${superAdmin.email}`);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@weathersphere.com' },
    update: {},
    create: {
      email: 'admin@weathersphere.com',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: Role.ADMIN,
      isEmailVerified: true,
      isActive: true,
    },
  });
  console.log(`Created admin: ${admin.email}`);

  const user = await prisma.user.upsert({
    where: { email: 'user@weathersphere.com' },
    update: {},
    create: {
      email: 'user@weathersphere.com',
      passwordHash: userPassword,
      firstName: 'Test',
      lastName: 'User',
      role: Role.USER,
      isEmailVerified: true,
      isActive: true,
    },
  });
  console.log(`Created user: ${user.email}`);

  const favorites = [
    { userId: user.id, latitude: 40.7128, longitude: -74.006, locationName: 'New York, NY', label: 'Home' },
    { userId: user.id, latitude: 34.0522, longitude: -118.2437, locationName: 'Los Angeles, CA', label: 'Office' },
    { userId: user.id, latitude: 51.5074, longitude: -0.1278, locationName: 'London, UK', label: 'Travel' },
  ];

  for (const fav of favorites) {
    await prisma.favoriteLocation.upsert({
      where: { userId_latitude_longitude: { userId: fav.userId, latitude: fav.latitude, longitude: fav.longitude } },
      update: {},
      create: fav,
    });
  }
  console.log('Created favorite locations');

  console.log('Seed completed!');
  console.log('');
  console.log('Login credentials:');
  console.log('  Super Admin: superadmin@weathersphere.com / Admin@123456');
  console.log('  Admin:       admin@weathersphere.com / Admin@123456');
  console.log('  User:        user@weathersphere.com / User@123456');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
