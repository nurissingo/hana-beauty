import "server-only";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { UPLOAD_DIR } from "./db";

const MAX_SIZE = 10 * 1024 * 1024;

const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export const MEDIA_PREFIX = "/media/";
export const MEDIA_FILE_RE = /^[a-f0-9-]{36}\.(jpg|png|webp|avif)$/;

export async function saveUpload(file: File) {
  const ext = extensions[file.type];
  if (!ext) throw new Error("Поддерживаются только JPG, PNG, WEBP и AVIF");
  if (file.size > MAX_SIZE) throw new Error("Файл больше 10 МБ");
  const name = `${randomUUID()}.${ext}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return `${MEDIA_PREFIX}${name}`;
}

export async function removeUpload(url: string) {
  if (!url.startsWith(MEDIA_PREFIX)) return;
  const name = url.slice(MEDIA_PREFIX.length);
  if (!MEDIA_FILE_RE.test(name)) return;
  await fs.rm(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name), { force: true });
}
