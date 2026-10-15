import * as React from "react";
import type { Metadata } from "next";
import { Calendar, User, Clock, ArrowRight, BookOpen } from "lucide-react";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Blog & Updates",
  description:
    "Read the latest field reports, impact stories, and community news from Samartha Trust.",
};

const blogPosts = [
  {
    id: "1",
    slug: "annual-education-drive-2026",
    title:
      "Annual Education Drive: Distributing Learning Kits to Rural Students",
    category: "Education",
    date: "October 10, 2026",
    readTime: "4 min read",
    author: "Samartha Outreach Team",
    excerpt:
      "A comprehensive retrospective on our flagship education kit drive, bringing books, uniforms, and learning tools to hundreds of eager students.",
    contentPreview:
      "Education remains the most enduring engine for uplifting families out of cyclical poverty. During the kickoff of our annual drive across rural learning clusters, our volunteers assembled and distributed custom education kits equipped with grade-appropriate notebooks, geometric instruments, and reading primers...",
  },
  {
    id: "2",
    slug: "preventive-health-camp-recap",
    title: "Community Preventive Health Camp Highlights & Impact",
    category: "Healthcare",
    date: "September 24, 2026",
    readTime: "5 min read",
    author: "Medical Advisory Committee",
    excerpt:
      "Over 350 rural families benefited from comprehensive health consultations, blood pressure screenings, and preventive medicine advice.",
    contentPreview:
      "Early diagnosis is often the difference between a minor manageable health condition and a severe crisis for low-income wage earners. Partnering with dedicated volunteer doctors, Samartha Trust conducted a day-long diagnostic camp offering general medicine, eye tests, and pediatric care...",
  },
  {
    id: "3",
    slug: "women-vocational-handicraft-program",
    title: "Empowering Rural Women Through Sustainable Handicraft Training",
    category: "Skill Development",
    date: "August 18, 2026",
    readTime: "3 min read",
    author: "Livelihood Initiative Lead",
    excerpt:
      "Discover the stories of local women who completed our three-month vocational skill enhancement program in Bengaluru rural.",
    contentPreview:
      "Financial self-reliance transforms not just an individual woman, but her entire family and household stability. We celebrated the graduation of 25 participants in our textile tailoring and eco-friendly packaging course...",
  },
  {
    id: "4",
    slug: "clean-water-community-initiative",
    title: "Installing Sustainable Potable Water Filters in Rural Hamlets",
    category: "Community Welfare",
    date: "July 12, 2026",
    readTime: "4 min read",
    author: "Welfare Coordinator",
    excerpt:
      "Bringing safe, drinkable water access to over 120 households experiencing seasonal groundwater contamination.",
    contentPreview:
      "Safe drinking water is a fundamental human necessity. Through community contributions and philanthropic sponsorships, our trust installed high-capacity filtration units to protect villagers against recurring water-borne ailments...",
  },
];

export default function BlogPage() {
  return (
    <div>
      <PageHeader
        badge="Field Reports & Stories"
        title="Blog & Community"
        highlight="Updates"
        description="Transparent updates, field observations, and stories of hope directly from our community programs."
      />

      <section className="py-16 sm:py-24 bg-white">
        <Container>
          {/* Featured Post Card with crisp white styling */}
          <div className="mb-14 sm:mb-16">
            <Card className="overflow-hidden border border-[#EADCCB] bg-white shadow-xs">
              <div className="p-8 sm:p-12 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="default">Featured Story</Badge>
                  <span className="text-xs text-[#78685D] flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-[#FF8A00]" />
                    <span>{blogPosts[0].date}</span>
                  </span>
                  <span className="text-xs text-[#78685D] flex items-center gap-1">
                    <Clock className="h-3 w-3 text-[#FF8A00]" />
                    <span>{blogPosts[0].readTime}</span>
                  </span>
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-[#492A22] sm:text-3xl lg:text-4xl">
                  {blogPosts[0].title}
                </h2>

                <p className="text-base text-[#78685D] leading-relaxed sm:text-lg max-w-3xl">
                  {blogPosts[0].contentPreview}
                </p>

                <div className="flex items-center gap-3 pt-2 text-xs text-[#78685D]">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF5E6] text-[#F52232] border border-[#EADCCB]">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <span>Written by {blogPosts[0].author}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Grid of all articles */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#EADCCB] pb-4">
              <h3 className="text-xl font-bold text-[#492A22] flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#F52232]" />
                <span>All Articles & Updates</span>
              </h3>
              <span className="text-xs text-[#78685D] font-medium">
                Showing {blogPosts.length} stories
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <Card
                  key={post.id}
                  className="flex flex-col justify-between border border-[#EADCCB] bg-white transition-all hover:border-[#FF8A00]/50 hover:shadow-md"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between text-xs text-[#78685D]">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-[#FF8A00]" />
                        <span>{post.readTime}</span>
                      </span>
                    </div>

                    <h4 className="text-lg font-bold leading-snug text-[#492A22] hover:text-[#F52232] transition-colors">
                      {post.title}
                    </h4>

                    <p className="text-sm text-[#78685D] leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="pt-2 text-xs text-[#78685D] flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-[#F52232]" />
                      <span>{post.date}</span>
                    </div>
                  </CardContent>

                  <div className="border-t border-[#EADCCB]/70 p-4 px-6 bg-[#FFFCF5]">
                    <span className="inline-flex items-center text-xs font-semibold text-[#F52232] hover:text-[#FF8A00] gap-1 transition-colors">
                      <span>Field report details</span>
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
