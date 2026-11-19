import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { getDict } from "@/lib/i18n-server";

export const metadata: Metadata = { title: "Вопросы" };

export default async function FaqPage() {
  const { t } = await getDict();

  return (
    <div className="container faq-wrap" style={{ paddingBottom: 80 }}>
      <div className="page-head" data-reveal>
        <p className="eyebrow">{t.faq.eyebrow}</p>
        <h1 className="h2">{t.faq.title}</h1>
      </div>

      <div className="faq-list">
        {t.faq.items.map((item, i) => (
          <details key={item.q} className="faq-item glass" data-reveal style={{ ["--d" as string]: `${i * 0.05}s` }}>
            <summary>
              {item.q}
              <span className="plus">
                <Icon name="plus" size={16} />
              </span>
            </summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>

      <div style={{ marginTop: 40 }}>
        <Link href="/contacts" className="btn btn-primary">
          {t.nav.contacts} <Icon name="arrow" size={18} className="ico-move" />
        </Link>
      </div>
    </div>
  );
}
