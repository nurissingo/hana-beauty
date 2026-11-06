import "server-only";
import { cookies } from "next/headers";
import { dictionaries, isLang, LANG_COOKIE, type Lang } from "./i18n";

export async function getLang(): Promise<Lang> {
  const value = (await cookies()).get(LANG_COOKIE)?.value;
  return isLang(value) ? value : "ru";
}

export async function getDict() {
  const lang = await getLang();
  return { lang, t: dictionaries[lang] };
}
