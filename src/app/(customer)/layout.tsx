import * as React from "react";
import { CustomerHeader } from "@/components/customer/header";
import { CustomerFooter } from "@/components/customer/footer";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <CustomerHeader />
      <main className="flex-1">{children}</main>
      <CustomerFooter />
    </div>
  );
}
