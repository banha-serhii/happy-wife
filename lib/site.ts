const repositoryName = "happy-wife";

function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProduction) {
    return `https://${vercelProduction.replace(/\/$/, "")}`;
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    return `https://${vercelUrl.replace(/\/$/, "")}`;
  }

  if (process.env.GITHUB_PAGES === "true") {
    return `https://banha-serhii.github.io/${repositoryName}`;
  }

  return "http://localhost:3000";
}

export const siteConfig = {
  name: "Happy Wife",
  title: "Happy Wife — збережіть гармонію в домі",
  shortTitle: "Happy Wife",
  description:
    "Жартівливий український додаток для чоловіків: перш ніж скаржитись на дружину — подумайте двічі. Поради з підтримки коханої та гармонії в домі.",
  locale: "uk_UA",
  language: "uk",
  url: resolveSiteUrl(),
  githubUser: "banha-serhii",
  repositoryName,
  keywords: [
    "Happy Wife",
    "гармонія в домі",
    "стосунки",
    "підтримка дружини",
    "жарт",
    "українська",
    "шлюб",
    "сім'я",
  ],
} as const;

export function getAbsoluteUrl(path = ""): string {
  const base = siteConfig.url.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return path ? `${base}${suffix}` : base;
}
