import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du seed...');

  // Clean existing data
  await prisma.heroClick.deleteMany();
  await prisma.heroSection.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.blockedDate.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.property.deleteMany();
  await prisma.city.deleteMany();
  await prisma.oTPCode.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Données existantes nettoyées');

  // Hash passwords
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const userPassword = await bcrypt.hash('User@123', 10);

  // Create Admin User
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      name: 'Admin User',
      email: 'admin@agency.com',
      password: adminPassword,
      phone: '0605911322',
      role: 'ADMIN',
    },
  });
  console.log('✅ Utilisateur admin créé');

  // Create Regular User
  const user = await prisma.user.create({
    data: {
      username: 'john_doe',
      name: 'John Doe',
      email: 'john@example.com',
      password: userPassword,
      phone: '0612345678',
      role: 'USER',
    },
  });
  console.log('✅ Utilisateur régulier créé');

  // Create Cities
  const casablanca = await prisma.city.create({
    data: {
      name: 'Casablanca',
      slug: 'casablanca',
      user: {
        connect: { id: admin.id },
      },
    },
  });

  const rabat = await prisma.city.create({
    data: {
      name: 'Rabat',
      slug: 'rabat',
      user: {
        connect: { id: admin.id },
      },
    },
  });
  console.log('✅ Villes créées');


  console.log('\n🎉 Seed terminé avec succès!\n');
  console.log('📊 Résumé:');
  console.log('  - 2 Utilisateurs (1 admin, 1 utilisateur)');
  console.log('  - 2 Villes (Casablanca, Rabat)');
  // console.log('  - 2 Propriétés (1 location, 1 vente)');
  // console.log('  - 1 Réservation');
  // console.log('  - 1 Lead');
  // console.log('  - 1 Période de dates bloquées');
  // console.log('  - 2 Sections hero\n');
  console.log('🔐 Identifiants de connexion:');
  console.log('  Admin: admin@agency.com / Admin@123');
  console.log('  User:  john@example.com / User@123\n');
}

main()
  .catch((e) => {
    console.error('❌ Erreur pendant le seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });