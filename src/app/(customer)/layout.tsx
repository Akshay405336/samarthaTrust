import * as React from "react";
import { CustomerHeader } from "@/components/customer/header";
import { CustomerFooter } from "@/components/customer/footer";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <React.Suspense
        fallback={<div className="h-20 bg-white border-b border-[#EADCCB]" />}
      >
        <CustomerHeader />
      </React.Suspense>
      <main className="flex-1 bg-white">{children}</main>
      <CustomerFooter />
    </div>
  );
}
