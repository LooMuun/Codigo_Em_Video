import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  content: string;
}

const MessageRenderer = ({
  content,
}: Props) => {
  return (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || "");
          const codeString = String(children).trim();
          const [copied, setCopied] = useState(false);

          const handleCopy = async () => {
            await navigator.clipboard.writeText(codeString);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          };

          return !inline && match ? (
            <div className="code-block-container">
              <div className="code-block-header">
                <span className="code-language">{match[1]}</span>
                <button className="btn-copy-code" onClick={handleCopy}>
                  {copied ? "Copiado!" : "Copiar"}
                </button>
              </div>
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {codeString}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MessageRenderer;