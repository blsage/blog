import { readdir, readFile } from "node:fs/promises";
import { put } from "@vercel/blob";

const dir = new URL("../public/playlist/", import.meta.url);
const files = (await readdir(dir)).filter((file) => file.endsWith(".mp3"));

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error(
    "Missing BLOB_READ_WRITE_TOKEN. Run `vercel env pull .env.local` after creating the Blob store, then `node --env-file=.env.local scripts/upload-playlist.mjs`."
  );
  process.exit(1);
}

let origin = "";
for (const file of files) {
  const data = await readFile(new URL(file, dir));
  const { url } = await put(`playlist/${file}`, data, {
    access: "public",
    addRandomSuffix: false,
    contentType: "audio/mpeg",
  });
  origin = new URL(url).origin;
  console.log(`${file} → ${url}`);
}

console.log(`\nUploaded ${files.length} tracks.`);
console.log(`Set NEXT_PUBLIC_PLAYLIST_BASE=${origin}`);
