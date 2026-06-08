import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import NavAuth from "@/components/NavAuth";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "SkillMatch | The Student Freelance Platform",
  description: "Skill-based matching for students to learn, practice, and earn. Hire talented student freelancers for micro-tasks and projects.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <nav className="navbar glass">
            <Link href="/" className="navbar-brand" style={{ textDecoration: 'none', color: 'inherit' }}>SkillMatch</Link>
            <div className="navbar-links" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <NavAuth />
            </div>
          </nav>
          <main className="main-content">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
