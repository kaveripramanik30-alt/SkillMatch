"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ShieldCheck, Star } from "lucide-react";

export default function CompletionWorkflow({
  applicationId,
  projectTitle,
  budget,
  studentName,
}: {
  applicationId: string;
  projectTitle: string;
  budget: number;
  studentName: string;
}) {
  const [step, setStep] = useState<"IDLE" | "PAYMENT" | "PROCESSING" | "RATING" | "DONE">("IDLE");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const router = useRouter();

  const handlePay = () => {
    setStep("PROCESSING");
    setTimeout(() => {
      setStep("RATING");
    }, 2000);
  };

  const handleSubmitRating = async () => {
    try {
      await fetch(`/api/applications/${applicationId}/complete`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, review }),
      });
      setStep("DONE");
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch (e) {
      console.error("Failed to complete task", e);
    }
  };

  if (step === "IDLE") {
    return (
      <button 
        onClick={() => setStep("PAYMENT")}
        style={{
          background: "var(--success)",
          color: "white",
          padding: "0.6rem 1.2rem",
          borderRadius: "100px",
          border: "none",
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}
      >
        <CheckCircle size={16} /> Mark as Completed
      </button>
    );
  }

  // Render Modals inside a portal or fixed overlay
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.8)",
      backdropFilter: "blur(10px)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem"
    }}>
      {step === "PAYMENT" && (
        <div style={{ background: "white", color: "#111", width: "100%", maxWidth: "400px", borderRadius: "16px", overflow: "hidden" }}>
          <div style={{ background: "#0c2f54", padding: "1.5rem", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: "1.2rem" }}>Razorpay Mock</span>
            <ShieldCheck size={24} />
          </div>
          <div style={{ padding: "2rem" }}>
            <p style={{ color: "#555", marginBottom: "0.5rem" }}>Payment to {studentName}</p>
            <h2 style={{ fontSize: "2rem", marginBottom: "2rem" }}>₹{budget}</h2>
            
            <button 
              onClick={handlePay}
              style={{ width: "100%", background: "#3399cc", color: "white", padding: "1rem", borderRadius: "8px", border: "none", fontSize: "1.1rem", fontWeight: 600, cursor: "pointer" }}
            >
              Pay Now
            </button>
            <button 
              onClick={() => setStep("IDLE")}
              style={{ width: "100%", background: "transparent", color: "#666", padding: "1rem", border: "none", marginTop: "0.5rem", cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {step === "PROCESSING" && (
        <div style={{ textAlign: "center", color: "white" }}>
          <div style={{ width: "50px", height: "50px", border: "4px solid rgba(255,255,255,0.2)", borderTopColor: "var(--success)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1.5rem" }}></div>
          <h2>Processing Payment...</h2>
        </div>
      )}

      {step === "RATING" && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", width: "100%", maxWidth: "500px", borderRadius: "32px", padding: "3rem", textAlign: "center" }}>
          <CheckCircle size={48} color="var(--success)" style={{ margin: "0 auto 1.5rem" }} />
          <h2 style={{ marginBottom: "0.5rem", fontSize: "2rem" }}>Payment Successful!</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>How was your experience working with {studentName}?</p>
          
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "2rem" }}>
            {[1, 2, 3, 4, 5].map(star => (
              <Star 
                key={star} 
                size={40} 
                color={star <= rating ? "var(--warning)" : "var(--border)"}
                fill={star <= rating ? "var(--warning)" : "transparent"}
                style={{ cursor: "pointer", transition: "all 0.2s" }}
                onClick={() => setRating(star)}
              />
            ))}
          </div>

          <textarea 
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write a short review..."
            style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid var(--border)", padding: "1rem", borderRadius: "16px", color: "white", minHeight: "100px", marginBottom: "2rem", fontFamily: "inherit" }}
          />

          <button 
            onClick={handleSubmitRating}
            style={{ width: "100%", background: "var(--foreground)", color: "var(--background)", padding: "1.2rem", borderRadius: "1000px", border: "none", fontSize: "1.1rem", fontWeight: 700, cursor: "pointer" }}
          >
            Submit Review
          </button>
        </div>
      )}

      {step === "DONE" && (
        <div style={{ textAlign: "center", color: "white" }}>
          <CheckCircle size={60} color="var(--success)" style={{ margin: "0 auto 1rem" }} />
          <h2>Task Completed</h2>
        </div>
      )}
    </div>
  );
}
