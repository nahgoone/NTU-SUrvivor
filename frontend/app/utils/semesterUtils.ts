export function compareSemestersDescending(a: string, b: string): number {
  return getSemesterScore(b) - getSemesterScore(a);
}

export function getSemesterScore(semester: string): number {
  const match = semester
    .trim()
    .toUpperCase()
    .match(/^Y(\d+)S(\d+)$/);

  if (!match) {
    return -1;
  }

  const year = Number(match[1]);
  const sem = Number(match[2]);

  return year * 10 + sem;
}
