// Simple hash function for generating gravatar URLs
// In production, you'd want to use a proper MD5 library or handle this server-side
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

export function getGravatarUrl(email: string, size: number = 40): string {
  // For demo purposes, we'll use a simple hash
  // In production, use proper MD5 hashing
  const hash = simpleHash(email.toLowerCase().trim());
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=mp`;
}