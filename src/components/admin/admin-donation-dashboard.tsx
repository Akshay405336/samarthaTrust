"use client";

import Link from "next/link";
import {
  ArrowRight,
  HeartHandshake,
  IndianRupee,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  AdminStatCard,
  AdminStatGrid,
} from "@/components/admin/admin-page";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { DonationDashboardAnalytics } from "@/lib/admin/dashboard-stats";

const tooltipStyle = {
  borderRadius: "10px",
  border: "1px solid #EADDED",
  fontSize: "12px",
};

function formatInr(value: number) {
  return value.toLocaleString("en-IN", {
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  });
}

function ChangeBadge({
  value,
  suffix = "vs last month",
}: {
  value: number | null;
  suffix?: string;
}) {
  if (value === null) {
    return (
      <span className="text-[11px] text-[#75647B]">No prior month data {suffix}</span>
    );
  }

  const up = value >= 0;
  const Icon = up ? TrendingUp : TrendingDown;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-[11px] font-semibold",
        up ? "text-emerald-600" : "text-red-600"
      )}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {up ? "+" : ""}
      {value}% {suffix}
    </span>
  );
}

export function AdminDonationDashboard({
  data,
  part = "all",
}: {
  data: DonationDashboardAnalytics;
  part?: "stats" | "charts" | "all";
}) {
  const { summary, comparison, monthlyTrend, statusBreakdown, topCauses, recentDonations } =
    data;

  const monthCompareChart = [
    {
      label: comparison.lastMonthLabel,
      amountInr: comparison.lastMonth.amountInr,
      payments: comparison.lastMonth.count,
    },
    {
      label: comparison.thisMonthLabel,
      amountInr: comparison.thisMonth.amountInr,
      payments: comparison.thisMonth.count,
    },
  ];

  const showStats = part === "stats" || part === "all";
  const showCharts = part === "charts" || part === "all";

  return (
    <section className="space-y-4" aria-labelledby="donation-analytics-heading">
      {showStats ? (
        <>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="donation-analytics-heading"
            className="text-lg font-bold text-[#35123F]"
          >
            Revenue
          </h2>
          <p className="text-xs text-[#75647B]">
            Donation totals and month-over-month comparison
          </p>
        </div>
        <Link
          href="/admin/donations"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#9200A8]"
        >
          Open donations console
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <AdminStatGrid columns={4}>
        <AdminStatCard
          label="Total raised"
          value={`₹${formatInr(summary.totalRaisedInr)}`}
          icon={IndianRupee}
          href="/admin/donations"
          tone="brand"
        />
        <AdminStatCard
          label="Successful payments"
          value={summary.paidCount}
          icon={HeartHandshake}
          href="/admin/donations"
          tone="success"
        />
        <AdminStatCard
          label={`This month (${comparison.thisMonthLabel})`}
          value={`₹${formatInr(comparison.thisMonth.amountInr)}`}
          hint={
            <ChangeBadge value={comparison.amountChangePct} />
          }
          icon={IndianRupee}
          tone="brand"
        />
        <AdminStatCard
          label="This month payments"
          value={comparison.thisMonth.count}
          hint={
            <ChangeBadge value={comparison.countChangePct} />
          }
          icon={HeartHandshake}
        />
      </AdminStatGrid>
        </>
      ) : null}

      {showCharts ? (
        <>
          <div>
            <h2 className="text-lg font-bold text-[#35123F]">Revenue insights</h2>
            <p className="text-xs text-[#75647B]">
              Trends, comparisons, and recent donation activity
            </p>
          </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="admin-panel border-[#EADDED]/90 bg-white shadow-sm xl:col-span-8">
          <CardHeader className="border-b border-[#EADDED]/70 pb-3">
            <CardTitle className="text-base font-bold text-[#35123F]">
              Donation trend (6 months)
            </CardTitle>
            <CardDescription className="text-xs text-[#75647B]">
              Paid amount and successful payment count by month
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#F3E8FF" strokeDasharray="4 4" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#75647B" }} />
                  <YAxis
                    yAxisId="left"
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "#75647B" }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11, fill: "#75647B" }}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value, name) => {
                      if (name === "Amount (₹)") {
                        return [`₹${formatInr(Number(value))}`, name];
                      }
                      return [value, name];
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar
                    yAxisId="left"
                    dataKey="paidCount"
                    name="Paid count"
                    fill="#9200A8"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="paidAmountInr"
                    name="Amount (₹)"
                    stroke="#E90078"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="admin-panel border-[#EADDED]/90 bg-white shadow-sm xl:col-span-4">
          <CardHeader className="border-b border-[#EADDED]/70 pb-3">
            <CardTitle className="text-base font-bold text-[#35123F]">
              Last month vs this month
            </CardTitle>
            <CardDescription className="text-xs text-[#75647B]">
              Side-by-side paid amount and payment volume
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="rounded-lg border border-[#EADDED] bg-[#FAF5FF]/60 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#75647B]">
                  {comparison.lastMonthLabel}
                </p>
                <p className="mt-1 text-sm font-bold text-[#35123F]">
                  ₹{formatInr(comparison.lastMonth.amountInr)}
                </p>
                <p className="text-[11px] text-[#75647B]">
                  {comparison.lastMonth.count} payments
                </p>
              </div>
              <div className="rounded-lg border border-[#EADDED] bg-white p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9200A8]">
                  {comparison.thisMonthLabel}
                </p>
                <p className="mt-1 text-sm font-bold text-[#35123F]">
                  ₹{formatInr(comparison.thisMonth.amountInr)}
                </p>
                <p className="text-[11px] text-[#75647B]">
                  {comparison.thisMonth.count} payments
                </p>
              </div>
            </div>
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthCompareChart} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#F3E8FF" strokeDasharray="4 4" />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#75647B" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#75647B" }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Bar dataKey="amountInr" name="Amount (₹)" fill="#9200A8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="payments" name="Payments" fill="#E90078" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="admin-panel border-[#EADDED]/90 bg-white shadow-sm xl:col-span-4">
          <CardHeader className="border-b border-[#EADDED]/70 pb-3">
            <CardTitle className="text-base font-bold text-[#35123F]">
              Payment status mix
            </CardTitle>
            <CardDescription className="text-xs text-[#75647B]">
              All-time donation attempt outcomes
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {statusBreakdown.length === 0 ? (
              <p className="py-10 text-center text-sm text-[#75647B]">No donation records yet.</p>
            ) : (
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusBreakdown}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={52}
                      outerRadius={78}
                      paddingAngle={2}
                    >
                      {statusBreakdown.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="mt-2 grid grid-cols-3 gap-2 text-center text-[11px]">
              <div>
                <p className="font-bold text-[#9200A8]">{summary.paidCount}</p>
                <p className="text-[#75647B]">Paid</p>
              </div>
              <div>
                <p className="font-bold text-amber-600">{summary.pendingCount}</p>
                <p className="text-[#75647B]">Pending</p>
              </div>
              <div>
                <p className="font-bold text-red-600">{summary.failedCount}</p>
                <p className="text-[#75647B]">Failed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="admin-panel border-[#EADDED]/90 bg-white shadow-sm xl:col-span-4">
          <CardHeader className="border-b border-[#EADDED]/70 pb-3">
            <CardTitle className="text-base font-bold text-[#35123F]">
              Top causes (6 months)
            </CardTitle>
            <CardDescription className="text-xs text-[#75647B]">
              Paid amount by cause title
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {topCauses.length === 0 ? (
              <p className="py-10 text-center text-sm text-[#75647B]">No paid donations in range.</p>
            ) : (
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topCauses}
                    layout="vertical"
                    margin={{ top: 4, right: 12, left: 4, bottom: 4 }}
                  >
                    <CartesianGrid stroke="#F3E8FF" strokeDasharray="4 4" />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "#75647B" }} />
                    <YAxis
                      type="category"
                      dataKey="causeTitle"
                      width={100}
                      tick={{ fontSize: 10, fill: "#75647B" }}
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(value) => [`₹${formatInr(Number(value))}`, "Raised"]}
                    />
                    <Bar dataKey="amountInr" name="Raised (₹)" fill="#7100A8" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="admin-panel border-[#EADDED]/90 bg-white shadow-sm xl:col-span-4">
          <CardHeader className="border-b border-[#EADDED]/70 pb-3">
            <CardTitle className="text-base font-bold text-[#35123F]">
              Recent donations
            </CardTitle>
            <CardDescription className="text-xs text-[#75647B]">
              Latest attempts across all statuses
            </CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-[#EADDED]/60 p-0">
            {recentDonations.length === 0 ? (
              <p className="px-4 py-6 text-center text-xs text-[#75647B]">No donations yet.</p>
            ) : (
              recentDonations.map((row) => (
                <Link
                  key={row.id}
                  href="/admin/donations"
                  className="block px-4 py-3 text-sm outline-none"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-[#35123F]">{row.causeTitle}</p>
                      <p className="text-[11px] text-[#75647B]">
                        {row.donorLabel} · {row.referenceId}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-bold text-[#35123F]">
                        ₹{formatInr(row.amountInr)}
                      </p>
                      <p className="text-[10px] uppercase text-[#75647B]">{row.status}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
        </>
      ) : null}
    </section>
  );
}
