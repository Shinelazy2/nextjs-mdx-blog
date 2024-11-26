import { permanentRedirect } from "next/navigation";

export default function BlogPage() {
  permanentRedirect("/mdx/tag/All");
}
