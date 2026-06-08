import styles from "./page.module.css";
import Link from "next/link";
import { ArrowRight, Code, Presentation, Bug, Users, Star, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className={styles.container}>
      
      {/* Superlist-Style Centered Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.massiveTitle}>
            Hire expert students. <span className={styles.highlight}>Finally on one platform.</span>
          </h1>
          <p className={styles.subtitle}>
            The freelance platform for micro-tasks, design, and code — all in<br />
            one fast, beautiful workspace without the bidding wars.
          </p>
          
          <div className={styles.heroActions}>
            <Link href="/auth/signup?role=client" className={`${styles.btn} ${styles.btnPrimary}`}>
              Hire a student
            </Link>
            <Link href="/auth/signup?role=student" className={`${styles.btn} ${styles.btnSecondary}`}>
              Earn as a student
            </Link>
          </div>
        </div>

        {/* Full-size images placed below the text in a massive grid */}
        <div className={styles.heroVisualsContainer}>
          <div className={styles.visualsGrid}>
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop" alt="Students" className={`${styles.heroImg} ${styles.mainImg}`} />
            <img src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop" alt="Video Editing" className={`${styles.heroImg} ${styles.sideImg1}`} />
            <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop" alt="Coding" className={`${styles.heroImg} ${styles.sideImg2}`} />
          </div>
        </div>
      </section>

      {/* Superlist Bento Box Grid */}
      <section className={styles.bentoSection}>
        <div className={styles.bentoHeader}>
          <h2>Everything you need, matched instantly.</h2>
        </div>

        <div className={styles.bentoGrid}>
          <div className={`${styles.bentoCard} ${styles.bentoLarge1} glass`}>
            <div className={styles.bentoContent}>
              <Bug size={40} color="var(--primary)" />
              <h3>Fix a Bug</h3>
              <p>Got a stubborn CSS issue or a React hook failing? Get it fixed in hours.</p>
              <span className={styles.priceTag}>₹500</span>
            </div>
            <div className={styles.bentoDecoration1}></div>
          </div>

          <div className={`${styles.bentoCard} ${styles.bentoSquare1} glass`}>
            <Presentation size={32} color="var(--success)" />
            <h3>Make a PPT</h3>
            <p>Need a polished presentation? A design student can handle it.</p>
          </div>

          <div className={`${styles.bentoCard} ${styles.bentoSquare2} glass`}>
            <Code size={32} color="var(--warning)" />
            <h3>Write a Snippet</h3>
            <p>Need a custom Regex or a small utility function?</p>
          </div>

          <div className={`${styles.bentoCard} ${styles.bentoLarge2} glass`}>
            <div className={styles.bentoContentRow}>
              <div>
                <div className={styles.pillBadge}>Skill Matching</div>
                <h3>Zero Bidding Wars</h3>
                <p style={{ marginTop: '1rem', maxWidth: '400px' }}>No proposals. No racing to the bottom. Our algorithm matches clients directly to the exact student with the right skills, instantly.</p>
              </div>
              <ul className={styles.checkList}>
                <li><CheckIcon /> Instant Match Engine</li>
                <li><CheckIcon /> Verified Skill Sets</li>
                <li><CheckIcon /> Transparent Pricing</li>
              </ul>
            </div>
          </div>

          <div className={`${styles.bentoCard} ${styles.bentoLarge3} glass`}>
            <div className={styles.bentoContentRow}>
              <div>
                <div className={styles.pillBadge}>Learning Engine</div>
                <h3>Learn → Apply → Earn</h3>
                <p style={{ marginTop: '1rem', maxWidth: '400px' }}>If you're an 85% match for a task, we'll give you the exact tutorials you need to bridge the gap.</p>
              </div>
              <ul className={styles.checkList}>
                <li><CheckIcon /> Upskill on the job</li>
                <li><CheckIcon /> Curated tutorials</li>
                <li><CheckIcon /> Build your portfolio</li>
              </ul>
            </div>
          </div>

          <div className={`${styles.bentoCard} ${styles.bentoSquare3} glass`}>
            <Users size={32} color="var(--accent)" />
            <h3>Form Teams</h3>
            <p>Tackle larger projects by grouping up with other verified students.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <h2 className={styles.massiveTitle} style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '2rem' }}>Ready to start?</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link href="/auth/signup?role=client" className={`${styles.btn} ${styles.btnPrimary}`}>
            Hire Now <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
          </Link>
        </div>
      </section>

    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}
