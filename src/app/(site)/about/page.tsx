import type { Metadata } from "next";
import Link from "next/link";
import { Icon, type IconName } from "@/components/Icon";
import { getDict } from "@/lib/i18n-server";

export const metadata: Metadata = { title: "О нас" };

const whyIcons: IconName[] = ["shield", "plane", "box", "sparkle"];

export default async function AboutPage() {
  const { t } = await getDict();

  return (
    <div className="container" style={{ paddingBottom: 80 }}>
      <div className="page-head" data-reveal>
        <p className="eyebrow">{t.about.eyebrow}</p>
        <h1 className="h2">{t.about.title}</h1>
        <p className="lead">{t.about.lead}</p>
      </div>

      <div className="about-story glass" data-reveal>
        <div className="about-photo">
          <img src="/founders.jpg" alt={t.about.photoAlt} />
        </div>
        <div className="about-copy">
          <div className="story">
            {t.about.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
          <div className="about-sign">
            {t.about.closing}
            <strong>{t.about.sign}</strong>
          </div>
        </div>
      </div>

      <div className="section-head" data-reveal style={{ marginTop: 48 }}>
        <div>
          <p className="eyebrow">{t.why.eyebrow}</p>
          <h2 className="h2">{t.why.title}</h2>
        </div>
      </div>
      <div className="why-grid">
        {t.why.items.map((item, i) => (
          <div key={item.title} className="why-card glass" data-reveal style={{ ["--d" as string]: `${i * 0.07}s` }}>
            <div className="ico">
              <Icon name={whyIcons[i]} size={22} />
            </div>
            <h3 className="h3">{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>

      <div className="section-head" data-reveal style={{ marginTop: 48 }}>
        <div>
          <p className="eyebrow">{t.steps.eyebrow}</p>
          <h2 className="h2">{t.steps.title}</h2>
        </div>
      </div>
      <div className="steps">
        {t.steps.items.map((s, i) => (
          <div key={s.title} className="step glass" data-reveal style={{ ["--d" as string]: `${i * 0.07}s` }}>
            <div className="step-num">0{i + 1}</div>
            <h3 className="h3">{s.title}</h3>
            <p>{s.text}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link href="/wholesale" className="btn btn-primary">
          {t.nav.wholesale} <Icon name="arrow" size={18} className="ico-move" />
        </Link>
        <Link href="/contacts" className="btn btn-glass">
          {t.nav.contacts}
        </Link>
      </div>
    </div>
  );
}
