"use client";

import { useEffect, useState } from "react";
import { ArrowUpToLine, MessageSquareText, Copy } from "lucide-react";

interface TableOfContentsProps {
  content: string;
}

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // 페이지 내의 모든 제목 요소를 찾아서 목차 생성
    const elements = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const items: HeadingItem[] = Array.from(elements).map((element) => ({
      id: element.id,
      text: element.textContent || "",
      level: parseInt(element.tagName[1]),
    }));
    setHeadings(items);

    // 스크롤 이벤트에 따라 현재 섹션 하이라이트
    const handleScroll = () => {
      const headingElements = Array.from(elements);
      const headingPositions = headingElements.map((element) => ({
        id: element.id,
        position: element.getBoundingClientRect().top,
      }));

      const currentHeading = headingPositions.find(
        (heading) => heading.position > 0
      );
      if (currentHeading) {
        setActiveId(currentHeading.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [content]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="sticky bottom-0 top-[200px] z-10 ml-[5rem] mt-[200px] w-[200px]">
      <div className="mb-4 border-l px-4 py-2">
        <div className="mb-1 font-bold">On this page</div>
        <ul className="text-xs">
          {headings.map((heading, index) => (
            <li
              key={`heading-${index}-${heading.text}`}
              className={`ml-4 py-1 transition ${
                activeId === heading.id ? "font-medium text-pink-600" : ""
              }`}
            >
              <a href={`#${heading.id}`}>{heading.text}</a>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex gap-2">
        <button
          onClick={scrollToTop}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium 
            ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 
            focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 
            outline outline-input outline-1 bg-background hover:bg-accent hover:text-accent-foreground aspect-square p-2"
        >
          <ArrowUpToLine className="h-4 w-4" />
        </button>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium 
            ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 
            focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 
            outline outline-input outline-1 bg-background hover:bg-accent hover:text-accent-foreground aspect-square p-2"
        >
          <MessageSquareText className="h-4 w-4" />
        </button>
        <button
          onClick={copyLink}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium 
            ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 
            focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 
            outline outline-input outline-1 bg-background hover:bg-accent hover:text-accent-foreground aspect-square p-2"
        >
          <span className="sr-only">Copy</span>
          <Copy className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
