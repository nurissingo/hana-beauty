import type { Metadata } from "next";
import { Icon, WhatsAppIcon } from "@/components/Icon";
import { instagramUrl, store, whatsappUrl } from "@/lib/config";
import { getDict } from "@/lib/i18n-server";

export const metadata: Metadata = { title: "Контакты" };

export default async function ContactsPage() {
  const { t } = await getDict();

  return (
    <div className="container" style={{ paddingBottom: 80 }}>
      <div className="page-head" data-reveal>
        <p className="eyebrow">{t.contacts.eyebrow}</p>
        <h1 className="h2">{t.contacts.title}</h1>
        <p className="lead">{t.contacts.text}</p>
      </div>

      <div className="cta glass" data-reveal>
        <div className="cta-actions">
          <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="btn btn-wa">
            <WhatsAppIcon /> {t.contacts.whatsapp}
          </a>
          <a href={instagramUrl} target="_blank" rel="noreferrer" className="btn btn-glass">
            <Icon name="instagram" size={18} /> {t.contacts.instagram}
          </a>
        </div>
        <ul className="checks" style={{ marginTop: 28 }}>
          <li>
            <span>
              <Icon name="phone" size={15} />
            </span>
            <a href={`tel:${store.phone.replace(/[^\d+]/g, "")}`}>{store.phone}</a>
          </li>
          <li>
            <span>
              <Icon name="instagram" size={15} />
            </span>
            <a href={instagramUrl} target="_blank" rel="noreferrer">
              @{store.instagram}
            </a>
          </li>
          {store.email ? (
            <li>
              <span>
                <Icon name="check" size={15} />
              </span>
              <a href={`mailto:${store.email}`}>{store.email}</a>
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
