import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { Role } from "@prisma/client";
import { hashPassword } from "@/lib/auth/password";
import { authenticateSuperAdmin } from "@/lib/auth/session-service";
import { AUTH_COOKIES } from "@/lib/auth/constants";
import {
  generateSlug,
  createTeamMemberSchema,
  updateTeamMemberSchema,
} from "@/lib/validations/team";
import {
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getTeamMemberById,
  getTeamMemberBySlug,
  listAdminTeamMembers,
  listPublicTeamMembers,
  toggleTeamMemberActive,
  toggleTeamMemberFeatured,
  updateTeamMemberOrder,
  ensureUniqueTeamSlug,
} from "@/lib/team/team-service";
import {
  GET as adminTeamGetHandler,
  POST as adminTeamPostHandler,
} from "@/app/api/admin/team/route";
import {
  GET as adminTeamIdGetHandler,
  PATCH as adminTeamIdPatchHandler,
  DELETE as adminTeamIdDeleteHandler,
} from "@/app/api/admin/team/[id]/route";
import { PATCH as adminTeamToggleActiveHandler } from "@/app/api/admin/team/[id]/toggle-active/route";
import { PATCH as adminTeamFeatureHandler } from "@/app/api/admin/team/[id]/feature/route";
import { GET as publicTeamListHandler } from "@/app/api/team/route";
import { GET as publicTeamSlugHandler } from "@/app/api/team/[slug]/route";

describe("Team Management System", () => {
  const testAdminEmail = "team-test-admin@samarthatrust.org";
  const testAdminPassword = "TeamAdminPassword2026!";
  let testUserId = "";
  let adminAccessToken = "";
  const createdTeamMemberIds: string[] = [];

  beforeAll(async () => {
    // Clean up any stale test user
    await prisma.user.deleteMany({ where: { email: testAdminEmail } });

    // Create test Super Admin user
    const hash = await hashPassword(testAdminPassword);
    const user = await prisma.user.create({
      data: {
        email: testAdminEmail,
        name: "Team Test Admin",
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
    // Clean up specifically created test team members
    if (createdTeamMemberIds.length > 0) {
      await prisma.teamMember.deleteMany({
        where: { id: { in: createdTeamMemberIds } },
      });
    }

    // Clean up test user & sessions
    await prisma.session.deleteMany({ where: { userId: testUserId } });
    await prisma.user.deleteMany({ where: { id: testUserId } });
  });

  it("1. Creating a team member validates required fields and sets defaults", async () => {
    const member = await createTeamMember({
      name: "Dr. Ananya Murthy",
      designation: "Managing Trustee",
      category: "Trustee",
      shortBio: "Dedicated to educational access in rural regions.",
      bio: "Dr. Ananya Murthy has over 20 years of public policy experience.",
      displayOrder: 1,
    });

    createdTeamMemberIds.push(member.id);

    expect(member.id).toBeDefined();
    expect(member.name).toBe("Dr. Ananya Murthy");
    expect(member.slug).toBe("dr-ananya-murthy");
    expect(member.designation).toBe("Managing Trustee");
    expect(member.category).toBe("Trustee");
    expect(member.isActive).toBe(true);
    expect(member.isFeatured).toBe(false);
    expect(member.displayOrder).toBe(1);
  });

  it("2. Editing a team member updates fields without overwriting unchanged data", async () => {
    const member = await createTeamMember({
      name: "Suresh Rao",
      designation: "Volunteer Coordinator",
      category: "Volunteer",
    });
    createdTeamMemberIds.push(member.id);

    const updated = await updateTeamMember(member.id, {
      designation: "Head of Field Operations",
      shortBio: "Leading village education initiatives across 5 districts.",
    });

    expect(updated.id).toBe(member.id);
    expect(updated.name).toBe("Suresh Rao"); // preserved
    expect(updated.category).toBe("Volunteer"); // preserved
    expect(updated.designation).toBe("Head of Field Operations");
    expect(updated.shortBio).toBe(
      "Leading village education initiatives across 5 districts."
    );
  });

  it("3. Deleting a team member removes it from the database", async () => {
    const member = await createTeamMember({
      name: "Temporary Member",
      designation: "Intern",
      category: "Team Member",
    });

    const deleted = await deleteTeamMember(member.id);
    expect(deleted.id).toBe(member.id);

    const check = await getTeamMemberById(member.id);
    expect(check).toBeNull();
  });

  it("4. Enforces slug uniqueness with incremental counter", async () => {
    const member1 = await createTeamMember({
      name: "Rajesh Kumar",
      designation: "Advisory Member",
      category: "Advisory Board",
    });
    createdTeamMemberIds.push(member1.id);

    const member2 = await createTeamMember({
      name: "Rajesh Kumar",
      designation: "Medical Consultant",
      category: "Advisory Board",
    });
    createdTeamMemberIds.push(member2.id);

    expect(member1.slug).toBe("rajesh-kumar");
    expect(member2.slug).toBe("rajesh-kumar-1");
  });

  it("5. Validation rejects missing required fields and too-short strings", () => {
    const missingName = createTeamMemberSchema.safeParse({
      designation: "Trustee",
    });
    expect(missingName.success).toBe(false);

    const shortName = createTeamMemberSchema.safeParse({
      name: "A",
      designation: "Trustee",
    });
    expect(shortName.success).toBe(false);

    const missingDesignation = createTeamMemberSchema.safeParse({
      name: "Dr. Ramesh",
    });
    expect(missingDesignation.success).toBe(false);
  });

  it("6. Handles optional contact fields correctly and accepts valid/empty URLs", () => {
    const validWithContacts = createTeamMemberSchema.safeParse({
      name: "Meera Sen",
      designation: "Director",
      email: "meera@samarthatrust.org",
      phone: "+91 99999 88888",
      linkedinUrl: "https://linkedin.com/in/meerasen",
      websiteUrl: "https://meerasen.org",
      facebookUrl: "",
      instagramUrl: null,
    });

    expect(validWithContacts.success).toBe(true);
    if (validWithContacts.success) {
      expect(validWithContacts.data.email).toBe("meera@samarthatrust.org");
      expect(validWithContacts.data.phone).toBe("+91 99999 88888");
      expect(validWithContacts.data.linkedinUrl).toBe(
        "https://linkedin.com/in/meerasen"
      );
      expect(validWithContacts.data.websiteUrl).toBe("https://meerasen.org");
      expect(validWithContacts.data.facebookUrl).toBeNull();
      expect(validWithContacts.data.instagramUrl).toBeNull();
    }

    const invalidUrl = createTeamMemberSchema.safeParse({
      name: "Meera Sen",
      designation: "Director",
      websiteUrl: "not-a-valid-url",
    });
    expect(invalidUrl.success).toBe(false);
  });

  it("7. Search and pagination works properly in listAdminTeamMembers", async () => {
    const m1 = await createTeamMember({
      name: "UniqueDoctorSearchable",
      designation: "Chief Medical Officer",
      category: "Advisory Board",
    });
    createdTeamMemberIds.push(m1.id);

    const result = await listAdminTeamMembers({
      page: 1,
      limit: 10,
      search: "UniqueDoctorSearchable",
      status: "ALL",
      featured: "ALL",
      sort: "order_asc",
    });

    expect(result.data.length).toBeGreaterThanOrEqual(1);
    expect(result.data.some((m) => m.name === "UniqueDoctorSearchable")).toBe(
      true
    );
    expect(result.pagination.total).toBeGreaterThanOrEqual(1);
  });

  it("8. Category and status filtering correctly isolates members", async () => {
    const activeMember = await createTeamMember({
      name: "Active Volunteer X",
      designation: "Volunteer",
      category: "Volunteer",
      isActive: true,
    });
    const inactiveMember = await createTeamMember({
      name: "Inactive Volunteer Y",
      designation: "Volunteer",
      category: "Volunteer",
      isActive: false,
    });
    createdTeamMemberIds.push(activeMember.id, inactiveMember.id);

    const activeOnly = await listAdminTeamMembers({
      page: 1,
      limit: 50,
      category: "Volunteer",
      status: "ACTIVE",
      featured: "ALL",
      sort: "order_asc",
    });

    expect(activeOnly.data.some((m) => m.id === activeMember.id)).toBe(true);
    expect(activeOnly.data.some((m) => m.id === inactiveMember.id)).toBe(false);

    const inactiveOnly = await listAdminTeamMembers({
      page: 1,
      limit: 50,
      category: "Volunteer",
      status: "INACTIVE",
      featured: "ALL",
      sort: "order_asc",
    });

    expect(inactiveOnly.data.some((m) => m.id === inactiveMember.id)).toBe(
      true
    );
    expect(inactiveOnly.data.some((m) => m.id === activeMember.id)).toBe(false);
  });

  it("9. Toggling featured status and display order works in-place", async () => {
    const member = await createTeamMember({
      name: "Leader Beta",
      designation: "Trustee",
      category: "Trustee",
      displayOrder: 10,
      isFeatured: false,
    });
    createdTeamMemberIds.push(member.id);

    const featured = await toggleTeamMemberFeatured(member.id);
    expect(featured.isFeatured).toBe(true);

    const reordered = await updateTeamMemberOrder(member.id, 2);
    expect(reordered.displayOrder).toBe(2);
  });

  it("10. Rejects unauthorized admin requests without valid admin session", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/team", {
      method: "GET",
    });

    const res = await adminTeamGetHandler(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  it("11. Admin API creates team member when authorized", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/team", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `${AUTH_COOKIES.ACCESS_TOKEN}=${adminAccessToken}`,
      },
      body: JSON.stringify({
        name: "Authorized Created Trustee",
        designation: "Governing Board Member",
        category: "Trustee",
        shortBio: "Created via secure Admin API",
      }),
    });

    const res = await adminTeamPostHandler(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.member.name).toBe("Authorized Created Trustee");
    createdTeamMemberIds.push(body.member.id);
  });

  it("12. Public API excludes inactive members and returns 404 for inactive slug", async () => {
    const inactive = await createTeamMember({
      name: "Secret Inactive Person",
      designation: "Ex-Member",
      category: "Team Member",
      isActive: false,
    });
    createdTeamMemberIds.push(inactive.id);

    // Test list endpoint excludes inactive
    const listReq = new NextRequest("http://localhost:3000/api/team", {
      method: "GET",
    });
    const listRes = await publicTeamListHandler(listReq);
    expect(listRes.status).toBe(200);
    const listBody = await listRes.json();
    expect(
      listBody.data.some((m: { id: string }) => m.id === inactive.id)
    ).toBe(false);

    // Test detail endpoint returns 404 for inactive
    const slugReq = new NextRequest(
      `http://localhost:3000/api/team/${inactive.slug}`,
      { method: "GET" }
    );
    const slugRes = await publicTeamSlugHandler(slugReq, {
      params: Promise.resolve({ slug: inactive.slug }),
    });
    expect(slugRes.status).toBe(404);
  });

  it("13. Public API returns active members sorted by displayOrder asc then name asc", async () => {
    const p1 = await createTeamMember({
      name: "Order Person B",
      designation: "Trustee",
      category: "Trustee",
      displayOrder: 200,
      isActive: true,
    });
    const p2 = await createTeamMember({
      name: "Order Person A",
      designation: "Trustee",
      category: "Trustee",
      displayOrder: 100,
      isActive: true,
    });
    createdTeamMemberIds.push(p1.id, p2.id);

    const publicMembers = await listPublicTeamMembers({ category: "Trustee" });
    const p2Idx = publicMembers.findIndex((m) => m.id === p2.id);
    const p1Idx = publicMembers.findIndex((m) => m.id === p1.id);

    expect(p2Idx).toBeGreaterThanOrEqual(0);
    expect(p1Idx).toBeGreaterThanOrEqual(0);
    expect(p2Idx).toBeLessThan(p1Idx); // 100 comes before 200
  });

  it("14. Missing profile images store null and allow public API safe consumption", async () => {
    const noPhoto = await createTeamMember({
      name: "No Photo Trustee",
      designation: "Legal Advisor",
      category: "Advisory Board",
      profileImage: null,
    });
    createdTeamMemberIds.push(noPhoto.id);

    expect(noPhoto.profileImage).toBeNull();

    const publicRecord = await getTeamMemberBySlug(noPhoto.slug, true);
    expect(publicRecord).not.toBeNull();
    expect(publicRecord?.profileImage).toBeNull();
  });

  it("15. Admin API returns 400 with field-level errors when required fields are missing", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/team", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `${AUTH_COOKIES.ACCESS_TOKEN}=${adminAccessToken}`,
      },
      body: JSON.stringify({
        // missing name and designation
        category: "Trustee",
      }),
    });

    const res = await adminTeamPostHandler(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.details).toBeDefined();
    expect(body.details.name).toBeDefined();
    expect(body.details.designation).toBeDefined();
  });

  it("16. Admin API toggle-active and feature endpoints toggle states correctly", async () => {
    const m = await createTeamMember({
      name: "Toggle Test Member",
      designation: "Coordinator",
      category: "Team Member",
      isActive: true,
      isFeatured: false,
    });
    createdTeamMemberIds.push(m.id);

    // Toggle active via PATCH
    const toggleReq = new NextRequest(
      `http://localhost:3000/api/admin/team/${m.id}/toggle-active`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `${AUTH_COOKIES.ACCESS_TOKEN}=${adminAccessToken}`,
        },
        body: JSON.stringify({ isActive: false }),
      }
    );
    const toggleRes = await adminTeamToggleActiveHandler(toggleReq, {
      params: Promise.resolve({ id: m.id }),
    });
    expect(toggleRes.status).toBe(200);
    const toggleBody = await toggleRes.json();
    expect(toggleBody.member.isActive).toBe(false);

    // Toggle feature via PATCH
    const featReq = new NextRequest(
      `http://localhost:3000/api/admin/team/${m.id}/feature`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `${AUTH_COOKIES.ACCESS_TOKEN}=${adminAccessToken}`,
        },
        body: JSON.stringify({ isFeatured: true }),
      }
    );
    const featRes = await adminTeamFeatureHandler(featReq, {
      params: Promise.resolve({ id: m.id }),
    });
    expect(featRes.status).toBe(200);
    const featBody = await featRes.json();
    expect(featBody.member.isFeatured).toBe(true);
  });
});
