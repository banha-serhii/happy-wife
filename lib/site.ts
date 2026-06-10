const repositoryName = "happy-wife";

export const siteConfig = {
  name: "Happy Wife",
  title: "Happy Wife — збережіть гармонію в домі",
  shortTitle: "Happy Wife",
  description:
    "Жартівливий український додаток для чоловіків: перш ніж скаржитись на дружину — подумайте двічі. Поради з підтримки коханої та гармонії в домі.",
  locale: "uk_UA",
  language: "uk",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    `https://banha-serhii.github.io/${repositoryName}`,
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
