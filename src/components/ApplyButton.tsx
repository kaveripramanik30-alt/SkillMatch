"use client";

import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import styles from "@/app/dashboard/page.module.css";
import { useRouter } from "next/navigation";

export default function ApplyButton({ projectId, score, isApplied }: { projectId: string, score: number, isApplied: boolean }) {
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(isApplied);
  const router = useRouter();

  const handleApply = async () => {
    if (applied) return;
    setLoading(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, matchScore: score })
      });
      if (res.ok) {
        setApplied(true);
        router.refresh(); // Refresh dashboard to update counts/views
      } else {
        console.error("Failed to apply");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (applied) {
    return (
      <button className={styles.applyBtn} style={{ background: 'var(--success)', cursor: 'default' }} disabled>
        <CheckCircle size={16} /> Application Sent
      </button>
    );
  }

  return (
    <button className={styles.applyBtn} onClick={handleApply} disabled={loading}>
      {loading ? <Loader2 size={16} className={styles.spin} /> : <CheckCircle size={16} />}
      {loading ? "Applying..." : "Apply Now"}
    </button>
  );
}
