import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, ExternalLink, UserCircle, CheckCircle } from "lucide-react";
import styles from "../../page.module.css";

export default async function StudentProfileView({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "CLIENT") {
    redirect("/dashboard");
  }

  const student = await prisma.user.findUnique({
    where: { id: resolvedParams.id },
    include: { studentProfile: true }
  });

  if (!student || !student.studentProfile) {
    return <div>Student not found.</div>;
  }

  const profile = student.studentProfile;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className={`${styles.card} glass`} style={{ padding: '3rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '50%' }}>
            <UserCircle size={80} color="var(--primary)" />
          </div>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{student.name}</h1>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span className={styles.microBadge} style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem' }}>
                <Star size={14} fill="currentColor" /> 4.9 Rating
              </span>
              <span style={{ color: 'var(--text-muted)' }}>14 Micro-Tasks Completed</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {profile.skills.split(',').map(s => (
                <span key={s} style={{ background: 'rgba(79, 70, 229, 0.1)', color: 'var(--accent)', padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '0.9rem' }}>
                  {s.trim()}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Bio & Links</h3>
            <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>{profile.bio || "No bio provided."}</p>
            {profile.portfolioUrl && (
              <a href={profile.portfolioUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                View Portfolio <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Recent Reviews</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[1, 2, 3].map((_, i) => (
          <div key={i} className={`${styles.card} glass`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ marginBottom: '0.25rem' }}>Fixed responsive bug in Navigation</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>"Fast turnaround and perfect execution. Highly recommend!"</p>
            </div>
            <div style={{ color: 'var(--success)' }}><CheckCircle size={20} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
