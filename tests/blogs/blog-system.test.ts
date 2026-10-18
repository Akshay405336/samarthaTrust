import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { BlogStatus, Role } from "@prisma/client";
import { hashPassword } from "@/lib/auth/password";
import { authenticateSuperAdmin } from "@/lib/auth/session-service";
import { AUTH_COOKIES } from "@/lib/auth/constants";
import {
  generateSlug,
  calculateReadTime,
  createBlogSchema,
} from "@/lib/validations/blog";
import {
  createBlog,
  updateBlog,
  getBlogById,
  getBlogBySlug,
  publishBlog,
  unpublishBlog,
  archiveBlog,
  toggleFeatureBlog,
  listPublishedBlogs,
  ensureUniqueSlug,
} from "@/lib/blogs/blog-service";
import { GET as publicBlogSlugHandler } from "@/app/api/blogs/[slug]/route";
import {
  GET as adminBlogsGetHandler,
  POST as adminBlogsPostHandler,
} from "@/app/api/admin/blogs/route";

describe("Blog Management System", () => {
  const testAdminEmail = "blog-test-admin@samarthatrust.org";
  const testAdminPassword = "BlogAdminPassword2026!";
  let testUserId = "";
  let adminAccessToken = "";
  let adminRefreshToken = "";
  const createdBlogIds: string[] = [];

  beforeAll(async () => {
    // Clean up test user
    await prisma.user.deleteMany({ where: { email: testAdminEmail } });

    // Create test Super Admin user
    const hash = await hashPassword(testAdminPassword);
    const user = await prisma.user.create({
      data: {
        email: testAdminEmail,
        name: "Blog Test Admin",
        passwordHash: hash,
        role: Role.SUPER_ADMIN,
        isActive: true,
      },
    });
    testUserId = user.id;

    // Authenticate and get tokens
    const authResult = await authenticateSuperAdmin(
      testAdminEmail,
      testAdminPassword
    );
    if (!authResult.success) {
      throw new Error("Failed to authenticate test admin: " + authResult.error);
    }
    adminAccessToken = authResult.accessToken;
    adminRefreshToken = authResult.refreshToken;
  });

  afterAll(async () => {
    // Clean up any test blogs created
    if (createdBlogIds.length > 0) {
      await prisma.blog.deleteMany({
        where: { id: { in: createdBlogIds } },
      });
    }

    // Clean up test user and active sessions
    await prisma.session.deleteMany({ where: { userId: testUserId } });
    await prisma.user.deleteMany({ where: { id: testUserId } });
    await prisma.$disconnect();
  });

  describe("Validation & Helper Utilities", () => {
    it("generates clean, URL-friendly slugs from arbitrary text", () => {
      expect(generateSlug("Empowering Rural Communities in 2026")).toBe(
        "empowering-rural-communities-in-2026"
      );
      expect(
        generateSlug("   Multiple   Spaces   &   Special!  Chars?  ")
      ).toBe("multiple-spaces-special-chars");
      expect(generateSlug("---Leading and Trailing Hyphens---")).toBe(
        "leading-and-trailing-hyphens"
      );
    });

    it("calculates accurate estimated reading time", () => {
      expect(calculateReadTime("")).toBe("1 min read");
      expect(calculateReadTime("Short article")).toBe("1 min read");
      // ~450 words should be ~3 min read (at ~200 wpm)
      const longText = Array(450).fill("word").join(" ");
      expect(calculateReadTime(longText)).toBe("3 min read");
    });

    it("validates blog creation input correctly", () => {
      const valid = createBlogSchema.safeParse({
        title: "Valid Title Test",
        content: "This is valid content with enough characters.",
        tags: "Education, Health, Welfare",
      });
      expect(valid.success).toBe(true);
      if (valid.success) {
        expect(valid.data.tags).toEqual(["Education", "Health", "Welfare"]);
      }

      // Title too short
      const invalidTitle = createBlogSchema.safeParse({
        title: "Hi",
        content: "Valid content here.",
      });
      expect(invalidTitle.success).toBe(false);

      // Content too short
      const invalidContent = createBlogSchema.safeParse({
        title: "Valid Title",
        content: "Short",
      });
      expect(invalidContent.success).toBe(false);
    });
  });

  describe("Service Layer CRUD & Slug Collision Handling", () => {
    it("ensures unique slugs by automatically suffixing collision numbers", async () => {
      const baseTitle = "Unique Slug Collision Test Story";
      const slug1 = await ensureUniqueSlug(baseTitle);
      expect(slug1).toBe("unique-slug-collision-test-story");

      // Create blog with slug1
      const blog1 = await createBlog(
        {
          title: baseTitle,
          content: "Content for first collision test article.",
          slug: slug1,
        },
        testUserId
      );
      createdBlogIds.push(blog1.id);

      // Generating slug for the same title should now append -1
      const slug2 = await ensureUniqueSlug(baseTitle);
      expect(slug2).toBe("unique-slug-collision-test-story-1");

      const blog2 = await createBlog(
        {
          title: baseTitle,
          content: "Content for second collision test article.",
          slug: slug2,
        },
        testUserId
      );
      createdBlogIds.push(blog2.id);

      // Third collision should append -2
      const slug3 = await ensureUniqueSlug(baseTitle);
      expect(slug3).toBe("unique-slug-collision-test-story-2");
    });

    it("creates, updates, and fetches blog posts", async () => {
      const newBlog = await createBlog(
        {
          title: "CRUD Lifecycle Test Post",
          excerpt: "Excerpt for lifecycle test.",
          content: "Detailed markdown content for lifecycle test.",
          category: "Education",
          tags: ["Test", "Lifecycle"],
          status: BlogStatus.DRAFT,
        },
        testUserId
      );
      createdBlogIds.push(newBlog.id);

      expect(newBlog.id).toBeDefined();
      expect(newBlog.status).toBe(BlogStatus.DRAFT);
      expect(newBlog.publishedAt).toBeNull();

      // Update blog
      const updated = await updateBlog(newBlog.id, {
        title: "CRUD Lifecycle Test Post Updated",
        excerpt: "Updated excerpt text.",
      });
      expect(updated.title).toBe("CRUD Lifecycle Test Post Updated");
      expect(updated.excerpt).toBe("Updated excerpt text.");

      // Fetch by ID
      const fetched = await getBlogById(newBlog.id);
      expect(fetched?.id).toBe(newBlog.id);
    });

    it("manages publishing, unpublishing, archiving, and featuring", async () => {
      const blog = await createBlog(
        {
          title: "State Transition Test Story",
          content: "Comprehensive content for state transition test.",
          status: BlogStatus.DRAFT,
        },
        testUserId
      );
      createdBlogIds.push(blog.id);

      // 1. Publish
      const published = await publishBlog(blog.id);
      expect(published.status).toBe(BlogStatus.PUBLISHED);
      expect(published.publishedAt).not.toBeNull();

      // 2. Feature
      const featured = await toggleFeatureBlog(blog.id, true);
      expect(featured.isFeatured).toBe(true);

      // 3. Unpublish back to draft
      const unpublished = await unpublishBlog(blog.id);
      expect(unpublished.status).toBe(BlogStatus.DRAFT);
      expect(unpublished.publishedAt).toBeNull();

      // 4. Archive
      const archived = await archiveBlog(blog.id);
      expect(archived.status).toBe(BlogStatus.ARCHIVED);
    });
  });

  describe("Strict Public Safeguards (No Draft or Archived Leakage)", () => {
    it("never returns draft or archived blogs when publicOnly is set to true", async () => {
      // Create a draft post
      const draft = await createBlog(
        {
          title: "Secret Unreleased Draft Article",
          content: "Confidential content that must never be publicly exposed.",
          status: BlogStatus.DRAFT,
        },
        testUserId
      );
      createdBlogIds.push(draft.id);

      // Create an archived post
      const archived = await createBlog(
        {
          title: "Old Archived Article Removed from Site",
          content: "Archived content not visible on public blog.",
          status: BlogStatus.ARCHIVED,
        },
        testUserId
      );
      createdBlogIds.push(archived.id);

      // getBlogBySlug with publicOnly = true must return null
      const draftPublicResult = await getBlogBySlug(draft.slug, true);
      expect(draftPublicResult).toBeNull();

      const archivedPublicResult = await getBlogBySlug(archived.slug, true);
      expect(archivedPublicResult).toBeNull();

      // Admin view (publicOnly = false) can still access them
      const draftAdminResult = await getBlogBySlug(draft.slug, false);
      expect(draftAdminResult?.id).toBe(draft.id);

      // listPublishedBlogs must strictly exclude draft and archived posts
      const publicList = await listPublishedBlogs({ limit: 100 });
      const ids = publicList.data.map((b) => b.id);
      expect(ids).not.toContain(draft.id);
      expect(ids).not.toContain(archived.id);
    });

    it("public API endpoint (/api/blogs/[slug]) returns 404 for draft posts", async () => {
      const draftBlog = await createBlog(
        {
          title: "API Safeguard Draft Post",
          content: "Content that should be protected by API endpoint.",
          status: BlogStatus.DRAFT,
        },
        testUserId
      );
      createdBlogIds.push(draftBlog.id);

      const req = new NextRequest(
        `http://localhost:3000/api/blogs/${draftBlog.slug}`
      );
      const res = await publicBlogSlugHandler(req, {
        params: Promise.resolve({ slug: draftBlog.slug }),
      });

      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toMatch(/not found/i);
    });
  });

  describe("Admin API Security & Operations", () => {
    it("rejects unauthorized access to admin blog management endpoints", async () => {
      // Missing session cookie
      const unauthReq = new NextRequest(
        "http://localhost:3000/api/admin/blogs",
        {
          method: "GET",
        }
      );
      const unauthRes = await adminBlogsGetHandler(unauthReq);
      expect(unauthRes.status).toBe(401);

      // Post without session
      const unauthPostReq = new NextRequest(
        "http://localhost:3000/api/admin/blogs",
        {
          method: "POST",
          body: JSON.stringify({
            title: "Unauthorized Story",
            content: "Should not be created.",
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const unauthPostRes = await adminBlogsPostHandler(unauthPostReq);
      expect(unauthPostRes.status).toBe(401);
    });

    it("allows authorized Super Admin to fetch and create blogs through admin API", async () => {
      const authReq = new NextRequest("http://localhost:3000/api/admin/blogs", {
        method: "GET",
        headers: {
          cookie: `${AUTH_COOKIES.ACCESS_TOKEN}=${adminAccessToken}; ${AUTH_COOKIES.REFRESH_TOKEN}=${adminRefreshToken}`,
        },
      });
      const authRes = await adminBlogsGetHandler(authReq);
      expect(authRes.status).toBe(200);
      const data = await authRes.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);

      // Create new blog via Admin POST route
      const createReq = new NextRequest(
        "http://localhost:3000/api/admin/blogs",
        {
          method: "POST",
          body: JSON.stringify({
            title: "Super Admin Created Story Via API",
            content:
              "Content composed by admin through authenticated API route.",
            category: "Healthcare",
            status: "DRAFT",
          }),
          headers: {
            "Content-Type": "application/json",
            cookie: `${AUTH_COOKIES.ACCESS_TOKEN}=${adminAccessToken}; ${AUTH_COOKIES.REFRESH_TOKEN}=${adminRefreshToken}`,
          },
        }
      );
      const createRes = await adminBlogsPostHandler(createReq);
      expect(createRes.status).toBe(201);
      const createData = await createRes.json();
      expect(createData.success).toBe(true);
      expect(createData.data.title).toBe("Super Admin Created Story Via API");
      createdBlogIds.push(createData.data.id);
    });
  });
});
