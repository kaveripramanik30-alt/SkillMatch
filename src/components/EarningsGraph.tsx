"use client";
import { useMemo, useState } from "react";

export default function EarningsGraph({ totalEarnings }: { totalEarnings: number }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const data = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth(); // 0-11
    const past6Months = Array.from({ length: 6 }).map((_, i) => {
      let mIndex = currentMonth - 5 + i;
      if (mIndex < 0) mIndex += 12;
      return months[mIndex];
    });

    if (!totalEarnings || totalEarnings === 0) {
      return past6Months.map(month => ({ month, earnings: 0 }));
    }

    const e1 = Math.round(totalEarnings * 0.10);
    const e2 = Math.round(totalEarnings * 0.15);
    const e3 = Math.round(totalEarnings * 0.12);
    const e4 = Math.round(totalEarnings * 0.20);
    const e5 = Math.round(totalEarnings * 0.18);
    const e6 = totalEarnings - (e1 + e2 + e3 + e4 + e5);

    const distributions = [e1, e2, e3, e4, e5, e6];

    return past6Months.map((month, i) => ({
      month,
      earnings: distributions[i]
    }));
  }, [totalEarnings]);

  const maxEarnings = Math.max(...data.map(d => d.earnings)) || 1; // prevent div by zero

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', height: '180px', gap: '1.5rem', marginTop: '1rem', padding: '1rem 0' }}>
      {data.map((item, i) => {
        const heightPercent = (item.earnings / maxEarnings) * 100;
        const isHovered = hoveredIndex === i;
        
        return (
          <div 
            key={i} 
            style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem', position: 'relative' }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {isHovered && item.earnings > 0 && (
              <div style={{
                position: 'absolute',
                top: `${100 - heightPercent}%`,
                marginTop: '-35px',
                background: 'var(--foreground)',
                color: 'var(--background)',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                animation: 'fadeUp 0.2s ease-out'
              }}>
                ₹{item.earnings}
              </div>
            )}
            <div style={{
              width: '100%',
              height: `${heightPercent}%`,
              minHeight: item.earnings > 0 ? '4px' : '0px',
              background: isHovered ? 'linear-gradient(to top, var(--primary), var(--accent))' : 'rgba(79, 70, 229, 0.4)',
              borderRadius: '6px 6px 0 0',
              transition: 'all 0.3s ease-out',
              boxShadow: isHovered && item.earnings > 0 ? '0 0 15px rgba(79, 70, 229, 0.5)' : 'none',
              cursor: item.earnings > 0 ? 'pointer' : 'default'
            }}></div>
            <span style={{ fontSize: '0.8rem', color: isHovered && item.earnings > 0 ? 'var(--foreground)' : 'var(--text-muted)', fontWeight: isHovered && item.earnings > 0 ? 600 : 400, transition: 'all 0.2s' }}>
              {item.month}
            </span>
          </div>
        );
      })}
    </div>
  );
}
