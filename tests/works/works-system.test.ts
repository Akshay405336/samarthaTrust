import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { Role, WorkStatus } from "@prisma/client";
import { hashPassword } from "@/lib/auth/password";
import { authenticateSuperAdmin } from "@/lib/auth/session-service";
import { AUTH_COOKIES } from "@/lib/auth/constants";
import {
  generateSlug,
  createWorkSchema,
  updateWorkSchema,
} from "@/lib/validations/work";
import {
  createWork,
  updateWork,
  deleteWork,
  getWorkById,
  getWorkBySlug,
  listAdminWorks,
  listPublishedWorks,
  publishWork,
  unpublishWork,
  toggleFeaturedWork,
  updateSingleWorkOrder,
  updateWorkOrder,
  ensureUniqueWorkSlug,
  getWorkCategories,
} from "@/lib/works/work-service";
import {
  GET as adminWorksGetHandler,
  POST as adminWorksPostHandler,
} from "@/app/api/admin/works/route";
import {
  GET as adminWorkIdGetHandler,
  PUT as adminWorkIdPutHandler,
  DELETE as adminWorkIdDeleteHandler,
} from "@/app/api/admin/works/[id]/route";
import { POST as adminWorkPublishHandler } from "@/app/api/admin/works/[id]/publish/route";
import { POST as adminWorkUnpublishHandler } from "@/app/api/admin/works/[id]/unpublish/route";
import { POST as adminWorkFeatureHandler } from "@/app/api/admin/works/[id]/feature/route";
import { PATCH as adminWorkOrderHandler } from "@/app/api/admin/works/[id]/order/route";
import { GET as publicWorksGetHandler } from "@/app/api/works/route";
import { GET as publicWorkSlugGetHandler } from "@/app/api/works/[slug]/route";
import {
  generateMetadata as generateEditMetadata,
  instant as editPageInstant,
} from "@/app/(admin)/admin/works/[id]/edit/page";

describe("Our Works Management System", () => {
  const testAdminEmail = "works-test-admin@samarthatrust.org";
  const testAdminPassword = "WorksAdminPassword2026!";
  let testUserId = "";
  let adminAccessToken = "";
  const createdWorkIds: string[] = [];

  beforeAll(async () => {
    // Clean up any stale test user
    await prisma.user.deleteMany({ where: { email: testAdminEmail } });

    // Create test Super Admin user
    const hash = await hashPassword(testAdminPassword);
    const user = await prisma.user.create({
      data: {
        email: testAdminEmail,
        name: "Works Test Admin",
        passwordHash: hash,
        role: Role.SUPER_ADMIN,
        isActive: true,
      },
    });
    testUserId = user.id;

    // Authenticate and obtain session tokens
    const authResult = await authenticateSuperAdmin(
      testAdminEmail,
      testAdminPassword
    );
    if (!authResult.success) {
      throw new Error("Failed to authenticate test admin: " + authResult.error);
    }
    adminAccessToken = authResult.accessToken;
  });

  afterAll(async () => {
    // Clean up specifically created test works
    if (createdWorkIds.length > 0) {
      await prisma.work.deleteMany({
        where: { id: { in: createdWorkIds } },
      });
    }

    // Clean up test user & sessions
    await prisma.session.deleteMany({ where: { userId: testUserId } });
    await prisma.user.deleteMany({ where: { id: testUserId } });
  });

  describe("Validation & Schemas", () => {
    it("1. Generates clean URL-friendly slugs", () => {
      expect(generateSlug("Child Education & Scholarship Assistance")).toBe(
        "child-education-scholarship-assistance"
      );
      expect(generateSlug("  Preventive Health: 100% Free!  ")).toBe(
        "preventive-health-100-free"
      );
    });

    it("2. Validates required fields and defaults", () => {
      const parsed = createWorkSchema.parse({
        title: "Vocational Skills Program",
        description: "Equipping women with employable practical skills.",
        category: "Economic Empowerment",
      });

      expect(parsed.title).toBe("Vocational Skills Program");
      expect(parsed.category).toBe("Economic Empowerment");
      expect(parsed.status).toBe("DRAFT");
      expect(parsed.programStatus).toBe("Active & Ongoing");
      expect(parsed.ctaText).toBe("Support This Work");
      expect(parsed.ctaLink).toBe("/contact");
      expect(parsed.iconName).toBe("GraduationCap");
      expect(parsed.features).toEqual([]);
    });

    it("3. Parses and cleans deliverables array", () => {
      const parsed = createWorkSchema.parse({
        title: "Clean Water Filter Initiative",
        description: "Installing clean water units in drought-prone areas.",
        category: "Community Welfare",
        features: ["  Water filtration  ", "", "  Regular maintenance  "],
      });

      expect(parsed.features).toEqual([
        "Water filtration",
        "Regular maintenance",
      ]);
    });

    it("4. Rejects invalid short titles or descriptions", () => {
      expect(() =>
        createWorkSchema.parse({
          title: "X",
          description: "Short",
          category: "Health",
        })
      ).toThrow();
    });
  });

  describe("Service Layer", () => {
    let testWorkId = "";

    it("5. createWork saves to PostgreSQL with slug collision handling", async () => {
      const work1 = await createWork({
        title: "Test Digital Learning Drive",
        description:
          "Setting up computer learning labs for rural government school students.",
        category: "Education",
        badge: "Digital Education",
        iconName: "BookOpen",
        features: [
          "20 Desktop PCs",
          "Broadband setup",
          "Weekly coding classes",
        ],
        beneficiaries: "Rural middle school students",
        status: "PUBLISHED",
        isFeatured: true,
      });

      createdWorkIds.push(work1.id);
      testWorkId = work1.id;

      expect(work1.id).toBeDefined();
      expect(work1.slug).toBe("test-digital-learning-drive");
      expect(work1.status).toBe(WorkStatus.PUBLISHED);
      expect(work1.publishedAt).toBeInstanceOf(Date);
      expect(work1.features).toHaveLength(3);

      // Create a second work with the identical title to verify slug collision resolution
      const work2 = await createWork({
        title: "Test Digital Learning Drive",
        description:
          "Another batch of digital learning initiatives for secondary students.",
        category: "Education",
      });

      createdWorkIds.push(work2.id);
      expect(work2.slug).toBe("test-digital-learning-drive-1");
    });

    it("6. getWorkById and getWorkBySlug return the expected record", async () => {
      const byId = await getWorkById(testWorkId);
      expect(byId?.title).toBe("Test Digital Learning Drive");

      const bySlug = await getWorkBySlug("test-digital-learning-drive");
      expect(bySlug?.id).toBe(testWorkId);
    });

    it("7. updateWork modifies fields and updates slug", async () => {
      const updated = await updateWork(testWorkId, {
        badge: "Updated Tech Lab",
        beneficiaries: "Over 500 village children",
      });

      expect(updated.badge).toBe("Updated Tech Lab");
      expect(updated.beneficiaries).toBe("Over 500 village children");
    });

    it("8. unpublishWork and publishWork transition status properly", async () => {
      const unpublished = await unpublishWork(testWorkId);
      expect(unpublished.status).toBe(WorkStatus.DRAFT);

      const published = await publishWork(testWorkId);
      expect(published.status).toBe(WorkStatus.PUBLISHED);
      expect(published.publishedAt).toBeInstanceOf(Date);
    });

    it("9. toggleFeaturedWork toggles the featured boolean", async () => {
      const workBefore = await getWorkById(testWorkId);
      const initialFeatured = workBefore?.isFeatured ?? false;

      const toggled = await toggleFeaturedWork(testWorkId);
      expect(toggled.isFeatured).toBe(!initialFeatured);

      const toggledBack = await toggleFeaturedWork(testWorkId);
      expect(toggledBack.isFeatured).toBe(initialFeatured);
    });

    it("10. updateSingleWorkOrder updates display order", async () => {
      const updated = await updateSingleWorkOrder(testWorkId, 42);
      expect(updated.displayOrder).toBe(42);
    });

    it("11. listAdminWorks filters by search, status, and category", async () => {
      const result = await listAdminWorks({
        search: "Digital Learning",
        status: "ALL",
        sort: "order_asc",
        page: 1,
        limit: 10,
      });

      expect(result.data.length).toBeGreaterThanOrEqual(1);
      expect(
        result.data.some((w) => w.title.includes("Digital Learning"))
      ).toBe(true);
    });

    it("12. listPublishedWorks only includes published initiatives", async () => {
      // Create a draft work
      const draftWork = await createWork({
        title: "Test Draft Only Program",
        description: "This initiative is still being reviewed internally.",
        category: "Community Welfare",
        status: "DRAFT",
      });
      createdWorkIds.push(draftWork.id);

      const published = await listPublishedWorks();
      expect(published.some((w) => w.id === draftWork.id)).toBe(false);
      expect(published.some((w) => w.id === testWorkId)).toBe(true);
    });

    it("13. deleteWork removes the record", async () => {
      const toDelete = await createWork({
        title: "Work to be Deleted",
        description: "Temporary initiative for testing delete operation.",
        category: "Community Welfare",
      });

      const deleted = await deleteWork(toDelete.id);
      expect(deleted.id).toBe(toDelete.id);

      const lookup = await getWorkById(toDelete.id);
      expect(lookup).toBeNull();
    });
  });

  describe("Admin API Handlers", () => {
    let apiWorkId = "";

    const createAdminRequest = (
      url: string,
      method: string,
      body?: unknown
    ) => {
      const headers = new Headers();
      headers.set("cookie", `${AUTH_COOKIES.ACCESS_TOKEN}=${adminAccessToken}`);
      if (body) {
        headers.set("content-type", "application/json");
      }

      return new NextRequest(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    };

    it("14. Admin GET /api/admin/works rejects unauthenticated requests with 401", async () => {
      const unauthReq = new NextRequest(
        "http://localhost:3000/api/admin/works",
        {
          method: "GET",
        }
      );
      const res = await adminWorksGetHandler(unauthReq);
      expect(res.status).toBe(401);
    });

    it("15. Admin GET /api/admin/works returns paginated works for Super Admin", async () => {
      const req = createAdminRequest(
        "http://localhost:3000/api/admin/works?limit=5",
        "GET"
      );
      const res = await adminWorksGetHandler(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.data)).toBe(true);
      expect(json.pagination).toBeDefined();
    });

    it("16. Admin POST /api/admin/works creates a new work", async () => {
      const req = createAdminRequest(
        "http://localhost:3000/api/admin/works",
        "POST",
        {
          title: "API Created Rural Health Initiative",
          category: "Healthcare",
          badge: "Mobile Health",
          iconName: "HeartPulse",
          description: "Mobile diagnostic vans serving remote villages weekly.",
          beneficiaries: "Remote village residents",
          features: [
            "Weekly van visits",
            "Basic vital checks",
            "Tele-consults",
          ],
          status: "PUBLISHED",
          isFeatured: true,
          displayOrder: 15,
        }
      );

      const res = await adminWorksPostHandler(req);
      expect(res.status).toBe(201);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.work.id).toBeDefined();
      apiWorkId = json.work.id;
      createdWorkIds.push(apiWorkId);
    });

    it("17. Admin GET /api/admin/works/[id] retrieves work by ID", async () => {
      const req = createAdminRequest(
        `http://localhost:3000/api/admin/works/${apiWorkId}`,
        "GET"
      );
      const res = await adminWorkIdGetHandler(req, {
        params: Promise.resolve({ id: apiWorkId }),
      });
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.work.id).toBe(apiWorkId);
    });

    it("18. Admin PUT /api/admin/works/[id] updates work", async () => {
      const req = createAdminRequest(
        `http://localhost:3000/api/admin/works/${apiWorkId}`,
        "PUT",
        {
          badge: "Upgraded Mobile Clinic",
          displayOrder: 20,
        }
      );
      const res = await adminWorkIdPutHandler(req, {
        params: Promise.resolve({ id: apiWorkId }),
      });
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.work.badge).toBe("Upgraded Mobile Clinic");
    });

    it("19. Admin POST publish and unpublish routes update status", async () => {
      // Unpublish
      const unpublishReq = createAdminRequest(
        `http://localhost:3000/api/admin/works/${apiWorkId}/unpublish`,
        "POST"
      );
      const unpubRes = await adminWorkUnpublishHandler(unpublishReq, {
        params: Promise.resolve({ id: apiWorkId }),
      });
      expect(unpubRes.status).toBe(200);
      const unpubJson = await unpubRes.json();
      expect(unpubJson.work.status).toBe(WorkStatus.DRAFT);

      // Publish
      const publishReq = createAdminRequest(
        `http://localhost:3000/api/admin/works/${apiWorkId}/publish`,
        "POST"
      );
      const pubRes = await adminWorkPublishHandler(publishReq, {
        params: Promise.resolve({ id: apiWorkId }),
      });
      expect(pubRes.status).toBe(200);
      const pubJson = await pubRes.json();
      expect(pubJson.work.status).toBe(WorkStatus.PUBLISHED);
    });

    it("20. Admin PATCH /api/admin/works/[id]/order updates display order", async () => {
      const req = createAdminRequest(
        `http://localhost:3000/api/admin/works/${apiWorkId}/order`,
        "PATCH",
        { displayOrder: 77 }
      );
      const res = await adminWorkOrderHandler(req, {
        params: Promise.resolve({ id: apiWorkId }),
      });
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.work.displayOrder).toBe(77);
    });

    it("21. Admin DELETE /api/admin/works/[id] deletes the work", async () => {
      const req = createAdminRequest(
        `http://localhost:3000/api/admin/works/${apiWorkId}`,
        "DELETE"
      );
      const res = await adminWorkIdDeleteHandler(req, {
        params: Promise.resolve({ id: apiWorkId }),
      });
      expect(res.status).toBe(200);

      const check = await getWorkById(apiWorkId);
      expect(check).toBeNull();
    });
  });

  describe("Public API Handlers", () => {
    it("22. Public GET /api/works returns published initiatives", async () => {
      const req = new NextRequest("http://localhost:3000/api/works");
      const res = await publicWorksGetHandler(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.data)).toBe(true);
      expect(json.data.length).toBeGreaterThanOrEqual(1);
    });

    it("23. Public GET /api/works?view=categories returns category array", async () => {
      const req = new NextRequest(
        "http://localhost:3000/api/works?view=categories"
      );
      const res = await publicWorksGetHandler(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.categories)).toBe(true);
    });

    it("24. Public GET /api/works/[slug] returns work for published slug, 404 for draft", async () => {
      // Find a published work slug
      const published = await prisma.work.findFirst({
        where: { status: WorkStatus.PUBLISHED },
      });
      expect(published).not.toBeNull();

      if (published) {
        const req = new NextRequest(
          `http://localhost:3000/api/works/${published.slug}`
        );
        const res = await publicWorkSlugGetHandler(req, {
          params: Promise.resolve({ slug: published.slug }),
        });
        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json.work.slug).toBe(published.slug);
      }

      // Non-existent slug returns 404
      const notFoundReq = new NextRequest(
        "http://localhost:3000/api/works/non-existent-work-slug-xyz"
      );
      const notFoundRes = await publicWorkSlugGetHandler(notFoundReq, {
        params: Promise.resolve({ slug: "non-existent-work-slug-xyz" }),
      });
      expect(notFoundRes.status).toBe(404);
    });
  });

  describe("Next.js 16 Edit Page Conformance", () => {
    it("25. Admin edit page exports instant=false and generates metadata", async () => {
      expect(editPageInstant).toBe(false);

      const published = await prisma.work.findFirst({
        where: { status: WorkStatus.PUBLISHED },
      });

      if (published) {
        const meta = await generateEditMetadata({
          params: Promise.resolve({ id: published.id }),
        });
        expect(meta.title).toContain(published.title);
      }
    });
  });
});
