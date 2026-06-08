"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./page.module.css";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function SignupForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialRole = searchParams.get("role") === "client" ? "CLIENT" : "STUDENT";
  
  const [role, setRole] = useState(initialRole);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Automatically redirect to login upon success
      router.push(`/api/auth/signin?callbackUrl=/dashboard`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backLink}>
        <ArrowLeft size={16} /> Back to Home
      </Link>
      
      <div className={`${styles.card} glass`}>
        <h1 className={styles.title}>
          Join as a <span className={styles.highlight}>{role === "STUDENT" ? "Student" : "Client"}</span>
        </h1>
        
        <div className={styles.roleToggle}>
          <button 
            className={`${styles.toggleBtn} ${role === "STUDENT" ? styles.active : ""}`}
            onClick={() => setRole("STUDENT")}
            type="button"
          >
            I am a Student
          </button>
          <button 
            className={`${styles.toggleBtn} ${role === "CLIENT" ? styles.active : ""}`}
            onClick={() => setRole("CLIENT")}
            type="button"
          >
            I want to Hire
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <input 
              type="text" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. John Doe"
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label>University Email (Preferred)</label>
            <input 
              type="email" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="e.g. john@university.edu"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input 
              type="password" 
              required 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className={styles.loginText}>
          Already have an account? <Link href="/api/auth/signin">Log in here</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}
