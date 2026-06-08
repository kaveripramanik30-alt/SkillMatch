"use client";
import { useEffect, useState } from "react";

export default function ActivityHeatmap({ email }: { email?: string | null }) {
  const [grid, setGrid] = useState<number[]>([]);

  useEffect(() => {
    if (email !== "gwebtoon666@gmail.com") {
      setGrid(Array.from({ length: 364 }, () => 0));
      return;
    }

    // Generate mock grid for 52 weeks * 7 days (364 days)
    const mockData = Array.from({ length: 364 }, () => {
      // Make it mostly sparse with occasional spikes to look realistic
      const rand = Math.random();
      if (rand > 0.85) return Math.floor(Math.random() * 4) + 1;
      return 0;
    });
    setGrid(mockData);
  }, [email]);

  const getColor = (intensity: number) => {
    switch (intensity) {
      case 0: return 'rgba(255, 255, 255, 0.05)';
      case 1: return 'rgba(16, 185, 129, 0.4)';
      case 2: return 'rgba(16, 185, 129, 0.6)';
      case 3: return 'rgba(16, 185, 129, 0.8)';
      case 4: return 'rgba(16, 185, 129, 1)';
      default: return 'rgba(255, 255, 255, 0.05)';
    }
  };

  if (grid.length === 0) return <div style={{ height: '150px' }}></div>;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
        {months.map(m => <span key={m}>{m}</span>)}
      </div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(52, 1fr)', 
        gridTemplateRows: 'repeat(7, 1fr)', 
        gridAutoFlow: 'column',
        gap: '3px',
      }}>
        {grid.map((intensity, i) => (
          <div 
            key={i} 
            style={{ 
              width: '10px', 
              height: '10px', 
              backgroundColor: getColor(intensity),
              borderRadius: '2px',
              transition: 'transform 0.1s'
            }}
            title={`${intensity} tasks completed`}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.25rem', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <span style={{ marginRight: '0.5rem' }}>Less</span>
        <div style={{ width: 10, height: 10, background: getColor(0), borderRadius: 2 }} />
        <div style={{ width: 10, height: 10, background: getColor(1), borderRadius: 2 }} />
        <div style={{ width: 10, height: 10, background: getColor(2), borderRadius: 2 }} />
        <div style={{ width: 10, height: 10, background: getColor(3), borderRadius: 2 }} />
        <div style={{ width: 10, height: 10, background: getColor(4), borderRadius: 2 }} />
        <span style={{ marginLeft: '0.5rem' }}>More</span>
      </div>
    </div>
  );
}
