"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import styles from "./page.module.css";

export default function ProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ skills: "", bio: "", portfolioUrl: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Failed to update profile");
      setMessage("Profile updated successfully!");
      router.refresh();
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err: any) {
      setMessage("Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Link href="/dashboard" className={styles.backLink}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className={`${styles.card} glass`}>
        <h2>Complete Your Profile</h2>
        <p className={styles.subtitle}>Adding your skills allows our engine to match you with the right tasks.</p>

        {message && <div className={styles.message}>{message}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Your Skills (comma separated)</label>
            <input 
              type="text" 
              required 
              value={formData.skills}
              onChange={(e) => setFormData({...formData, skills: e.target.value})}
              placeholder="e.g. React, Node.js, Graphic Design, Python"
            />
            <small className={styles.hint}>Separate each skill with a comma.</small>
          </div>

          <div className={styles.inputGroup}>
            <label>Portfolio URL (Optional)</label>
            <input 
              type="url" 
              value={formData.portfolioUrl}
              onChange={(e) => setFormData({...formData, portfolioUrl: e.target.value})}
              placeholder="https://yourportfolio.com"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Short Bio (Optional)</label>
            <textarea 
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              placeholder="Tell clients a bit about yourself..."
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            <Save size={18} />
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
