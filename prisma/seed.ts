import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Samartha Trust database seed foundation...");

  const superAdminEmail =
    process.env.SUPER_ADMIN_EMAIL || "admin@samarthatrust.org";
  const superAdminName =
    process.env.SUPER_ADMIN_NAME || "Samartha Trust Super Admin";

  // Password hashing will be wired with bcryptjs/argon2 in the upcoming authentication step
  const placeholderHash =
    "$2a$12$e8x/kZ66Wz65p89mP/Q11.EXAMPLE_HASH_PREPARED_FOR_AUTH";

  console.log(`Checking existing super admin user (${superAdminEmail})...`);

  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: superAdminEmail },
    });

    if (!existingAdmin) {
      const admin = await prisma.user.create({
        data: {
          email: superAdminEmail,
          name: superAdminName,
          passwordHash: placeholderHash,
          role: Role.SUPER_ADMIN,
          isActive: true,
        },
      });
      console.log(`✅ Super Admin created with ID: ${admin.id}`);
    } else {
      console.log(`ℹ️ Super Admin already exists with ID: ${existingAdmin.id}`);
    }

    console.log("🌱 Seed foundation completed successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to PostgreSQL during seed execution.");
    console.error(
      "Please verify that PostgreSQL is running and DATABASE_URL in .env is correctly configured."
    );
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
