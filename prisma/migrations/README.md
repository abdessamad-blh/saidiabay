# Database Migrations

This folder contains Prisma migrations for the Agency Boilerplate project.

## 📦 How to Apply Migrations (For Colleagues)

### First Time Setup

1. **Clone the repository** and navigate to the project directory

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your .env file** with your database connection:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/agency_db"
   ```

4. **Apply all migrations:**
   ```bash
   npx prisma migrate deploy
   ```

   Or if you want to reset and start fresh:
   ```bash
   npx prisma migrate reset
   npx prisma db push
   ```

5. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

6. **(Optional) Seed the database:**
   ```bash
   npm run seed
   ```

## Migration Contents

This migration includes:
- ✅ **User management system** (User, Session, OTPCode)
- ✅ **Property management** (Property, City, BlockedDate)
- ✅ **Reservation system** (Reservation)
- ✅ **Lead management** (Lead)
- ✅ **Blog system** (Blog)
- ✅ **Hero sections with click tracking** (HeroSection, HeroClick) ← **NEW**
- ✅ **Sales tracking** (Sale)

## Hero Click Tracking Features
The migration includes:
- `hero_sections` table: Stores hero images with their links
- `hero_clicks` table: Tracks clicks with visitor/user IDs
- Proper indexes for performance
- Foreign key relationships for data integrity

Your colleagues can now apply this migration to their databases!
