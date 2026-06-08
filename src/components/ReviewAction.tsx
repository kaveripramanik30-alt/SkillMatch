"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import styles from "@/app/dashboard/page.module.css";

export default function ReviewAction({ applicationId, studentName }: { applicationId: string, studentName: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAction = async (status: "ACCEPTED" | "REJECTED") => {
    if (!confirm(`Are you sure you want to ${status.toLowerCase()} ${studentName}?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <button 
        onClick={() => handleAction("ACCEPTED")} 
        disabled={loading}
        style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid var(--success)', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
      >
        {loading ? <Loader2 size={14} className={styles.spin} /> : <CheckCircle size={14} />} Accept
      </button>
      <button 
        onClick={() => handleAction("REJECTED")} 
        disabled={loading}
        style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid var(--danger)', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
      >
        <XCircle size={14} /> Deny
      </button>
    </div>
  );
}
