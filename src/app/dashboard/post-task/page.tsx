"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import styles from "../profile/page.module.css"; // Reuse profile styles

export default function PostTaskPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    title: "", 
    description: "", 
    budget: "", 
    requiredSkills: "",
    isMicroTask: false 
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post task");
      
      setMessage("Task posted successfully! We are matching it with students.");
      router.refresh();
      setTimeout(() => router.push("/dashboard"), 2500);
    } catch (err: any) {
      setError(err.message || "Error posting task.");
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
        <h2>Post a New Task</h2>
        <p className={styles.subtitle}>Define your requirements and budget. No bidding wars—our engine will find the perfect match.</p>

        {message && <div className={styles.message}>{message}</div>}
        {error && <div className={styles.error} style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '12px', marginBottom: '1.5rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Task Title</label>
            <input 
              type="text" 
              required 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Fix a responsive bug in React"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Detailed Description</label>
            <textarea 
              rows={5}
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe exactly what needs to be done..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className={styles.inputGroup}>
              <label>Fixed Budget (₹)</label>
              <input 
                type="number" 
                required 
                min="50"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                placeholder="e.g. 500"
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label>Required Skills (comma separated)</label>
              <input 
                type="text" 
                required 
                value={formData.requiredSkills}
                onChange={(e) => setFormData({...formData, requiredSkills: e.target.value})}
                placeholder="e.g. React, CSS"
              />
            </div>
          </div>

          <div className={styles.inputGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="checkbox" 
              id="microTask"
              checked={formData.isMicroTask}
              onChange={(e) => setFormData({...formData, isMicroTask: e.target.checked})}
              style={{ width: 'auto' }}
            />
            <label htmlFor="microTask" style={{ cursor: 'pointer' }}>This is a quick Micro-Task (₹100–₹500)</label>
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            <Send size={18} />
            {loading ? "Posting..." : "Post Task"}
          </button>
        </form>
      </div>
    </div>
  );
}
