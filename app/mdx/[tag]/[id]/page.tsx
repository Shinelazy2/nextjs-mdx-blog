
'use client';

import MDXPreview from "@/app/components/MDXPreview";
import { TableOfContents } from "@/app/components/TableOfContents";
import { getMdxById } from "@/app/lib/posts";
import { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  params: {
    tag: string;
    id: string;
  };
}




interface Props {
  params: {
    tag: string;
    id: string;
  };
}

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  mdxTags?: Array<{ id: number; tagName: string }>;
}

export default function MdxDetailPage({ params }: Props) {
  const { tag, id } = params;
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/mdx/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error('게시물 fetch 중 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>게시물을 찾을 수 없습니다.</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <div className="flex w-full max-w-[1200px] gap-8 m-9">
        <div className="flex-1">
          <article className="prose dark:prose-invert lg:prose-xl">
            <div className="flex gap-2 text-sm text-gray-500">
              <time>
                {new Date(post.createdAt).toLocaleDateString("ko-KR")}
              </time>
            </div>
            <h1>{post.title}</h1>

            {/* {post.mdxTags?.map(tag => (
                <span key={tag.id} className="text-pink-600">
                  {tag.tagName}
                </span>
              ))} */}
            <div className="mdx-editor-container">
              <MDXPreview content={post.content} />
            </div>
          </article>
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-20">
            <TableOfContents content={post.content} />
          </div>
        </div>
      </div>
    </main>
  );
}
