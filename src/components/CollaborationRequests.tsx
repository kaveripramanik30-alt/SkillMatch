"use client";

import { useState } from "react";
import { Check, X, Users } from "lucide-react";

export default function CollaborationRequests({ requests }: { requests: any[] }) {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  if (!requests || requests.length === 0) return null;

  const handleAction = async (id: string, status: "ACCEPTED" | "REJECTED") => {
    setIsProcessing(id);
    try {
      const res = await fetch(`/api/collaborations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to update request");
      } else {
        window.location.reload();
      }
    } catch (err) {
      alert("An error occurred");
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="glass" style={{ marginBottom: '2rem', border: '1px solid var(--primary)', borderRadius: '16px' }}>
      <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Users size={18} color="var(--primary)" />
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary)' }}>Collaboration Requests</h3>
      </div>
      
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {requests.map((req) => {
          const totalMembers = req.application.collaborations.filter((c:any) => c.status === "ACCEPTED").length + 2; // +1 lead, +1 this user
          const estimatedCut = req.application.project.budget / totalMembers;

          return (
            <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px' }}>
              <div>
                <h4 style={{ marginBottom: '0.25rem' }}>{req.application.project.title}</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Invited by <span style={{ color: 'var(--foreground)' }}>{req.application.student.name}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--success)', marginTop: '0.4rem', fontWeight: 600 }}>
                  Estimated Earnings: ₹{estimatedCut.toFixed(0)} (Budget Split)
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => handleAction(req.id, "REJECTED")}
                  disabled={isProcessing === req.id}
                  style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Decline"
                >
                  <X size={18} />
                </button>
                <button 
                  onClick={() => handleAction(req.id, "ACCEPTED")}
                  disabled={isProcessing === req.id}
                  style={{ background: 'var(--success)', color: '#000', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Check size={16} /> Accept
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
