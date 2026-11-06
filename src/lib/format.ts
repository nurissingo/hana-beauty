export function formatPrice(value: number) {
  return `${new Intl.NumberFormat("ru-RU").format(Math.round(value)).replace(/\u00a0/g, " ")} ₸`;
}

const translit: Record<string, string> = {
  а: "a", ә: "a", б: "b", в: "v", г: "g", ғ: "g", д: "d", е: "e", ё: "e", ж: "zh",
  з: "z", и: "i", й: "y", к: "k", қ: "q", л: "l", м: "m", н: "n", ң: "n", о: "o",
  ө: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ұ: "u", ү: "u", ф: "f", х: "h",
  һ: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", і: "i", ь: "", э: "e",
  ю: "yu", я: "ya",
};

export function slugify(input: string) {
  return input
    .toLowerCase()
    .split("")
    .map((ch) => translit[ch] ?? ch)
    .join("")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}