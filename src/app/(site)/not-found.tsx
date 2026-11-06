import Link from "next/link";
import { Icon } from "@/components/Icon";
import { getDict } from "@/lib/i18n-server";

export default async function NotFound() {
  const { t } = await getDict();
  return (
    <div className="container" style={{ padding: "60px 24px 100px" }}>
      <div className="empty glass">
        <div className="ico">
          <Icon name="search" size={28} />
        </div>
        <h1 className="h2">{t.notFound.title}</h1>
        <p>{t.notFound.text}</p>
        <div className="hero-cta" style={{ justifyContent: "center", marginTop: 0 }}>
          <Link href="/" className="btn btn-glass">{t.notFound.home}</Link>
          <Link href="/catalog" className="btn btn-primary">{t.nav.catalog}</Link>
        </div>
      </div>
    </div>
  );
}
