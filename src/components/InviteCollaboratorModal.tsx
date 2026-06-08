"use client";

import { useState } from "react";
import { UserPlus, X, Mail } from "lucide-react";

export default function InviteCollaboratorModal({ 
  applicationId, 
  currentCollaboratorsCount 
}: { 
  applicationId: string;
  currentCollaboratorsCount: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (currentCollaboratorsCount >= 3) {
    return (
      <button disabled style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'not-allowed' }}>
        Team Full (4/4)
      </button>
    );
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/collaborations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to invite");
      }

      setStatus("success");
      setEmail("");
      setTimeout(() => {
        setIsOpen(false);
        setStatus("idle");
        // Optionally refresh page or mutate SWR
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        style={{ background: 'rgba(79, 70, 229, 0.2)', color: 'var(--primary)', border: '1px solid var(--primary)', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', transition: 'all 0.2s' }}
      >
        <UserPlus size={14} /> Invite Teammate
      </button>

      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '16px', width: '100%', maxWidth: '400px', position: 'relative' }}>
            <button onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            
            <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserPlus size={20} color="var(--primary)" /> Build Your Team
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Invite another student to collaborate. Earnings will be split equally upon completion. ({3 - currentCollaboratorsCount} spots left)
            </p>

            <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Student Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>

              {status === "error" && (
                <div style={{ color: 'var(--danger)', fontSize: '0.85rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '6px' }}>
                  {errorMsg}
                </div>
              )}

              {status === "success" && (
                <div style={{ color: 'var(--success)', fontSize: '0.85rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: '6px' }}>
                  Invitation sent successfully!
                </div>
              )}

              <button 
                type="submit" 
                disabled={status === "loading" || status === "success"}
                style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '0.8rem', borderRadius: '8px', fontWeight: 'bold', cursor: status === "loading" ? 'wait' : 'pointer', marginTop: '0.5rem' }}
              >
                {status === "loading" ? "Sending..." : "Send Invite"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
