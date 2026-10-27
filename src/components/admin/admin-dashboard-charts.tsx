"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ContentActivityPoint = {
  label: string;
  blogs: number;
  galleries: number;
  works: number;
};

interface AdminDashboardChartsProps {
  contentActivity: ContentActivityPoint[];
}

const tooltipStyle = {
  borderRadius: "10px",
  border: "1px solid #EADDED",
  fontSize: "12px",
};

export function AdminDashboardCharts({
  contentActivity,
}: AdminDashboardChartsProps) {
  const activityTotal = contentActivity.reduce(
    (sum, row) => sum + row.blogs + row.galleries + row.works,
    0
  );

  return (
    <section className="space-y-4" aria-labelledby="content-analytics-heading">
      <div>
        <h2 id="content-analytics-heading" className="text-lg font-bold text-[#35123F]">
          Content
        </h2>
        <p className="text-xs text-[#75647B]">
          Blogs, galleries, and works activity over the last 6 months
        </p>
      </div>
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <Card className="admin-panel border-[#EADDED]/90 bg-white shadow-sm xl:col-span-7">
        <CardHeader className="border-b border-[#EADDED]/70 pb-3">
          <CardTitle className="text-base font-bold text-[#35123F]">
            Content trends (6 months)
          </CardTitle>
          <CardDescription className="text-xs text-[#75647B]">
            Monthly blogs, galleries, and works activity
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {activityTotal === 0 ? (
            <p className="py-10 text-center text-sm text-[#75647B]">
              No content created in this period yet.
            </p>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={contentActivity}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid stroke="#F3E8FF" strokeDasharray="4 4" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#75647B" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#75647B" }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Line
                    type="monotone"
                    dataKey="blogs"
                    name="Blogs"
                    stroke="#9200A8"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="galleries"
                    name="Galleries"
                    stroke="#E90078"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="works"
                    name="Works"
                    stroke="#7100A8"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="admin-panel border-[#EADDED]/90 bg-white shadow-sm xl:col-span-5">
        <CardHeader className="border-b border-[#EADDED]/70 pb-3">
          <CardTitle className="text-base font-bold text-[#35123F]">
            Volume by module
          </CardTitle>
          <CardDescription className="text-xs text-[#75647B]">
            Stacked monthly entries across modules
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {activityTotal === 0 ? (
            <p className="py-10 text-center text-sm text-[#75647B]">
              No data to chart yet.
            </p>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={contentActivity}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid stroke="#F3E8FF" strokeDasharray="4 4" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#75647B" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#75647B" }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar
                    dataKey="galleries"
                    name="Galleries"
                    stackId="content"
                    fill="#E90078"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="blogs"
                    name="Blogs"
                    stackId="content"
                    fill="#9200A8"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="works"
                    name="Works"
                    stackId="content"
                    fill="#7100A8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
    </section>
  );
}
