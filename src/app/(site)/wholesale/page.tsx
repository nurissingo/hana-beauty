import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { LeadForm } from "@/components/site/LeadForm";
import { getDict } from "@/lib/i18n-server";

export const metadata: Metadata = { title: "Оптом" };

export default async function WholesalePage() {
  const { t } = await getDict();

  return (
    <div className="container" style={{ paddingBottom: 80 }}>
      <div className="page-head" data-reveal>
        <p className="eyebrow">{t.wholesale.eyebrow}</p>
        <h1 className="h2">{t.wholesale.title}</h1>
        <p className="lead">{t.wholesale.text}</p>
      </div>

      <div className="wholesale glass" data-reveal>
        <div style={{ position: "relative" }}>
          <ul className="checks">
            {t.wholesale.points.map((point) => (
              <li key={point}>
                <span>
                  <Icon name="check" size={15} strokeWidth={2.4} />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
        <LeadForm />
      </div>
    </div>
  );
}
