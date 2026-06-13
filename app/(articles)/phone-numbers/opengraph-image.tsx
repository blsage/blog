import {
  articleOgImage,
  ogAlt,
  ogContentType,
  ogSize,
} from "@/app/article-og";

const slug = "phone-numbers";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = ogAlt(slug);

export default function Image() {
  return articleOgImage(slug);
}
