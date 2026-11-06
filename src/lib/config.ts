export const store = {
  name: "Hana Beauty",
  tagline: "Korean Beauty · Kazakhstan",
  phone: process.env.STORE_PHONE ?? "+82 10-7557-5906",
  whatsapp: process.env.STORE_WHATSAPP ?? "821075575906",
  instagram: process.env.STORE_INSTAGRAM ?? "hana_beauty.kazakhstan",
  email: process.env.STORE_EMAIL ?? "",
};

export const instagramUrl = `https://www.instagram.com/${store.instagram}/`;

export function whatsappUrl(text?: string) {
  const base = `https://wa.me/${store.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
