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

    // Seed initial blogs if none exist
    const blogCount = await prisma.blog.count();
    if (blogCount === 0) {
      console.log("🌱 Seeding initial published stories and field reports...");
      await prisma.blog.createMany({
        data: [
          {
            title:
              "Annual Education Drive: Distributing Learning Kits to Rural Students",
            slug: "annual-education-drive-2026",
            excerpt:
              "A comprehensive retrospective on our flagship education kit drive, bringing books, uniforms, and learning tools to hundreds of eager students.",
            content:
              "Education remains the most enduring engine for uplifting families out of cyclical poverty. During the kickoff of our annual drive across rural learning clusters, our volunteers assembled and distributed custom education kits equipped with grade-appropriate notebooks, geometric instruments, and reading primers.\n\nOver 450 students from five village primary schools received complete learning packs. In addition, our volunteer educators conducted foundational literacy evaluations and inaugurated after-school mentorship circles to support students preparing for regional board examinations.\n\nWe extend heartfelt gratitude to our individual donors and volunteer teachers whose tireless dedication makes this educational mission possible year after year.",
            coverImage: "/images/samartha-hero.png",
            authorName: "Samartha Outreach Team",
            authorId: result.userId,
            category: "Education",
            tags: ["Education", "Scholarships", "Rural Outreach"],
            status: "PUBLISHED",
            isFeatured: true,
            publishedAt: new Date("2026-10-10T10:00:00Z"),
            metaTitle: "Annual Education Drive 2026 | Samartha Trust",
            metaDescription:
              "Discover how Samartha Trust distributed essential learning kits to rural students, fostering quality education and brighter futures.",
          },
          {
            title: "Community Preventive Health Camp Highlights & Impact",
            slug: "community-preventive-health-camp-2026",
            excerpt:
              "Over 350 rural families benefited from comprehensive health consultations, blood pressure screenings, and preventive medicine advice.",
            content:
              "Early diagnosis is often the difference between a minor manageable health condition and a severe medical crisis for low-income wage earners. Partnering with dedicated volunteer doctors, Samartha Trust conducted a day-long diagnostic camp offering general medicine, eye tests, and pediatric care.\n\nThe camp provided free diagnostic screenings, blood pressure checks, diabetes monitoring, and complimentary prescription medicines for elderly villagers. Over 80 pairs of corrective eyeglasses were dispensed following on-site refraction exams.\n\nPreventive healthcare remains a cornerstone of our community welfare strategy, ensuring that remote populations enjoy health dignity without financial distress.",
            coverImage: "/images/about/about-heart.png",
            authorName: "Medical Advisory Committee",
            authorId: result.userId,
            category: "Healthcare",
            tags: ["Healthcare", "Health Camps", "Community Welfare"],
            status: "PUBLISHED",
            isFeatured: false,
            publishedAt: new Date("2026-09-24T10:00:00Z"),
            metaTitle:
              "Community Preventive Health Camp Highlights | Samartha Trust",
            metaDescription:
              "Read the field report from our free diagnostic health camp serving over 350 rural families with primary consultations and medicines.",
          },
          {
            title:
              "Empowering Rural Women Through Sustainable Handicraft Training",
            slug: "women-vocational-handicraft-program-2026",
            excerpt:
              "Discover the stories of local women who completed our three-month vocational skill enhancement program in Bengaluru rural.",
            content:
              "Financial self-reliance transforms not just an individual woman, but her entire family and household stability. We celebrated the graduation of 25 participants in our textile tailoring, embroidery, and eco-friendly packaging course.\n\nThrough structured mentorship and hands-on sewing workshops, participants developed high-demand artisanal skills. Each graduate received a certificate and guidance on forming self-help micro-enterprises to sell handcrafted items at cooperative markets.\n\nEmpowering women with marketable vocational skills is essential to building resilient, self-sustaining community economies.",
            coverImage: "/images/about/about-heart.png",
            authorName: "Livelihood Initiative Lead",
            authorId: result.userId,
            category: "Skill Development",
            tags: ["Livelihood", "Women Empowerment", "Skills"],
            status: "PUBLISHED",
            isFeatured: false,
            publishedAt: new Date("2026-08-18T10:00:00Z"),
            metaTitle:
              "Empowering Rural Women with Handicraft Training | Samartha Trust",
            metaDescription:
              "Learn how Samartha Trust's vocational training program equips rural women with tailoring and micro-enterprise skills for financial independence.",
          },
          {
            title:
              "Installing Sustainable Potable Water Filters in Rural Hamlets",
            slug: "clean-water-community-initiative-2026",
            excerpt:
              "Bringing safe, drinkable water access to over 120 households experiencing seasonal groundwater contamination.",
            content:
              "Safe drinking water is a fundamental human necessity. Through community contributions and philanthropic sponsorships, our trust installed high-capacity filtration units to protect villagers against recurring water-borne ailments.\n\nThe project included community water quality awareness sessions and training for village caretakers to ensure regular filter maintenance and sustainability. Today, over 120 families enjoy reliable access to clean, potable drinking water every day.\n\nWe remain committed to addressing foundational infrastructure gaps that impact community health and child well-being.",
            coverImage: "/images/samartha-hero.png",
            authorName: "Welfare Coordinator",
            authorId: result.userId,
            category: "Community Welfare",
            tags: ["Clean Water", "Hygiene", "Rural Development"],
            status: "PUBLISHED",
            isFeatured: false,
            publishedAt: new Date("2026-07-12T10:00:00Z"),
            metaTitle: "Clean Water Community Initiative | Samartha Trust",
            metaDescription:
              "Samartha Trust installed sustainable drinking water filtration units in rural hamlets, securing safe water access for 120+ households.",
          },
        ],
      });
      console.log("✅ Initial blogs seeded successfully!");
    } else {
      console.log(
        `ℹ️ Existing blogs found (${blogCount} posts). Skipping blog seed.`
      );
    }
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
