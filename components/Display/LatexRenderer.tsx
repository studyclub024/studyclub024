
import React, { useEffect, useRef } from 'react';

interface Props {
  children: string;
  className?: string;
  inline?: boolean;
}

const LatexRenderer: React.FC<Props> = ({ children, className, inline = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !children) return;
    
    let content = children;
    
    // Clean up potential markdown blocks if the model wrapped them unnecessarily
    content = content.replace(/^```latex\n?/, '').replace(/\n?```$/, '');
    
    // Smart Math Guard: Detect mathematical symbols and structures typical of WolframAlpha/Symbolic engines
    // Improved regex to catch integrals, sums, limits, Greek letters, and complex algebraic structures
    const mathPattern = /([a-zA-Z0-9]+[\^][0-9]+)|([a-zA-Z]\s*=\s*[a-zA-Z0-9\s\-+*/^()]+)|(\\[a-zA-Z]+)|([=+\-*/]{2,})|([0-9]+\/[0-9]+)|([\(\[].*[\)\]])/;
    const hasDelimiters = content.includes('$') || content.includes('\\(') || content.includes('\\[');
    
    if (mathPattern.test(content) && !hasDelimiters) {
      // If it looks like math but isn't delimited, wrap it for KaTeX
      content = inline ? `$${content}$` : `$$${content}$$`;
    }

    containerRef.current.textContent = content;

    const win = window as any;
    const renderMath = () => {
      if (win.katex && win.renderMathInElement) {
        try {
          win.renderMathInElement(containerRef.current, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false },
              { left: '\\(', right: '\\)', display: false },
              { left: '\\[', right: '\\]', display: true }
            ],
            throwOnError: false,
            errorColor: '#ef4444',
            strict: false,
            trust: true,
            macros: {
              "\\degree": "^{\\circ}",
              "\\R": "\\mathbb{R}",
              "\\N": "\\mathbb{N}"
            }
          });
        } catch (e) {
          console.warn("KaTeX Rendering Error:", e);
        }
      }
    };

    renderMath();
    
    // Fallback/Retry for dynamic loading or slow script execution
    const timer = setTimeout(renderMath, 250);
    return () => clearTimeout(timer);
  }, [children, inline]);

  const Tag = inline ? 'span' : 'div';
  return (
    <Tag 
      ref={containerRef} 
      className={`${className} ${!inline ? 'overflow-x-auto min-h-[1.5em] py-1' : 'inline-block'}`} 
    />
  );
};

export default LatexRenderer;
