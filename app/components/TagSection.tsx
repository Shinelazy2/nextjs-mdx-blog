import Link from "next/link";

interface Tag {
  tagName: string;
  tagCount: number;
}

interface TagSectionProps {
  selectedTag: string;
  tags: Tag[];
}

export default function TagSection({ selectedTag, tags }: TagSectionProps) {
  console.log("🚀 ~ TagSection ~ tags:", tags)
  if (!tags || tags.length === 0) {
    return (
      <section className="mb-10 hidden sm:block">
        <div className="text-sm text-gray-500">
          태그를 불러오는데 실패했습니다.
        </div>
      </section>
    );
  }

  return (
    <section className="mb-10 hidden sm:block">
      <ul className="flex gap-3">
        {tags.map((tag) => (
          <li key={tag.tagName}>
            <Link
              href={`/mdx/${encodeURIComponent(tag.tagName)}`}
              className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium
                ring-offset-background transition-colors focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                disabled:pointer-events-none disabled:opacity-50 h-9 rounded-md px-3
                ${
                  tag.tagName === selectedTag
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
            >
              {tag.tagName} ({tag.tagCount})
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
