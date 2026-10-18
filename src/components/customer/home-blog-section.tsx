import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight, BookOpen, Clock, Sparkles } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db/prisma";
import { calculateReadTime } from "@/lib/validations/blog";

export async function HomeBlogSection() {
  const latestBlogs = await prisma.blog.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [
      { isFeatured: "desc" },
      { publishedAt: "desc" },
      { createdAt: "desc" },
    ],
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      coverImage: true,
      category: true,
      authorName: true,
      isFeatured: true,
      publishedAt: true,
      createdAt: true,
    },
  });

  if (latestBlogs.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-[#EADCCB]">
      <Container>
        <SectionHeading
          badge="Updates & Stories"
          title="Latest News & Field"
          highlight="Stories"
          description="Read transparent field updates, beneficiary stories, and milestone reports directly from our community programs."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {latestBlogs.map((article) => {
            const formattedDate = article.publishedAt
              ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : new Date(article.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

            const readTime = calculateReadTime(article.content);

            return (
              <Card
                key={article.id}
                className="flex flex-col justify-between overflow-hidden border border-[#EADCCB] bg-white hover:border-[#FF8A00]/50 hover:shadow-md transition-all group"
              >
                <div>
                  {/* Thumbnail */}
                  {article.coverImage && (
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#FFF5E6]">
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-300 group-hover:scale-103"
                      />
                      {article.isFeatured && (
                        <div className="absolute top-2.5 left-2.5">
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#F52232] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                            <Sparkles className="h-3 w-3" />
                            <span>Featured</span>
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#78685D]">
                      <Badge
                        variant="secondary"
                        className="font-semibold text-xs"
                      >
                        {article.category}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-[#FF8A00]" />
                        <span>{formattedDate}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold leading-snug text-[#492A22] group-hover:text-[#F52232] transition-colors line-clamp-2">
                      <Link href={`/blog/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>

                    {article.excerpt && (
                      <p className="text-sm text-[#78685D] leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}

                    <div className="flex items-center gap-2 pt-1 text-[11px] text-[#78685D]">
                      <Clock className="h-3 w-3 text-[#FF8A00]" />
                      <span>{readTime}</span>
                      <span>•</span>
                      <span>By {article.authorName}</span>
                    </div>
                  </CardContent>
                </div>

                <div className="border-t border-[#EADCCB]/70 p-4 px-6 bg-[#FFFCF5]">
                  <Link
                    href={`/blog/${article.slug}`}
                    className="inline-flex items-center text-xs font-semibold text-[#F52232] hover:text-[#FF8A00] gap-1 transition-colors"
                  >
                    <span>Read full article</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline">
            <Link href="/blog" className="gap-2">
              <BookOpen className="h-4 w-4 text-[#F52232]" />
              <span>View All Articles & Stories</span>
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
