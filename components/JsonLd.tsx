import { getAbsoluteUrl, siteConfig } from "@/lib/site";

export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${getAbsoluteUrl()}/#website`,
        url: getAbsoluteUrl(),
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: siteConfig.language,
      },
      {
        "@type": "WebApplication",
        "@id": `${getAbsoluteUrl()}/#app`,
        name: siteConfig.name,
        description: siteConfig.description,
        url: getAbsoluteUrl(),
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web",
        browserRequirements: "Requires JavaScript",
        inLanguage: siteConfig.language,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "UAH",
        },
        author: {
          "@type": "Organization",
          name: siteConfig.name,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
