"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function NavAuth() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div style={{ width: '100px' }}></div>; // placeholder to prevent layout shift
  }

  if (session?.user) {
    return (
      <>
        <Link href="/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>Dashboard</Link>
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--foreground)', padding: '0.4rem 1rem', borderRadius: '100px', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          Logout
        </button>
      </>
    );
  }

  return (
    <>
      <Link href="/auth/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>Login</Link>
      <Link href="/auth/signup?role=student" style={{ background: 'var(--primary)', color: 'white', padding: '0.4rem 1rem', borderRadius: '100px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>Sign Up</Link>
    </>
  );
}
