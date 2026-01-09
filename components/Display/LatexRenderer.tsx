
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface Props {
  children: string;
  className?: string;
  inline?: boolean;
}

const LatexRenderer: React.FC<Props> = ({ children, className, inline = false }) => {
  if (!children) return null;
  
  let content = children;
  
  // Clean up potential markdown blocks
  content = content.replace(/^```latex\n?/, '').replace(/\n?```$/, '');
  
  const Tag = inline ? 'span' : 'div';
  
  return (
    <Tag className={`${className || ''} ${!inline ? 'overflow-x-auto' : 'inline-block'}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => <span className="inline">{children}</span>,
          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </Tag>
  );
};

export default LatexRenderer;
