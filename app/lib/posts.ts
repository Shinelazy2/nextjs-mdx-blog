export interface Tag {
  tagName: string;
  tagCount: number;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  description: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  tags: string[];
}

// API에서 포스트 데이터 가져오기
export async function getPosts(tagName: string = "ALL"): Promise<Post[]> {
  try {
    const response = await fetch(
      `http://localhost:3000/mdx/tag/${encodeURIComponent(tagName)}`,
      {
        next: {
          revalidate: 3600, // 1시간마다 재검증
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch posts for tag: ${tagName}`);
    }

    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error(`Error fetching posts for tag ${tagName}:`, error);
    return dummyPosts;
  }
}

// 테스트용 더미 데이터
export const dummyPosts: Post[] = [
  {
    id: 1,
    title: "Next.js 플랫폼에 Paypal 결제 연동하기",
    content: "내용...",
    description: "Paypal 결제 시스템 연동 가이드",
    thumbnail: "http://localhost:3000/images/123.png",
    createdAt: "2024-06-29",
    updatedAt: "2024-06-29",
    published: true,
    tags: ["Manual"],
  },
  {
    id: 2,
    title: "React useState 소스코드 분석하기",
    content: "내용...",
    description: "React useState 훅의 동작 원리",
    thumbnail: "http://localhost:3000/images/456.png",
    createdAt: "2024-04-12",
    updatedAt: "2024-04-12",
    published: true,
    tags: ["Deep Dive"],
  },
];

// 태그 통계 데이터 가져오기
export async function getTags(): Promise<Tag[]> {
  try {
    const response = await fetch("http://localhost:3000/mdx/tags/statistics", {
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tag statistics");
    }

    const tags = await response.json();
    // const totalCount = tags.reduce(
    //   (sum: number, tag: Tag) => sum + tag.tagCount,
    //   0
    // );
    return [...tags];
  } catch (error) {
    console.error("Error fetching tag statistics:", error);
    return [];
  }
}

// 임시 함수들
export async function getPostsTemp(): Promise<Post[]> {
  return dummyPosts;
}

export async function getTagsTemp(): Promise<Tag[]> {
  return await getTags();
}

interface MdxPost {
  id: number;
  title: string;
  content: string;
  description: string;
  thumbnail: string;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  tags: string[];
}

export async function getMdxById(
  category: string,
  id: number
): Promise<MdxPost> {
  try {
    const response = await fetch(`http://localhost:3000/mdx/${id}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch MDX post: ${category}/${id}`);
    }

    const post = await response.json();
    return post;
  } catch (error) {
    console.error("Error fetching MDX post:", error);
    throw error; // 에러를 상위로 전파하여 error.tsx에서 처리
  }
}
