import type { Metadata } from "next";
import "./global.css";
import React from "react";
import LoadOlm from "./components/load-olm";

export const metadata: Metadata = {
  title: "Next.js Self Hosted Demo",
  description: "This is hosted on Ubuntu Linux with Nginx as a reverse proxy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LoadOlm>{children}</LoadOlm>
      </body>
    </html>
  );
}
