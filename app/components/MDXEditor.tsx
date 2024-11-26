"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import MDXPreview from "./MDXPreview";
import { useRouter, useSearchParams } from "next/navigation";
import { useParams } from 'next/navigation';  // useParams import 추가
import { useToast } from "@/hooks/use-toast"

interface MDXEditorProps {
  mode: 'create' | 'edit';
  postId?: number;
}

interface CommandMenuItem {
  label: string;
  value: string;
  description: string;
  aliases: string[];
}

// type CustomLinkProps = {
//   href?: string;
//   children: React.ReactNode;
// } & React.HTMLAttributes<HTMLAnchorElement>;

// MDX 문서 타입 정의 추가
interface MDXDocument {
  id: number;
  title: string;
  content: string;
  tag: string;
}

// 태그 표시를 위한 컴포넌트 추가
const TagDisplay = ({ tag }: { tag: string }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
    {tag}
  </span>
);

export default function MDXEditor({ mode, postId }: MDXEditorProps) {
  const params = useParams();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [showCommands, setShowCommands] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const [mdxList, setMdxList] = useState<MDXDocument[]>([]);
  const [searchTag, setSearchTag] = useState("");
  const [searchResults, setSearchResults] = useState<MDXDocument[]>([]);
  const [commandFilter, setCommandFilter] = useState("");
  const [description, setDescription] = useState("");
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);
  const router = useRouter();
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [showTagList, setShowTagList] = useState(false);
  const [selectedTagIndex, setSelectedTagIndex] = useState(0);
  const [serverTags, setServerTags] = useState<string[]>([]);
  const { toast } = useToast();

  const commands: CommandMenuItem[] = [
    {
      label: "제목 1",
      value: "# ",
      description: "큰 제목",
      aliases: ["h1", "제목1", "title1", "heading1"],
    },
    {
      label: "제목 2",
      value: "## ",
      description: "중간 제목",
      aliases: ["h2", "제목2", "title2", "heading2"],
    },
    {
      label: "제목 3",
      value: "### ",
      description: "작은 제목",
      aliases: ["h3", "제목3", "title3", "heading3"],
    },
    {
      label: "굵게",
      value: "**텍스트**",
      description: "텍스트를 굵게 표시",
      aliases: ["bold", "굵게", "strong", "b", "볼드"],
    },
    {
      label: "기울임",
      value: "*텍스트*",
      description: "텍스트를 기울임꼴로 표시",
      aliases: ["italic", "기울임", "이탤릭", "i"],
    },
    {
      label: "취소선",
      value: "~~텍스트~~",
      description: "취소선 표시",
      aliases: ["strike", "취소", "del", "delete", "strikethrough"],
    },
    {
      label: "인용",
      value: "> ",
      description: "인용문 작성",
      aliases: ["quote", "인용", "q", "blockquote"],
    },
    {
      label: "순서없는 목록",
      value: "- ",
      description: "순서가 없는 목록",
      aliases: ["ul", "list", "목록", "불릿"],
    },
    {
      label: "순서있는 목록",
      value: "1. ",
      description: "순서가 있는 목록",
      aliases: ["ol", "ordered", "숫자목록"],
    },
    {
      label: "체크박스",
      value: "- [ ] ",
      description: "체크박스 목록",
      aliases: ["checkbox", "체크", "task", "todo"],
    },
    {
      label: "완료된 체크박스",
      value: "- [x] ",
      description: "완료된 체크박스",
      aliases: ["checked", "done", "완료"],
    },
    {
      label: "코드",
      value: "```\n코드를 여기에 작성하세요\n```",
      description: "코드 블록 작성",
      aliases: ["code", "코드", "블록", "block", "codeblock"],
    },
    {
      label: "인라인 코드",
      value: "`코드`",
      description: "인라인 코드 작성",
      aliases: ["inline", "인라인", "코드한줄"],
    },
    {
      label: "링크",
      value: "[텍스트](url)",
      description: "링크 삽입",
      aliases: ["link", "링크", "url", "href", "a"],
    },
    {
      label: "이미지",
      value: "![대체텍스트](이미지url)",
      description: "이미지 삽입",
      aliases: ["image", "이미지", "img", "사진", "picture"],
    },
    {
      label: "표",
      value: "| 제목1 | 제목2 |\n|--------|--------|\n| 내용1 | 내용2 |",
      description: "표 삽입",
      aliases: ["table", "표", "테이블"],
    },
    {
      label: "수평선",
      value: "\n---\n",
      description: "수평선 입",
      aliases: ["hr", "horizontal", "구분선", "line"],
    },
    {
      label: "줄바꿈",
      value: "  \n",
      description: "줄바꿈 (문장 끝에 공백 2개)",
      aliases: ["br", "break", "줄바꿈", "newline"],
    },
    {
      label: "각주",
      value: "[^1]\n\n[^1]: 각주 내용",
      description: "각주 삽입",
      aliases: ["footnote", "각주", "note"],
    },
    {
      label: "강조",
      value: "==강조==",
      description: "텍스트 강조 표시",
      aliases: ["highlight", "강조", "mark"],
    },
    {
      label: "아래첨자",
      value: "~아래첨자~",
      description: "아래첨자",
      aliases: ["sub", "아래첨자", "subscript"],
    },
    {
      label: "위첨자",
      value: "^위첨자^",
      description: "위첨자",
      aliases: ["sup", "위첨자", "superscript"],
    },
    {
      label: "가운데 정렬",
      value:
        '\n<div style="text-align: center; width: 100%;">\n\n텍스트\n\n</div>\n',
      description: "텍스트를 가운데로 정렬",
      aliases: ["center", "가운데", "중앙", "중앙정렬"],
    },
    {
      label: "왼쪽 정렬",
      value:
        '\n<div style="text-align: left; width: 100%;">\n\n텍스트\n\n</div>\n',
      description: "텍스트를 왼쪽으로 정렬",
      aliases: ["left", "왼쪽", "좌측", "왼쪽정렬"],
    },
    {
      label: "오른쪽 정렬",
      value:
        '\n<div style="text-align: right; width: 100%;">\n\n텍스트\n\n</div>\n',
      description: "텍스트를 오른쪽으로 정렬",
      aliases: ["right", "오른쪽", "우측", "오른쪽정렬"],
    },
  ];

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = newContent.slice(0, cursorPosition);
    const lastSlashIndex = textBeforeCursor.lastIndexOf("/");

    if (lastSlashIndex !== -1) {
      const searchText = textBeforeCursor.slice(lastSlashIndex + 1);
      setCommandFilter(searchText.toLowerCase());

      if (!showCommands) {
        const position = getCaretCoordinates(e.target);
        setShowCommands(true);
        setSelectedCommandIndex(0);
        setCursorPosition(position);
      }
    } else {
      setShowCommands(false);
      setCommandFilter("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showCommands || filteredCommands.length === 0) return;

    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        setSelectedCommandIndex((prev) => {
          const newIndex = prev > 0 ? prev - 1 : filteredCommands.length - 1;
          // 선택된 항목이 보이도록 스크롤
          const commandMenu = document.querySelector(".command-menu");
          const selectedItem = commandMenu?.children[newIndex] as HTMLElement;
          if (selectedItem) {
            selectedItem.scrollIntoView({ block: "nearest" });
          }
          return newIndex;
        });
        break;

      case "ArrowDown":
        e.preventDefault();
        setSelectedCommandIndex((prev) => {
          const newIndex = prev < filteredCommands.length - 1 ? prev + 1 : 0;
          // 선택된 항목이 보이도록 스크롤
          const commandMenu = document.querySelector(".command-menu");
          const selectedItem = commandMenu?.children[newIndex] as HTMLElement;
          if (selectedItem) {
            selectedItem.scrollIntoView({ block: "nearest" });
          }
          return newIndex;
        });
        break;

      case "Enter":
        e.preventDefault();
        insertCommand(filteredCommands[selectedCommandIndex]);
        break;

      case "Escape":
        e.preventDefault();
        setShowCommands(false);
        setCommandFilter("");
        break;

      case "Tab":
        e.preventDefault();
        insertCommand(filteredCommands[selectedCommandIndex]);
        break;
    }
  };

  const insertCommand = (command: CommandMenuItem) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const textBeforeCursor = content.slice(0, start);
    const textAfterCursor = content.slice(textarea.selectionEnd);

    // 마지막 '/' 위치 찾기
    const lastSlashIndex = textBeforeCursor.lastIndexOf("/");

    // '/' 이전의 텍스트 + 명령어 + 커서 이후의 텍스트
    const newContent =
      textBeforeCursor.slice(0, lastSlashIndex) +
      command.value +
      textAfterCursor;

    setContent(newContent);
    setShowCommands(false);
    setCommandFilter("");

    // 서 위치 조정
    const newCursorPosition = lastSlashIndex + command.value.length;
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  // getCaretCoordinates 함수 수정
  const getCaretCoordinates = (element: HTMLTextAreaElement) => {
    const { selectionStart, value } = element;
    const textBeforeCaret = value.slice(0, selectionStart);
    const lines = textBeforeCaret.split("\n");
    const currentLineNumber = lines.length;
    const lineHeight = parseInt(window.getComputedStyle(element).lineHeight);

    // 현재 라인의 텍스트 길이를 기반으로 x 위치 계산
    const currentLine = lines[lines.length - 1];
    const charWidth = 8; // 모노스페이스 폰트 기준 예상 문자 너비

    return {
      top: (currentLineNumber - 1) * lineHeight,
      left: currentLine.length * charWidth + 16, // 16은 textarea의 기본 패딩
    };
  };

  // fetchMdx 함수를 목록 조회용으로 수정
  const fetchMdxList = async () => {
    try {
      const response = await axios.get("http://localhost:3000/mdx");
      setMdxList(response.data);
    } catch (error) {
      console.error("MDX 목록 조회 중 오류 발생:", error);
      alert("MDX 목록 조회 중 오류가 발생했습니다.");
    }
  };

  // fetchMdxById 함수 수정
  const fetchMdxById = async (id: number) => {
    if (typeof id !== 'number' || isNaN(id)) {
      console.error('유효하지 않은 ID로 fetchMdxById 호출:', id);
      return;
    }

    try {
      console.log(`Fetching MDX data for ID: ${id}`);
      const response = await axios.get(`http://localhost:3000/mdx/${id}`);
      if (!response.data) {
        throw new Error('데이터가 없습니다');
      }
      
      console.log("서버 응답 데이터:", response.data);
      
      setCurrentPostId(response.data.id);
      setContent(response.data.content || '');
      setTitle(response.data.title || '');
      setDescription(response.data.description || '');

      // 태그 처리 로직 수정
      if (response.data.tags) {
        const tagArray = Array.isArray(response.data.tags) 
          ? response.data.tags 
          : response.data.tags.split(',').map((tag: string) => tag.trim());
        
        // @ 접두사 처리
        const formattedTags = tagArray.map((tag: string) => 
          tag.startsWith('@') ? tag : `@${tag}`
        );
        
        setTags(formattedTags); // 태그 배열 설정
        setTag(formattedTags.join(', ')); // 문자열 형태로도 설정
      }

    } catch (error) {
      console.error('MDX 조회 중 오류 발생:', error);
      if (axios.isAxiosError(error)) {
        console.error('상세 에러:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "제목을 입력해주세요.",
      });
      return;
    }

    try {
      const postData = {
        title: title,
        tag: tags.join(', '),
        description: description,
        content,
      };
      
      if (mode === 'edit') {
        await axios.put(`http://localhost:3000/mdx/${postId}`, postData);
      } else {
        await axios.post("http://localhost:3000/mdx/save", postData);
      }

      toast({
        title: mode === 'edit' ? "수정 완료" : "저장 완료",
        description: mode === 'edit' ? "게시물이 수정되었습니다." : "게시물이 저장되었습니다.",
      });
      router.push('/manage');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "오류 발생",
        description: "저장 중 오류가 발생했습니다.",
      });
    }
  };

  // 방법 1: ComponentPropsWithoutRef 사용
  // const CustomLink = ({
  //   href,
  //   children,
  //   ...props
  // }: ComponentPropsWithoutRef<"a">) => {
  //   return (
  //     <a
  //       href={href}
  //       target="_blank"
  //       rel="noopener noreferrer"
  //       className="text-blue-500 hover:text-blue-600 underline"
  //       {...props}
  //     >
  //       {children}
  //     </a>
  //   );
  // };

  // 또는 방법 2: 커스텀 타입 사용
  // const CustomLink = ({ href, children, ...props }: CustomLinkProps) => {
  //   return (
  //     <a
  //       href={href}
  //       target="_blank"
  //       rel="noopener noreferrer"
  //       className="text-blue-500 hover:text-blue-600 underline"
  //       {...props}
  //     >
  //       {children}
  //     </a>
  //   );
  // };

  // 컴포넌트 마운트 시 MDX 목록 불러오기
  useEffect(() => {
    fetchMdxList();
  }, []); // 빈 의존성 배열로 최초 마운트 시에만 실행

  // 태그 색 함수 추가
  const searchByTag = async (tagName: string) => {
    if (!tagName.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/mdx/tag/${tagName}`
      );
      console.log("🚀 ~ searchByTag ~ response:", response)
      setSearchResults(response.data);
    } catch (error) {
      console.error("태그 검색 중 오 발생:", error);
      setSearchResults([]);
    }
  };

  // 검색 핸들러 추가
  const handleTagSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchByTag(searchTag);
  };

  // 필터링된 커맨드 목록 계산
  const filteredCommands = commands.filter((command) => {
    const searchText = commandFilter.toLowerCase();
    return (
      command.label.toLowerCase().includes(searchText) ||
      command.description.toLowerCase().includes(searchText) ||
      command.aliases.some((alias) => alias.toLowerCase().includes(searchText))
    );
  });

  useEffect(() => {
    const fetchData = async () => {
      console.log("Mode:", mode);     // mode 확인

      // create 모드일 때는 ID 체크 불필요
      if (mode === 'create') {
        return;
      }

      // edit 모드일 때만 ID 체크 및 데이터 fetch
      if (mode === 'edit') {
        let id: number | null = null;

        // URL 파라미터에서 id 확인
        if (params && typeof params.id === 'string') {
          const parsedId = parseInt(params.id, 10);
          console.log("Parsed ID from params:", parsedId);
          if (!isNaN(parsedId)) {
            id = parsedId;
          }
        }

        // 유효한 ID가 있을 경우에만 데이터 fetch
        if (id !== null && !isNaN(id)) {
          console.log("Fetching data for ID:", id);
          setCurrentPostId(id);
          await fetchMdxById(id);
        } else {
          console.error("유효하지 않은 ID:", { params, mode, postId });
        }
      }
    };

    fetchData().catch(error => {
      console.error("데이터 fetch 중 오류 발생:", error);
    });
  }, [params, mode, postId]);

  // 태그 목록을 가져오는 함수 수정
  const fetchTags = async () => {
    try {
      const response = await axios.get('http://localhost:3000/mdx/tags/all');
      const formattedTags = response.data.map((tag: string) => 
        tag.startsWith('@') ? tag : `@${tag}`
      );
      setServerTags(formattedTags);
    } catch (error) {
      console.error('태그 목록 가져오기 실패:', error);
      // 태그 목록 가져오기 실패해도 전체 기능에 영향 없도록 처리
      setServerTags([]);
    }
  };

  // useEffect 순서 및 의존성 정리
  useEffect(() => {
    // 태그 목록 가져오기
    fetchTags().catch(console.error);
  }, []); // 컴포넌트 마운트 시에만 실행

  // 태그 리스트 필터링 함수 수정
  const getFilteredTagList = () => {
    const input = tagInput.toLowerCase().replace('@', '');
    
    // 현재 입력된 태그들과 서버에서 가져온 태그들을 합치고 중복 제거
    const allTags = Array.from(new Set([...tags, ...serverTags]));
    
    // 입력값으로 필터링
    return allTags.filter(tag => {
      const normalizedTag = tag.toLowerCase().replace('@', '');
      return normalizedTag.includes(input);
    });
  };

  // 키보드 이벤트 핸들러 수정
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const filteredTags = getFilteredTagList();

    // 태그 리스트 탐색
    if (showTagList && filteredTags.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedTagIndex(prev => 
          prev < filteredTags.length - 1 ? prev + 1 : 0
        );
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedTagIndex(prev => 
          prev > 0 ? prev - 1 : filteredTags.length - 1
        );
        return;
      }
      if (e.key === 'Enter' && showTagList) {
        e.preventDefault();
        const selectedTag = filteredTags[selectedTagIndex];
        if (selectedTag) {
          setTagInput('');
          setShowTagList(false);
        }
        return;
      }
    }

    // 기존 태그 입력 로직 유지
    if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      e.preventDefault();
      const newTags = tags.slice(0, -1);
      setTags(newTags);
      setTag(newTags.join(', '));
      return;
    }

    // Tab 키 처리
    if (e.key === 'Tab') {
      if (!tagInput.trim()) {
        return; // 기본 동작 유지
      }
      
      e.preventDefault();
      let newTag = tagInput.trim();
      
      if (!newTag.startsWith('@')) {
        newTag = `@${newTag}`;
      }
      
      if (newTag.length > 1) {
        if (!tags.includes(newTag)) {
          setTags(prev => [...prev, newTag]);
          setTagInput('');
          setTag(tags.join(', '));
        } else {
          alert('이미 존재하는 태그입니다.');
          console.log('이미 존재하는 태그입니다:', newTag);
        }
      }

    }
    
    // Enter 키 처리
    if (e.key === 'Enter') {
      e.preventDefault();
      let newTag = tagInput.trim();
      
      if (newTag.length > 0) {
        if (!newTag.startsWith('@')) {
          newTag = `@${newTag}`;
        }
        
        if (newTag.length > 1) {
          if (!tags.includes(newTag)) {
            setTags(prev => [...prev, newTag]);
            setTagInput('');
            setTag(tags.join(', '));
          } else {
            console.log('이미 존재하는 태그입니다:', newTag);
          }
        }
      }
    }
  };

  // 태그 입력 처리 함수 수정
  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);
    
    // 입력값이 있을 때만 태그 리스트 표시
    if (value.trim()) {
      setShowTagList(true);
      setSelectedTagIndex(0);
    } else {
      setShowTagList(false);
    }
  };

  // 태그 삭제 처리 함수
  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  return (
    <div 
      className="w-full relative space-y-6"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="border-b pb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-3xl font-bold border-none outline-none mb-4 placeholder:text-gray-400"
          placeholder="제목을 입력하세요"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full text-xl border-none outline-none mb-4 placeholder:text-gray-400"
          placeholder="소제목을 입력하세요"
        />
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">태그:</span>
          <div className="flex-1 flex flex-wrap gap-2 items-center border rounded-lg p-2 relative">
            {tags.map((tag, index) => (
              <div key={index} className="flex items-center gap-1">
                <TagDisplay tag={tag} />
                <button
                  onClick={() => removeTag(tag)}
                  className="text-gray-400 hover:text-gray-600 ml-1"
                >
                  ×
                </button>
              </div>
            ))}
            
            <div className="relative flex-1">
              <input
                type="text"
                value={tagInput}
                onChange={handleTagInput}
                onKeyDown={handleTagKeyDown}
                onBlur={() => {
                  // 클릭 이벤트가 처리될 수 있도록 약간의 지연을 줌
                  setTimeout(() => setShowTagList(false), 200);
                }}
                className="w-full outline-none min-w-[100px]"
                placeholder="태그 입력 또는 선택"
              />
              
              {/* 태그 선택 리스트 */}
              {showTagList && getFilteredTagList().length > 0 && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
                  {getFilteredTagList().map((tag, index) => (
                    <div
                      key={tag}
                      className={`px-3 py-2 cursor-pointer ${
                        index === selectedTagIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setTagInput(tag);
                        setShowTagList(false);
                      }}
                    >
                      <TagDisplay tag={tag} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 에디터 영역 */}
      <div className="grid grid-cols-2 gap-6">
        <div className="relative">
          <textarea
            ref={textareaRef}
            className="w-full h-[calc(100vh-250px)] p-4 border rounded font-mono resize-none"
            value={content}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="내용을 작성하세요... ('/'를 입력하여 명령어 메뉴 열기)"
          />
          {showCommands && filteredCommands.length > 0 && (
            <div
              className="absolute bg-white border rounded-lg shadow-lg p-1 z-10 w-48 command-menu"
              style={{
                top: `${cursorPosition.top + 30}px`,
                left: `${cursorPosition.left}px`,
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {filteredCommands.map((command, index) => (
                <div
                  key={command.label}
                  className={`p-1.5 cursor-pointer ${
                    index === selectedCommandIndex
                      ? "bg-gray-100"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => insertCommand(command)}
                >
                  <div className="text-sm font-medium">{command.label}</div>
                  <div className="text-xs text-gray-500">
                    {command.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 미리보기 역 */}
        <article className="prose prose-slate lg:prose-lg w-full p-4 border rounded h-[calc(100vh-250px)] overflow-auto [&>div]:w-full">
          <MDXPreview content={content} />
        </article>
      </div>

      {/* 저장 버튼 */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {mode === 'create' ? '저장' : '수정'}
        </button>
      </div>

      {/* 태그 검색 영역 */}
      <div className="border rounded-lg p-6 bg-gray-50">
        <h3 className="font-bold text-lg mb-4">태그 검색</h3>
        <form onSubmit={handleTagSearch} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTag}
              onChange={(e) => setSearchTag(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg"
              placeholder="태그로 검색..."
              onClick={(e) => {
                e.stopPropagation();  // 클릭 이벤트 전파 중단
                e.preventDefault();    // 기본 동작 방지
              }}
            />
            <button
              type="submit"
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              검색
            </button>
          </div>
        </form>

        {searchResults.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-lg mb-2">검색 결과</h4>
            <ul className="border rounded-lg divide-y bg-white">
              {searchResults.map((mdx) => (
                <li
                  key={mdx.id}
                  className="cursor-pointer hover:bg-gray-50 p-4 transition-colors"
                  onClick={() => fetchMdxById(mdx.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-lg">{mdx.title}</div>
                      {mdx.tag && (
                        <div className="text-sm text-gray-500 mt-1">
                          태그: {mdx.tag}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-400">ID: {mdx.id}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

