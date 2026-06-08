import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Users, Plus } from "lucide-react";
import styles from "../page.module.css";

export default async function TeamsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "STUDENT") {
    return <div>Unauthorized. Only students can view teams.</div>;
  }

  // Fetch all teams
  const teams = await prisma.team.findMany({
    include: {
      members: {
        include: { user: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem' }}>Team Formation</h2>
        <button className={styles.applyBtn}>
          <Plus size={16} /> Create Team
        </button>
      </div>

      <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>
        Can't handle a project alone? Join a team or build one to tackle larger client projects together.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {teams.length === 0 ? (
          <div className={`${styles.emptyState} glass`} style={{ gridColumn: '1 / -1' }}>
            No teams formed yet. Be the first to start one!
          </div>
        ) : (
          teams.map(team => {
            const isMember = team.members.some(m => m.userId === session.user.id);
            return (
              <div key={team.id} className={`${styles.matchCard} glass`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={18} color="var(--primary)" /> {team.name}
                  </h3>
                  {isMember && <span className={styles.microBadge}>Joined</span>}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  {team.description || "No description provided."}
                </p>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Members & Roles</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {team.members.map(member => (
                      <li key={member.id} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                        <span>{member.user.name}</span>
                        <span style={{ color: 'var(--primary)', fontWeight: 500 }}>{member.role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {!isMember && (
                  <button className={styles.applyBtnSecondary} style={{ width: '100%', justifyContent: 'center' }}>
                    Request to Join
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
