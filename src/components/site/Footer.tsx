import Link from "next/link";
import { Icon, WhatsAppIcon } from "@/components/Icon";
import { instagramUrl, store, whatsappUrl } from "@/lib/config";
import type { Dict } from "@/lib/i18n";
import { Logo } from "./Header";

export function Footer({ t }: { t: Dict }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-shell glass">
          <div className="footer-grid">
            <div>
              <Logo />
              <p className="footer-about">{t.footer.about}</p>
              <div className="socials">
                <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram">
                  <Icon name="instagram" />
                </a>
                <a href={whatsappUrl()} target="_blank" rel="noreferrer" aria-label="WhatsApp">
                  <WhatsAppIcon />
                </a>
                <a href={`tel:${store.phone.replace(/[^\d+]/g, "")}`} aria-label={store.phone}>
                  <Icon name="phone" />
                </a>
              </div>
            </div>
            <div>
              <h4>{t.footer.shop}</h4>
              <ul>
                <li><Link href="/catalog">{t.nav.catalog}</Link></li>
                <li><Link href="/catalog?sort=new">{t.catalog.sortNew}</Link></li>
                <li><Link href="/bestsellers">{t.nav.bestsellers}</Link></li>
              </ul>
            </div>
            <div>
              <h4>{t.footer.help}</h4>
              <ul>
                <li><Link href="/about">{t.nav.about}</Link></li>
                <li><Link href="/wholesale">{t.nav.wholesale}</Link></li>
                <li><Link href="/faq">{t.nav.faq}</Link></li>
                <li><Link href="/contacts">{t.nav.contacts}</Link></li>
              </ul>
            </div>
            <div>
              <h4>{t.nav.contacts}</h4>
              <ul>
                <li><a href={whatsappUrl()} target="_blank" rel="noreferrer">{store.phone}</a></li>
                <li><a href={instagramUrl} target="_blank" rel="noreferrer">@{store.instagram}</a></li>
                {store.email && <li><a href={`mailto:${store.email}`}>{store.email}</a></li>}
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Hana Beauty. {t.footer.rights}</span>
            <span>{store.tagline}</span>
          </div>
          <a
            className="footer-credit"
            href="https://instagram.com/nurissingo"
            target="_blank"
            rel="noreferrer"
          >
            {t.footer.madeBy} <span>@nurissingo</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
