import { PrismaClient } from "@prisma/client";
import { synchronizeSuperAdmin } from "../src/lib/auth/seed-service";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Samartha Trust Super Admin synchronization...");

  try {
    const result = await synchronizeSuperAdmin(
      {
        email: process.env.SUPER_ADMIN_EMAIL,
        password: process.env.SUPER_ADMIN_PASSWORD,
        name: process.env.SUPER_ADMIN_NAME,
      },
      prisma
    );

    console.log(`✅ Super Admin ${result.action} successfully!`);
    console.log(`   User ID: ${result.userId}`);
    console.log(`   Email:   ${result.email}`);
    console.log(`   Role:    ${result.role}`);
    console.log(`   Status:  ${result.message}`);
    console.log("🌱 Super Admin seed synchronization completed successfully.");
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error during seed execution.";
    console.error("❌ " + message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(async (e) => {
  console.error("❌ Fatal error in seed:", e);
  await prisma.$disconnect();
  process.exit(1);
});
