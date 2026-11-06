"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { setLanguage } from "@/app/actions";
import { Icon } from "@/components/Icon";
import type { Lang } from "@/lib/i18n";
import { useCart, useI18n } from "./Providers";

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="Hana Beauty">
      <img src="/logo.png" alt="" className="logo-img" />
      <span>
        hana <small>beauty</small>
      </span>
    </Link>
  );
}

export function Header() {
  const { t, lang } = useI18n();
  const cart = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenu(false);
    setSearch(false);
  }

  useEffect(() => {
    if (search) inputRef.current?.focus();
  }, [search]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearch(false);
        setMenu(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const changeLang = (next: Lang) => {
    if (next === lang) return;
    startTransition(async () => {
      await setLanguage(next);
      router.refresh();
    });
  };

  const links = [
    { href: "/catalog", label: t.nav.catalog },
    { href: "/#bestsellers", label: t.nav.bestsellers },
    { href: "/#about", label: t.nav.about },
    { href: "/#wholesale", label: t.nav.wholesale },
    { href: "/#faq", label: t.nav.faq },
  ];

  const langSwitch = (
    <div className="lang-switch" role="group" aria-label="Language">
      {(["ru", "kz"] as const).map((l) => (
        <button key={l} type="button" className={l === lang ? "on" : ""} onClick={() => changeLang(l)} aria-pressed={l === lang}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <div className="promo-bar">{t.promo}</div>
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <div className="container" style={{ position: "relative" }}>
          <div className="nav-shell">
            <Logo />
            <nav className="nav-links" aria-label="Main">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className={pathname === l.href ? "active" : ""}>
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="nav-actions">
              <button type="button" className="icon-btn" aria-label={t.nav.search} onClick={() => setSearch((s) => !s)}>
                <Icon name={search ? "close" : "search"} />
              </button>
              {langSwitch}
              <button type="button" className="icon-btn" aria-label={t.nav.cart} onClick={() => cart.setOpen(true)}>
                <Icon name="bag" />
                {cart.ready && cart.count > 0 && (
                  <span className="badge-count" key={cart.count}>
                    {cart.count}
                  </span>
                )}
              </button>
              <button type="button" className="icon-btn menu-btn" aria-label={t.nav.menu} onClick={() => setMenu(true)}>
                <Icon name="menu" />
              </button>
            </div>
          </div>
          <div className={`search-pop ${search ? "open" : ""}`}>
            <form action="/catalog" className="glass-strong" role="search">
              <Icon name="search" className="muted" />
              <input ref={inputRef} name="q" placeholder={t.nav.search} aria-label={t.nav.search} autoComplete="off" />
              <button className="btn btn-primary btn-sm" type="submit">
                <Icon name="arrow" size={18} />
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${menu ? "open" : ""}`} aria-hidden={!menu}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo />
          <button type="button" className="icon-btn" aria-label={t.nav.close} onClick={() => setMenu(false)}>
            <Icon name="close" />
          </button>
        </div>
        <nav>
          {[...links, { href: "/#contacts", label: t.nav.contacts }].map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMenu(false)} tabIndex={menu ? 0 : -1}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {langSwitch}
          <button type="button" className="btn btn-primary" onClick={() => { setMenu(false); cart.setOpen(true); }}>
            <Icon name="bag" size={18} /> {t.nav.cart} {cart.count > 0 ? `· ${cart.count}` : ""}
          </button>
        </div>
      </div>
    </>
  );
}
