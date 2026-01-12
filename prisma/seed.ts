import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Démarrage du seed...");

  // Clear existing data (except properties and hero sections as requested)
  await prisma.heroClick.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.session.deleteMany();
  await prisma.oTPCode.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const hashedPassword = await bcrypt.hash("Admin123!", 10);
  const admin = await prisma.user.create({
    data: {
      email: "admin@realestate.com",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin créé:", admin.email);

  // Create regular user
  const userPassword = await bcrypt.hash("User123!", 10);
  const user = await prisma.user.create({
    data: {
      email: "user@realestate.com",
      name: "John Doe",
      password: userPassword,
      role: "USER",
    },
  });

  console.log("✅ User créé:", user.email);

  // Get existing properties (you mentioned you already have 2 properties)
  const properties = await prisma.property.findMany({
    take: 2,
  });

  if (properties.length === 0) {
    console.log("⚠️ Aucune propriété trouvée dans la base de données.");
    console.log("💡 Veuillez d'abord créer des propriétés via l'interface admin.");
    return;
  }

  console.log(`✅ ${properties.length} propriétés existantes trouvées`);

  // Use first property for reservation (assuming it's a rental property)
  const firstProperty = properties[0];

  // Create 1 reservation
  const reservation = await prisma.reservation.create({
    data: {
      propertyId: firstProperty.id,
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-03-15"),
      guestName: "Ahmed Bennani",
      guestEmail: "ahmed.bennani@example.com",
      guestPhone: "+212-6-12-34-56-78",
      message: "Très intéressé par cette propriété. Disponible pour visite?",
      status: "CONFIRMED",
      totalPrice: firstProperty.price * 14,
      userId: user.id,
    },
  });

  console.log(`✅ 1 réservation créée`);

  // Create 1 lead (use second property if available, otherwise first)
  const secondProperty = properties.length > 1 ? properties[1] : firstProperty;

  const lead = await prisma.lead.create({
    data: {
      propertyId: secondProperty.id,
      name: "Mohammed Alami",
      email: "mohammed.alami@example.com",
      phone: "+212-6-11-22-33-44",
      message: "Très intéressé par cette propriété. Possibilité de visite la semaine prochaine?",
      status: "NEW",
    },
  });

  console.log(`✅ 1 lead créé`);

  // Create 1 blog post
  const blog = await prisma.blog.create({
    data: {
      title: "Guide Complet de l'Investissement Immobilier au Maroc 2024",
      slug: "guide-investissement-immobilier-maroc-2024",
      content: `# L'Investissement Immobilier au Maroc

L'investissement immobilier au Maroc représente une opportunité exceptionnelle pour les investisseurs locaux et internationaux. Avec une économie en croissance et un secteur immobilier dynamique, le Maroc offre de nombreuses possibilités.

## Pourquoi Investir au Maroc?

1. **Stabilité Économique**: Le Maroc bénéficie d'une économie stable et diversifiée
2. **Position Géographique**: Entre l'Europe et l'Afrique, le Maroc est stratégiquement placé
3. **Cadre Juridique**: Protection des investisseurs étrangers
4. **Développement Touristique**: Secteur en pleine expansion

## Les Meilleures Villes pour Investir

### Casablanca
La capitale économique offre les meilleurs rendements locatifs, particulièrement dans les quartiers d'affaires.

### Marrakech
Destination touristique majeure, idéale pour l'investissement dans les riads et villas de luxe.

### Rabat
La capitale administrative attire les fonctionnaires et diplomates, garantissant une demande locative stable.

### Tanger
Avec le nouveau port Tanger Med, la ville connaît un développement économique impressionnant.

## Conseils Pratiques

- Faites appel à un notaire local
- Vérifiez tous les documents de propriété
- Considérez l'emplacement avec soin
- Calculez tous les frais (notaire, agence, taxes)
- Visitez plusieurs fois avant d'acheter

## Conclusion

L'investissement immobilier au Maroc peut être très rentable si vous prenez le temps de bien vous informer et de choisir le bon emplacement.`,
      excerpt: "Guide complet pour investir dans l'immobilier marocain en 2024. Découvrez les meilleures opportunités et conseils d'experts.",
      coverImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600",
      category: "Guide d'Investissement",
      isPublished: true,
      publishedAt: new Date(),
      metaTitle: "Guide Investissement Immobilier Maroc 2024 | Conseils & Opportunités",
      metaDescription: "Découvrez comment investir dans l'immobilier au Maroc. Guide complet avec conseils d'experts, meilleures villes et stratégies gagnantes.",
      userId: admin.id,
    },
  });

  console.log(`✅ 1 article de blog créé`);

  console.log("\n🎉 Seed complété avec succès!");
  console.log("\n📊 Données créées:");
  console.log("  - 2 utilisateurs (1 admin, 1 user)");
  console.log("  - 1 réservation");
  console.log("  - 1 lead");
  console.log("  - 1 article de blog");
  console.log("\n💡 Note: Les propriétés et sections hero existantes ont été préservées");
  console.log("\n📋 Identifiants de test:");
  console.log("  Admin: admin@realestate.com / Admin123!");
  console.log("  User: user@realestate.com / User123!");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
