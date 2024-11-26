import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { defaultSchema } from "rehype-sanitize";

interface MDXPreviewProps {
  content: string;
}

// rehypeSanitize 설정
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    div: [
      ...(defaultSchema.attributes?.div || []),
      "style",
      "className",
      "class",
    ],
    span: [
      ...(defaultSchema.attributes?.span || []),
      "style",
      "className",
      "class",
    ],
  },
};

export default function MDXPreview({ content }: MDXPreviewProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        [rehypeRaw, { passThrough: ["div"] }],
        [rehypeSanitize, sanitizeSchema],
      ]}
      components={{
        div: ({ style, className, children }) => (
          <div style={style} className={className}>
            {children}
          </div>
        ),
        p: ({ children }) => <p className="my-0">{children}</p>,
        li: ({ className, children, ...props }) => {
          if (className === "task-list-item") {
            return (
              <li className="flex items-center gap-2 my-2 list-none" {...props}>
                {children}
              </li>
            );
          }
          return <li {...props}>{children}</li>;
        },
        input: ({ type, checked }) => {
          if (type === "checkbox") {
            return (
              <span className="relative inline-block w-5 h-5">
                <input
                  type="checkbox"
                  checked={checked}
                  readOnly
                  className="peer absolute opacity-0 w-5 h-5 cursor-pointer"
                />
                <span className="absolute top-0 left-0 w-5 h-5 border-2 border-gray-400 rounded peer-checked:border-blue-500">
                  {checked && (
                    <svg
                      className="w-4 h-4 text-blue-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
              </span>
            );
          }
          return <input type={type} checked={checked} readOnly />;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
