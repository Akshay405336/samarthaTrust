import { prisma } from "@/lib/db/prisma";

export type MonthBucket = {
  month: string;
  label: string;
  published: number;
  draft: number;
  archived: number;
};

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });
}

function buildLastMonths(count: number): string[] {
  const keys: string[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(monthKey(d));
  }
  return keys;
}

function monthRange(monthOffset: number): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth() + monthOffset + 1, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) {
    return current > 0 ? 100 : null;
  }
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

async function paidDonationMetricsBetween(start: Date, end: Date) {
  const where = {
    status: "PAID" as const,
    OR: [
      { capturedAt: { gte: start, lte: end } },
      {
        capturedAt: null,
        createdAt: { gte: start, lte: end },
      },
    ],
  };

  const [count, sum] = await Promise.all([
    prisma.donation.count({ where }),
    prisma.donation.aggregate({ where, _sum: { amount: true } }),
  ]);

  return {
    count,
    amountInr: (sum._sum.amount ?? 0) / 100,
  };
}

export type DonationDashboardAnalytics = Awaited<
  ReturnType<typeof getDonationDashboardAnalytics>
>;

export async function getDonationDashboardAnalytics() {
  const months = buildLastMonths(6);
  const rangeStart = new Date();
  rangeStart.setMonth(rangeStart.getMonth() - (months.length - 1));
  rangeStart.setDate(1);
  rangeStart.setHours(0, 0, 0, 0);

  const thisMonth = monthRange(0);
  const lastMonth = monthRange(-1);

  const [
    totalAttempts,
    paidCount,
    paidSum,
    pendingCount,
    failedCount,
    thisMonthPaid,
    lastMonthPaid,
    donationsInRange,
    recentDonations,
  ] = await Promise.all([
    prisma.donation.count(),
    prisma.donation.count({ where: { status: "PAID" } }),
    prisma.donation.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
    }),
    prisma.donation.count({
      where: { status: { in: ["PENDING", "ORDER_CREATED"] } },
    }),
    prisma.donation.count({
      where: { status: { in: ["FAILED", "EXPIRED"] } },
    }),
    paidDonationMetricsBetween(thisMonth.start, thisMonth.end),
    paidDonationMetricsBetween(lastMonth.start, lastMonth.end),
    prisma.donation.findMany({
      where: { createdAt: { gte: rangeStart } },
      select: {
        id: true,
        amount: true,
        status: true,
        causeTitle: true,
        createdAt: true,
        capturedAt: true,
        referenceId: true,
        donorName: true,
        isAnonymous: true,
      },
    }),
    prisma.donation.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        referenceId: true,
        amount: true,
        status: true,
        causeTitle: true,
        createdAt: true,
        donorName: true,
        isAnonymous: true,
      },
    }),
  ]);

  const monthlyTrend = months.map((key) => {
    const paidInMonth = donationsInRange.filter((d) => {
      if (d.status !== "PAID") return false;
      const when = d.capturedAt ?? d.createdAt;
      return monthKey(when) === key;
    });
    const attemptsInMonth = donationsInRange.filter(
      (d) => monthKey(d.createdAt) === key
    );

    return {
      month: key,
      label: monthLabel(key),
      paidCount: paidInMonth.length,
      paidAmountInr: paidInMonth.reduce((s, d) => s + d.amount, 0) / 100,
      attemptCount: attemptsInMonth.length,
      pendingCount: attemptsInMonth.filter(
        (d) => d.status === "PENDING" || d.status === "ORDER_CREATED"
      ).length,
      failedCount: attemptsInMonth.filter(
        (d) => d.status === "FAILED" || d.status === "EXPIRED"
      ).length,
    };
  });

  const statusBreakdown = [
    { name: "Paid", value: paidCount, fill: "#9200A8" },
    { name: "Pending", value: pendingCount, fill: "#F59E0B" },
    { name: "Failed", value: failedCount, fill: "#DC2626" },
  ].filter((row) => row.value > 0);

  const causeMap = new Map<string, { amountInr: number; count: number }>();
  for (const d of donationsInRange) {
    if (d.status !== "PAID") continue;
    const prev = causeMap.get(d.causeTitle) ?? { amountInr: 0, count: 0 };
    prev.amountInr += d.amount / 100;
    prev.count += 1;
    causeMap.set(d.causeTitle, prev);
  }

  const topCauses = [...causeMap.entries()]
    .map(([causeTitle, stats]) => ({ causeTitle, ...stats }))
    .sort((a, b) => b.amountInr - a.amountInr)
    .slice(0, 6);

  const thisMonthLabel = monthLabel(monthKey(thisMonth.start));
  const lastMonthLabel = monthLabel(monthKey(lastMonth.start));

  return {
    summary: {
      totalRaisedInr: (paidSum._sum.amount ?? 0) / 100,
      paidCount,
      totalAttempts,
      pendingCount,
      failedCount,
    },
    comparison: {
      thisMonthLabel,
      lastMonthLabel,
      thisMonth: thisMonthPaid,
      lastMonth: lastMonthPaid,
      amountChangePct: percentChange(
        thisMonthPaid.amountInr,
        lastMonthPaid.amountInr
      ),
      countChangePct: percentChange(thisMonthPaid.count, lastMonthPaid.count),
    },
    monthlyTrend,
    statusBreakdown,
    topCauses,
    recentDonations: recentDonations.map((d) => ({
      id: d.id,
      referenceId: d.referenceId,
      amountInr: d.amount / 100,
      status: d.status,
      causeTitle: d.causeTitle,
      createdAt: d.createdAt.toISOString(),
      donorLabel: d.isAnonymous ? "Anonymous donor" : d.donorName,
    })),
  };
}

function bucketByMonth<T extends { createdAt: Date; status: string }>(
  rows: T[],
  months: string[]
): MonthBucket[] {
  const map = new Map<string, MonthBucket>();
  for (const key of months) {
    map.set(key, {
      month: key,
      label: monthLabel(key),
      published: 0,
      draft: 0,
      archived: 0,
    });
  }

  for (const row of rows) {
    const key = monthKey(row.createdAt);
    const bucket = map.get(key);
    if (!bucket) continue;
    if (row.status === "PUBLISHED") bucket.published += 1;
    else if (row.status === "DRAFT") bucket.draft += 1;
    else bucket.archived += 1;
  }

  return months.map((key) => map.get(key)!);
}

export async function getAdminDashboardSnapshot() {
  const months = buildLastMonths(6);
  const rangeStart = new Date();
  rangeStart.setMonth(rangeStart.getMonth() - (months.length - 1));
  rangeStart.setDate(1);
  rangeStart.setHours(0, 0, 0, 0);

  const [
    galleryTotal,
    galleryPublished,
    galleryDraft,
    galleryArchived,
    blogTotal,
    blogPublished,
    blogDraft,
    teamTotal,
    teamActive,
    worksTotal,
    worksPublished,
    worksDraft,
    donationTotal,
    donationPaid,
    donationPaidSum,
    recentGalleries,
    recentBlogs,
    recentWorks,
    blogsForChart,
    galleriesForChart,
    worksForChart,
  ] = await Promise.all([
    prisma.galleryPhoto.count(),
    prisma.galleryPhoto.count({ where: { status: "PUBLISHED" } }),
    prisma.galleryPhoto.count({ where: { status: "DRAFT" } }),
    prisma.galleryPhoto.count({ where: { status: "ARCHIVED" } }),
    prisma.blog.count(),
    prisma.blog.count({ where: { status: "PUBLISHED" } }),
    prisma.blog.count({ where: { status: "DRAFT" } }),
    prisma.teamMember.count(),
    prisma.teamMember.count({ where: { isActive: true } }),
    prisma.work.count(),
    prisma.work.count({ where: { status: "PUBLISHED" } }),
    prisma.work.count({ where: { status: "DRAFT" } }),
    prisma.donation.count(),
    prisma.donation.count({ where: { status: "PAID" } }),
    prisma.donation.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
    }),
    prisma.galleryPhoto.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        altText: true,
        url: true,
        status: true,
        updatedAt: true,
      },
    }),
    prisma.blog.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        publishedAt: true,
        updatedAt: true,
      },
    }),
    prisma.work.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        updatedAt: true,
      },
    }),
    prisma.blog.findMany({
      where: { createdAt: { gte: rangeStart } },
      select: { createdAt: true, status: true },
    }),
    prisma.galleryPhoto.findMany({
      where: { createdAt: { gte: rangeStart } },
      select: { createdAt: true, status: true },
    }),
    prisma.work.findMany({
      where: { createdAt: { gte: rangeStart } },
      select: { createdAt: true, status: true },
    }),
  ]);

  const contentActivity = months.map((key) => {
    const blog = bucketByMonth(blogsForChart, [key])[0];
    const gallery = bucketByMonth(galleriesForChart, [key])[0];
    const works = bucketByMonth(worksForChart, [key])[0];
    return {
      month: key,
      label: monthLabel(key),
      blogs: blog.published + blog.draft + blog.archived,
      galleries: gallery.published + gallery.draft + gallery.archived,
      works: works.published + works.draft + works.archived,
    };
  });

  const publicationMix = [
    {
      name: "Published",
      blogs: blogPublished,
      galleries: galleryPublished,
      works: worksPublished,
    },
    {
      name: "Draft",
      blogs: blogDraft,
      galleries: galleryDraft,
      works: worksDraft,
    },
  ];

  const donationAnalytics = await getDonationDashboardAnalytics();

  return {
    summary: {
      gallery: {
        total: galleryTotal,
        published: galleryPublished,
        draft: galleryDraft,
        archived: galleryArchived,
      },
      blogs: {
        total: blogTotal,
        published: blogPublished,
        draft: blogDraft,
      },
      team: {
        total: teamTotal,
        active: teamActive,
      },
      works: {
        total: worksTotal,
        published: worksPublished,
        draft: worksDraft,
      },
      donations: {
        total: donationTotal,
        paid: donationPaid,
        paidAmountInr: (donationPaidSum._sum.amount ?? 0) / 100,
      },
    },
    charts: {
      contentActivity,
      publicationMix,
      blogBuckets: bucketByMonth(blogsForChart, months),
      galleryBuckets: bucketByMonth(galleriesForChart, months),
    },
    donations: donationAnalytics,
    recent: {
      galleries: recentGalleries,
      blogs: recentBlogs,
      works: recentWorks,
    },
  };
}

