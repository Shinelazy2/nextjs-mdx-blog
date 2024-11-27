import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { Post } from "../lib/posts";
import dayjs from 'dayjs'

// interface Post {
//   id: string;
//   title: string;
//   description: string;
//   date: string;
//   tags: string[];
//   thumbnail: string;
//   readingTime: number;
// }

interface PostListProps {
  posts: Post[];
  selectedTag: string;
}

export default function PostList({ posts, selectedTag }: PostListProps) {
  console.log('posts', posts);
  
  const filteredPosts =
    selectedTag === "All"
      ? posts
      : posts.filter((post) => post.tags.includes(selectedTag));

  return (
    <section>
      <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        {filteredPosts.map((post) => (
          <a key={post.id} href={`/mdx/${selectedTag}/${post.id}`}>
            <li className="flex h-full flex-col gap-3 overflow-hidden rounded-md border shadow-md transition hover:shadow-xl dark:border-slate-700 dark:hover:border-white">
              <div className="relative aspect-video w-full rounded-t-md border-b">
                <Image
                  alt={`thumbnail for ${post.title}`}
                  src={post.thumbnail}
                  fill
                  sizes="(max-width: 1000px) 50vw, 450px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-4 pt-1">
                <div>
                  <div className="text-sm font-medium text-pink-600 lg:text-base">
                    {post.tags.join('\t') ?? ""}
                  </div>
                  <h2 className="mb-3 mt-1 text-lg font-bold sm:text-xl md:text-lg">
                    {post.title}
                  </h2>
                </div>
                <div className="flex justify-between gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="w-3.5" />
                    <span>{dayjs(post.createdAt).format('YYYY-MM-DD HH:mm')}</span>
                  </div>
                  {/* <div className="flex items-center gap-1">
                    <Clock3 className="w-3.5" />
                    <span>{post.readingTime}분</span>
                  </div> */}
                </div>
              </div>
            </li>
          </a>
        ))}
      </ul>
    </section>
  );
}
