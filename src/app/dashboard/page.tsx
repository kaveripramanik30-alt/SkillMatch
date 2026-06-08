import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { calculateMatchScore, getTutorialLink } from "@/lib/matching";
import styles from "./page.module.css";
import Link from "next/link";
import { Briefcase, UserCircle, Users, BookOpen, CheckCircle, ExternalLink, Trophy, Flame, Star, UserPlus } from "lucide-react";
import ApplyButton from "@/components/ApplyButton";
import ReviewAction from "@/components/ReviewAction";
import EarningsGraph from "@/components/EarningsGraph";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import CompletionWorkflow from "@/components/CompletionWorkflow";
import InviteCollaboratorModal from "@/components/InviteCollaboratorModal";
import CollaborationRequests from "@/components/CollaborationRequests";

async function StudentDashboard({ userId, email }: { userId: string, email?: string | null }) {
  const profile = await prisma.studentProfile.findUnique({
    where: { userId }
  });

  const hasSkills = profile?.skills && profile.skills.trim().length > 0;
  
  // Fetch open projects
  const openProjects = await prisma.project.findMany({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" }
  });

  // Fetch applications where student is LEAD
  const myApplications = await prisma.application.findMany({
    where: { studentId: userId },
    include: { 
      project: {
        include: { client: true }
      },
      collaborations: true 
    }
  });

  const appliedProjectIds = myApplications.map(a => a.projectId);

  // Fetch collaborations where student is INVITED
  const myCollaborations = await prisma.collaboration.findMany({
    where: { studentId: userId },
    include: {
      application: {
        include: {
          project: true,
          student: true,
          collaborations: true
        }
      }
    }
  });

  const pendingRequests = myCollaborations.filter(c => c.status === "PENDING");
  const acceptedCollabs = myCollaborations.filter(c => c.status === "ACCEPTED");

  // Active tasks = LEAD tasks + COLLAB tasks
  const activeLeadTasks = myApplications.filter(a => a.status === "ACCEPTED").map(a => ({ ...a, isLead: true }));
  const activeCollabTasks = acceptedCollabs.filter(c => c.application.status === "ACCEPTED").map(c => ({ ...c.application, isLead: false }));
  const activeTasks = [...activeLeadTasks, ...activeCollabTasks];

  // Completed tasks = LEAD tasks + COLLAB tasks
  const completedLeadTasks = myApplications.filter(a => a.status === "COMPLETED").map(a => ({ ...a, isLead: true }));
  const completedCollabTasks = acceptedCollabs.filter(c => c.application.status === "COMPLETED").map(c => ({ ...c.application, isLead: false }));
  
  let completedTasks = [...completedLeadTasks, ...completedCollabTasks];

  if (email === "gwebtoon666@gmail.com") {
    const mockPastWorks = [
      { id: "mock1", isLead: true, collaborations: [], project: { title: "Edit Wedding Highlights", budget: 4100 }, rating: 5, review: "Incredible eye for detail. The edits were seamless!" },
      { id: "mock2", isLead: true, collaborations: [], project: { title: "Product Photography Session", budget: 2800 }, rating: 5, review: "Photos turned out stunning, very professional." },
      { id: "mock3", isLead: true, collaborations: [], project: { title: "Social Media Video Ad", budget: 3200 }, rating: 4, review: "Great video, quick turnaround." },
      { id: "mock4", isLead: true, collaborations: [], project: { title: "Portrait Touchups", budget: 1800 }, rating: 5, review: "Flawless retouching." },
      { id: "mock5", isLead: true, collaborations: [], project: { title: "Event Photography", budget: 2300 }, rating: 5, review: "Captured the event perfectly." },
      { id: "mock6", isLead: true, collaborations: [], project: { title: "Thumbnail Design", budget: 1500 }, rating: 5, review: "High CTR thumbnail, thanks!" },
    ] as any;
    completedTasks = [...completedTasks, ...mockPastWorks];
  }

  // Calculate matches
  const matches = openProjects.map(project => {
    const match = calculateMatchScore(profile?.skills || "", project.requiredSkills);
    return { project, match };
  }).sort((a, b) => b.match.score - a.match.score);

  // Dynamic Earnings Split
  const totalEarnings = completedTasks.reduce((sum, a) => {
    const activeCollabs = (a.collaborations || []).filter((c:any) => c.status === "ACCEPTED").length;
    const splitCount = activeCollabs + 1; // +1 for the lead
    return sum + (a.project.budget / splitCount);
  }, 0); 

  return (
    <div className={styles.dashboardView}>
      <div className={styles.headerRow}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h2>Student Dashboard</h2>
          <div className={styles.badgeLabel} style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', color: '#000', padding: '0.2rem 0.6rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Trophy size={14}/> Gold Master
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/dashboard/teams" className={styles.actionBtnSecondary}>
            <Users size={16} /> My Teams
          </Link>
          <Link href="/dashboard/profile" className={styles.actionBtn}>
            <UserCircle size={16} /> Edit Profile
          </Link>
        </div>
      </div>
      
      {!hasSkills && (
        <div className={`${styles.alert} glass`}>
          <h3>Complete Your Profile</h3>
          <p>You need to add your skills before we can match you with tasks.</p>
          <Link href="/dashboard/profile" className={styles.actionBtn}>
            Update Skills
          </Link>
        </div>
      )}

      {hasSkills && (
        <div className={`${styles.card} glass`} style={{ marginBottom: '2rem', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>About Me</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6, fontStyle: profile.bio ? 'normal' : 'italic' }}>
            {profile.bio || "No bio added yet."}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {profile.skills.split(',').map(s => (
              <span key={s} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600 }}>
                {s.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {pendingRequests.length > 0 && (
        <CollaborationRequests requests={pendingRequests} />
      )}

      {/* Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        <div className={`${styles.card} glass`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Earnings History</h3>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>₹{totalEarnings}</span>
          </div>
          <EarningsGraph totalEarnings={totalEarnings} />
        </div>

        <div className={`${styles.card} glass`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Activity Heatmap</h3>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 600 }}><Flame size={16}/> 14 Day Streak</span>
          </div>
          <ActivityHeatmap email={email} />
        </div>
      </div>

      {activeTasks.length > 0 && (
        <div className={`${styles.feedSection} glass`} style={{ marginBottom: '2rem', border: '1px solid var(--success)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
            <CheckCircle size={20} /> Active Tasks ({activeTasks.length})
          </h3>
          <div className={styles.matchList}>
            {activeTasks.map((app) => {
              const activeCollabs = (app.collaborations || []).filter((c:any) => c.status === "ACCEPTED").length;
              return (
                <div key={app.id} className={styles.matchCard} style={{ background: 'rgba(16, 185, 129, 0.05)' }}>
                  <div className={styles.matchHeader}>
                    <h4>{app.project.title}</h4>
                    <div className={styles.scoreBadge} style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)' }}>
                      In Progress
                    </div>
                  </div>
                  <p className={styles.description}>{app.project.description}</p>
                  {app.project.client?.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--accent)' }}>
                      <ExternalLink size={14} />
                      <span>Client: <strong>{app.project.client.email}</strong></span>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <div className={styles.matchFooter} style={{ marginTop: 0 }}>
                      <div className={styles.budget}>₹{app.project.budget}</div>
                      {app.project.isMicroTask && <span className={styles.microBadge}>Micro-Task</span>}
                      {app.isLead === false && <span className={styles.microBadge} style={{ background: 'rgba(79, 70, 229, 0.2)', color: 'var(--primary)' }}>Collaborator</span>}
                    </div>

                    {app.isLead && (
                      <InviteCollaboratorModal 
                        applicationId={app.id} 
                        currentCollaboratorsCount={activeCollabs} 
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div className={`${styles.feedSection} glass`} style={{ marginBottom: '2rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <CheckCircle size={20} /> Past Work
          </h3>
          <div className={styles.matchList}>
            {completedTasks.slice(0, 5).map((app) => {
              const activeCollabs = (app.collaborations || []).filter((c:any) => c.status === "ACCEPTED").length;
              const splitCount = activeCollabs + 1;
              const myCut = app.project.budget / splitCount;

              return (
                <div key={app.id} className={styles.matchCard} style={{ opacity: 0.8 }}>
                  <div className={styles.matchHeader}>
                    <h4>{app.project.title}</h4>
                    <div className={styles.scoreBadge} style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-muted)' }}>
                      Completed
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
                    <div className={styles.budget} style={{ color: 'var(--success)' }}>Earned ₹{myCut.toFixed(0)}</div>
                    {splitCount > 1 && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--primary)', background: 'rgba(79,70,229,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        Split with {splitCount - 1} {splitCount - 1 === 1 ? 'peer' : 'peers'}
                      </span>
                    )}
                  </div>
                  {app.review && (
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', marginTop: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.2rem', color: 'var(--warning)', marginBottom: '0.5rem' }}>
                        {Array.from({ length: app.rating || 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                      </div>
                      <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.9rem' }}>"{app.review}"</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className={`${styles.feedSection} glass`}>
        <h3>Your Match Feed</h3>
        {!hasSkills ? (
          <p className={styles.emptyState}>Add skills to see your matches.</p>
        ) : matches.length === 0 ? (
          <p className={styles.emptyState}>No projects available right now. Check back soon!</p>
        ) : (
          <div className={styles.matchList}>
            {matches.map(({ project, match }) => {
              const isApplied = appliedProjectIds.includes(project.id);
              
              return (
                <div key={project.id} className={styles.matchCard}>
                  <div className={styles.matchHeader}>
                    <h4>{project.title}</h4>
                    <div className={styles.scoreBadge} style={{ 
                      background: match.score >= 80 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: match.score >= 80 ? 'var(--success)' : 'var(--warning)'
                    }}>
                      {match.score}% Match
                    </div>
                  </div>
                  
                  <p className={styles.description}>{project.description}</p>
                  
                  <div className={styles.matchFooter}>
                    <div className={styles.budget}>₹{project.budget}</div>
                    {project.isMicroTask && <span className={styles.microBadge}>Micro-Task</span>}
                  </div>

                  <div className={styles.actionArea}>
                    {match.score === 100 ? (
                      <ApplyButton projectId={project.id} score={match.score} isApplied={isApplied} />
                    ) : (
                      <div className={styles.learningPath}>
                        <p className={styles.missingTitle}>Missing required skills:</p>
                        <div className={styles.missingTags}>
                          {match.missingSkills.map(skill => (
                            <a key={skill} href={getTutorialLink(skill)} target="_blank" rel="noreferrer" className={styles.tutorialLink}>
                              <BookOpen size={14}/> Learn {skill}
                            </a>
                          ))}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                          <ApplyButton projectId={project.id} score={match.score} isApplied={isApplied} />
                          <button className={styles.applyBtnSecondary}>Form a Team</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

async function ClientDashboard({ userId }: { userId: string }) {
  const projects = await prisma.project.findMany({
    where: { clientId: userId },
    include: {
      applications: {
        include: { student: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const completedProjects = projects.filter(p => p.applications.some(a => a.status === 'COMPLETED') || p.status === 'COMPLETED');
  const inProgressProjects = projects.filter(p => p.applications.some(a => a.status === 'ACCEPTED') && !completedProjects.includes(p));
  const openProjects = projects.filter(p => !completedProjects.includes(p) && !inProgressProjects.includes(p));

  const totalSpent = completedProjects.reduce((sum, p) => sum + p.budget, 0);

  const renderProjectCard = (p: typeof projects[0], type: 'REVIEW' | 'IN_PROGRESS' | 'COMPLETED') => (
    <li key={p.id} className={styles.projectItem} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '1rem' }}>
        <div>
          <h4>{p.title}</h4>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Required: {p.requiredSkills}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className={styles.statusBadge} style={{ background: p.status === 'OPEN' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)', color: p.status === 'OPEN' ? 'var(--success)' : '#3b82f6', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>
            {type === 'COMPLETED' ? 'COMPLETED' : type === 'IN_PROGRESS' ? 'IN PROGRESS' : p.status}
          </span>
          {p.isMicroTask && <span className={styles.microBadge}>Micro</span>}
          <span className={styles.budget}>₹{p.budget}</span>
        </div>
      </div>

      {/* Applications Sub-View */}
      <div style={{ width: '100%', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px' }}>
        <h5 style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {type === 'REVIEW' ? `Review Applications (${p.applications.length})` : type === 'IN_PROGRESS' ? 'Active Freelancer' : 'Completed Work'}
        </h5>
        
        {p.applications.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No applications yet. The engine is searching for matches.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {p.applications.map(app => {
              // If it's in progress, only show the ACCEPTED app. If completed, only show COMPLETED app.
              if (type === 'IN_PROGRESS' && app.status !== 'ACCEPTED') return null;
              if (type === 'COMPLETED' && app.status !== 'COMPLETED') return null;

              return (
                <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <UserCircle size={24} color="var(--primary)" />
                    <div>
                      <div style={{ fontWeight: 600 }}>{app.student.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--success)' }}>{app.matchScore}% Match Score</div>
                      {(type === 'IN_PROGRESS' || type === 'COMPLETED') && app.student.email && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--accent)', marginTop: '0.15rem' }}>{app.student.email}</div>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Link href={`/dashboard/student/${app.studentId}`} style={{ color: 'var(--accent)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}>
                      View Profile <ExternalLink size={14} />
                    </Link>
                    
                    {app.status === 'PENDING' && p.status === 'OPEN' ? (
                      <ReviewAction applicationId={app.id} studentName={app.student.name || "Student"} />
                    ) : app.status === 'ACCEPTED' ? (
                      <CompletionWorkflow 
                        applicationId={app.id} 
                        projectTitle={p.title}
                        budget={p.budget}
                        studentName={app.student.name || "Student"}
                      />
                    ) : (
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: app.status === 'COMPLETED' ? 'var(--success)' : 'var(--danger)' }}>
                        {app.status}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </li>
  );

  return (
    <div className={styles.dashboardView}>
      <div className={styles.headerRow}>
        <h2>Client Dashboard</h2>
        <Link href="/dashboard/post-task" className={styles.actionBtn}>
          <Briefcase size={16} /> Post a Task
        </Link>
      </div>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} glass`}>
          <h3>Active Projects</h3>
          <p className={styles.bigNumber}>{inProgressProjects.length}</p>
        </div>
        <div className={`${styles.statCard} glass`}>
          <h3>Total Spent</h3>
          <p className={styles.bigNumber}>₹{totalSpent}</p>
        </div>
      </div>

      {inProgressProjects.length > 0 && (
        <div className={`${styles.feedSection} glass`} style={{ border: '1px solid var(--success)', marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--success)' }}>Tasks In Progress ({inProgressProjects.length})</h3>
          <ul className={styles.projectList}>
            {inProgressProjects.map(p => renderProjectCard(p, 'IN_PROGRESS'))}
          </ul>
        </div>
      )}

      <div className={`${styles.feedSection} glass`} style={{ marginBottom: '2rem' }}>
        <h3>Applications to Review ({openProjects.length})</h3>
        {openProjects.length === 0 ? (
          <p className={styles.emptyState}>No open tasks waiting for review.</p>
        ) : (
          <ul className={styles.projectList}>
            {openProjects.map(p => renderProjectCard(p, 'REVIEW'))}
          </ul>
        )}
      </div>

      {completedProjects.length > 0 && (
        <div className={`${styles.feedSection} glass`} style={{ opacity: 0.8 }}>
          <h3>Completed Projects ({completedProjects.length})</h3>
          <ul className={styles.projectList}>
            {completedProjects.map(p => renderProjectCard(p, 'COMPLETED'))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  const role = session.user.role;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Welcome, {session.user.name}</h1>
        <p className={styles.badge}>{role}</p>
      </header>

      <main>
        {role === "STUDENT" ? (
          <StudentDashboard userId={session.user.id} email={session.user.email} />
        ) : (
          <ClientDashboard userId={session.user.id} />
        )}
      </main>
    </div>
  );
}
