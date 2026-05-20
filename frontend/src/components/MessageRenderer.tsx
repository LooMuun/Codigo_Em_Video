import ReactMarkdown from "react-markdown";

interface Props {
  content: string;
}

const MessageRenderer = ({
  content,
}: Props) => {
  return (
    <ReactMarkdown>
      {content}
    </ReactMarkdown>
  );
};

export default MessageRenderer;