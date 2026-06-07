import postsData from "./posts.json";

export interface Post {
  id: string;
  date: string;
  title: string;
}

export function getPosts(): Post[] {
  return [...postsData.posts].sort((a, b) => b.date.localeCompare(a.date));
}

function toUTCDate(date: string): Date {
  return new Date(`${date}T00:00:00Z`);
}

export function formatShortDate(date: string): string {
  return toUTCDate(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatArticleDate(date: string): string {
  return toUTCDate(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
