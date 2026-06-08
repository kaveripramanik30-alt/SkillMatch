export interface MatchResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export function calculateMatchScore(studentSkills: string, requiredSkills: string): MatchResult {
  if (!requiredSkills) return { score: 100, matchedSkills: [], missingSkills: [] };
  if (!studentSkills) return { score: 0, matchedSkills: [], missingSkills: requiredSkills.split(',').map(s => s.trim()) };

  const studentArr = studentSkills.split(',').map(s => s.trim().toLowerCase());
  const requiredArr = requiredSkills.split(',').map(s => s.trim().toLowerCase());

  const matched: string[] = [];
  const missing: string[] = [];

  requiredArr.forEach(reqSkill => {
    if (studentArr.includes(reqSkill)) {
      matched.push(reqSkill);
    } else {
      missing.push(reqSkill);
    }
  });

  const score = Math.round((matched.length / requiredArr.length) * 100);

  return {
    score,
    matchedSkills: matched,
    missingSkills: missing
  };
}

export function getTutorialLink(skill: string): string {
  // Mock function to return a tutorial link based on the missing skill
  const skillLower = skill.toLowerCase();
  if (skillLower.includes('react')) return 'https://react.dev/learn';
  if (skillLower.includes('python')) return 'https://docs.python.org/3/tutorial/index.html';
  if (skillLower.includes('node')) return 'https://nodejs.org/en/learn';
  if (skillLower.includes('css')) return 'https://web.dev/learn/css/';
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' tutorial')}`;
}
