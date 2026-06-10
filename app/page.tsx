import HomeApp from "@/components/HomeApp";
import { siteConfig } from "@/lib/site";

export default function Home() {
  return (
    <>
      <h1 className="sr-only">{siteConfig.title}</h1>
      <p className="sr-only">{siteConfig.description}</p>
      <HomeApp />
    </>
  );
}
