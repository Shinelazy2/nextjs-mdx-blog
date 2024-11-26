'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { usePathname, useRouter } from 'next/navigation';
import PostList from "@/app/components/PostList";
import TagSection from "@/app/components/TagSection";
import { getTags, type Tag } from "@/app/lib/posts";
interface Props {
  params: {
    tag: string;
  };
}

export default function MdxTagPage({ params }: Props) {
  const { tag } = params;
  const decodedTag = decodeURIComponent(tag);
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (!decodedTag) {
          router.push('/mdx/All');
          return;
        }

        console.log('데이터 새로 가져오기:', decodedTag);
        const response = await axios.get(`http://localhost:3000/mdx/tag/${decodedTag}`);
        const tags = await getTags();
        
        setPosts(response.data || []);
        setTags(tags || []);
      } catch (error) {
        console.error('데이터 fetch 중 오류:', error);
        setPosts([]);
        setTags([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [decodedTag, pathname, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <div className="w-full max-w-[950px]">
        <TagSection selectedTag={decodedTag} tags={tags} />
        <PostList posts={posts} selectedTag={decodedTag} />
      </div>
    </main>
  );
}
