



import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import MDEditor from '@uiw/react-md-editor';
import { Note } from '../types';

import Split from 'react-split';


import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Table,
  Eye,
  Edit3,
  Type,
  Strikethrough,
  Hash
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  contentType: 'plain' | 'markdown';
  onChange: (content: string, contentType: 'plain' | 'markdown') => void;
  placeholder?: string;
  readOnly?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  contentType,
  onChange,
  placeholder = "Start writing your note...",
  readOnly = false,
}) => {
  const [editorMode, setEditorMode] = useState<'plain' | 'markdown'>(contentType);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Initialize with safe defaults
  marked.setOptions({
    breaks: true,
    gfm: true
  });

  const applyFormat = (tagName: string, placeholder: string) => {
    const editor = document.querySelector('.markdown-preview');
    if (!editor) return;

    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    const element = document.createElement(tagName);
    element.textContent = range.toString() || placeholder;

    range.deleteContents();
    range.insertNode(element);
    onChange(editor.innerHTML, 'markdown');
    editor.focus();
  };

  const insertAtCursor = (text: string, selectStart = 0, selectEnd = 0) => {
    const editor = document.querySelector('.markdown-preview');
    if (!editor) return;

    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    const cursorPos = range.startOffset;
    const node = range.startContainer;

    if (node.nodeType === Node.TEXT_NODE) {
      const textContent = node.textContent || '';
      node.textContent = textContent.slice(0, cursorPos) + text + textContent.slice(cursorPos);

      // Set new cursor position
      const newRange = new Range();
      newRange.setStart(node, cursorPos + selectStart);
      newRange.setEnd(node, cursorPos + (selectEnd || text.length));
      selection.removeAllRanges();
      selection.addRange(newRange);
    }

    onChange(editor.innerHTML, 'markdown');
    editor.focus();
  };



  useEffect(() => {
    setEditorMode(contentType);
  }, [contentType]);

  useEffect(() => {
    const textarea = document.querySelector('.w-md-editor-text textarea') as HTMLTextAreaElement | null;
    if (textarea) {
      textareaRef.current = textarea;
    }
  }, [isPreviewMode, editorMode]);


  const handleContentChange = (value: string = '') => {
    onChange(value, editorMode);
  };

  const handleModeChange = (mode: 'plain' | 'markdown') => {
    setEditorMode(mode);
    onChange(content, mode);
  };
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);


  const insertMarkdown = (
    syntax: string,
    placeholder: string = '',
    wrapText: boolean = true
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      const newContent = content + syntax.replace('{}', placeholder);
      handleContentChange(newContent);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || placeholder;

    let newContent = '';
    let newCursorPos = start;

    // For inline markdown like **bold**
    if (wrapText && !syntax.includes('{}')) {
      const before = content.substring(0, start);
      const after = content.substring(end);

      const wrapLength = syntax.length;

      const isAlreadyWrapped =
        content.substring(start - wrapLength, start) === syntax &&
        content.substring(end, end + wrapLength) === syntax;

      if (isAlreadyWrapped) {
        // Remove wrapping
        newContent =
          before.slice(0, -wrapLength) + selectedText + after.slice(wrapLength);
        newCursorPos = start - wrapLength;
      } else {
        // Apply wrapping
        newContent = before + syntax + selectedText + syntax + after;
        newCursorPos = start + syntax.length + selectedText.length;
      }
    }
    // For links/images like [{}](url)
    else if (syntax.includes('{}')) {
      newContent =
        content.substring(0, start) +
        syntax.replace('{}', selectedText) +
        content.substring(end);
      newCursorPos =
        start + syntax.indexOf('{}') + selectedText.length;
    }
    // For prefixes like #, -, 1., >
    else {
      const lineStart = content.lastIndexOf('\n', start - 1) + 1;
      const lineEnd = content.indexOf('\n', lineStart);
      const currentLine =
        content.substring(lineStart, lineEnd === -1 ? content.length : lineEnd);

      const isAlreadyPrefixed = currentLine.trimStart().startsWith(syntax.trim());

      if (isAlreadyPrefixed) {
        // Remove the prefix
        const prefixIndex = currentLine.indexOf(syntax.trim());
        const before = content.substring(0, lineStart + prefixIndex);
        const after = content.substring(lineStart + prefixIndex + syntax.length);
        newContent = before + after;
        newCursorPos = start - syntax.length;
      } else {
        // Add the prefix
        newContent =
          content.substring(0, lineStart) + syntax + content.substring(lineStart);
        newCursorPos = start + syntax.length;
      }
    }

    handleContentChange(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };


  //   const insertTable = () => {
  //     const tableMarkdown = `
  // | Column 1 | Column 2 | Column 3 |
  // |----------|----------|----------|
  // | Cell 1   | Cell 2   | Cell 3   |
  // | Cell 4   | Cell 5   | Cell 6   |
  // `;
  //     const textarea = textareaRef.current;
  //     if (textarea) {
  //       const start = textarea.selectionStart;
  //       const before = content.slice(0, start);
  //       const after = content.slice(start);
  //       const newContent = `${before}\n${tableMarkdown.trim()}\n${after}`;
  //       handleContentChange(newContent);
  //       setTimeout(() => {
  //         textarea.focus();
  //         textarea.setSelectionRange(
  //           start + tableMarkdown.length + 2,
  //           start + tableMarkdown.length + 2
  //         );
  //       }, 10);
  //     }
  //   }

  //   const insertTable = () => {
  //     const tableMarkdown = `
  // | Column 1 | Column 2 | Column 3 |
  // |----------|----------|----------|
  // | Cell 1   | Cell 2   | Cell 3   |
  // | Cell 4   | Cell 5   | Cell 6   |
  // `;
  //     insertMarkdown(tableMarkdown.trim(), '', false);
  //   };


  const generateMarkdownTable = (rows = 2, columns = 3): string => {
    const header = Array.from({ length: columns }, (_, i) => `Column ${i + 1}`).join(' | ');
    const separator = Array(columns).fill('----------').join(' | ');
    const body = Array.from({ length: rows }, (_, rowIndex) =>
      Array.from({ length: columns }, (_, colIndex) => `Cell ${rowIndex * columns + colIndex + 1}`).join(' | ')
    ).join('\n');

    return `| ${header} |\n| ${separator} |\n${body}`;
  };

  const insertTable = () => {
    const tableMarkdown = generateMarkdownTable(); // Default 2 rows, 3 columns
    const textarea = textareaRef.current;

    if (textarea) {
      const start = textarea.selectionStart;
      const before = content.slice(0, start);
      const after = content.slice(start);
      const newContent = `${before}\n${tableMarkdown.trim()}\n${after}`;

      handleContentChange(newContent);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + tableMarkdown.length + 2,
          start + tableMarkdown.length + 2
        );
      }, 10);
    }
  };


  const insertCodeBlock = () => {
    const codeBlockMarkdown = '```\n' + 'Your code here' + '\n```';
    insertMarkdown(codeBlockMarkdown, '', false);
  };

  if (editorMode === 'plain') {
    return (
      <div className="space-y-4">
        {/* Editor Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleModeChange('plain')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${editorMode === 'plain'
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
              <Type className="w-4 h-4 mr-1 inline" />
              Plain Text
            </button>
            <button
              onClick={() => handleModeChange('markdown')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${editorMode === 'markdown'
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
              <Hash className="w-4 h-4 mr-1 inline" />
              Markdown
            </button>
          </div>
        </div>

        {/* Plain Text Editor */}
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className="w-full h-96 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none resize-none leading-relaxed border border-gray-200 dark:border-gray-700 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Editor Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleModeChange('plain')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${editorMode === 'plain'
              ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            <Type className="w-4 h-4 mr-1 inline" />
            Plain Text
          </button>
          <button
            onClick={() => handleModeChange('markdown')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${editorMode === 'markdown'
              ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            <Hash className="w-4 h-4 mr-1 inline" />
            Markdown
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${isPreviewMode
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            <Eye className="w-4 h-4 mr-1 inline" />
            {isPreviewMode ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

        {/* Markdown Toolbar */}
      {!readOnly && !isPreviewMode && (
        <div className="flex flex-wrap items-center gap-1 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          {/* Text Formatting */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => insertMarkdown('**', 'bold text')}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors duration-200"
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertMarkdown('*', 'italic text')}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors duration-200"
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertMarkdown('~~', 'strikethrough text')}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors duration-200"
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Headings */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => insertMarkdown('# ', 'Heading 1', false)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors duration-200"
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertMarkdown('## ', 'Heading 2', false)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors duration-200"
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertMarkdown('### ', 'Heading 3', false)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors duration-200"
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </button>
          </div>

        

          {/* Lists */}
          {/* <div className="flex items-center space-x-1">
            <button
              onClick={() => insertMarkdown('- ', 'List item', false)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors duration-200"
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertMarkdown('1. ', 'List item', false)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors duration-200"
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div> */}

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Links and Media */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => insertMarkdown('[{}](https://example.com)', 'link text')}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors duration-200"
              title="Link"
            >
              <Link className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertMarkdown('![{}](https://example.com/image.jpg)', 'alt text')}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors duration-200"
              title="Image"
            >
              <Image className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Code and Quote */}
          {/* <div className="flex items-center space-x-1">
            <button
              onClick={() => insertMarkdown('`', 'inline code')}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors duration-200"
              title="Inline Code"
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              onClick={insertCodeBlock}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors duration-200"
              title="Code Block"
            >
              <div className="w-4 h-4 border border-current rounded text-xs flex items-center justify-center">
                { }
              </div>
            </button>
            <button
              onClick={() => insertMarkdown('> ', 'Quote text', false)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors duration-200"
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </button>
          </div> */}

         

          {/* Table */}
          {/* <button
            onClick={insertTable}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors duration-200"
            title="Table"
          >
            <Table className="w-4 h-4" />
          </button> */}
        </div>
      )}


      {/* Markdown Editor */}
      {/* <div className="markdown-editor border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <MDEditor
          value={content}
          onChange={handleContentChange}
          preview={isPreviewMode ? 'preview' : 'edit'}

          hideToolbar
          visibleDragBar={false}
          textareaProps={{
            placeholder,
            style: {
              fontSize: 14,
              lineHeight: 1.6,
              fontFamily: 'inherit',
              padding: '16px',
              border: 'none',
              outline: 'none',
              resize: 'none',
            },
            readOnly,
          }}
          height={400}
          data-color-mode="auto"
        />
      </div> */}

      <Split
        className="flex h-[500px] border rounded-lg"
        gutterSize={8}
        minSize={[300, 300]}
      >
        {/* Markdown Source (Left) */}
        <div className="h-full overflow-auto p-4">
          <MDEditor
            value={content}
            onChange={(value = "") => onChange(value, 'markdown')}
            preview="edit" // Force edit mode
            hideToolbar
            height="100%"
            style={{
              backgroundColor: '#f8fafc', // Light slate-50
              borderColor: '#e2e8f0', // slate-200
              color: '#1e293b' // slate-800 (text)
            }}
          />
        </div>

        {/* Preview (Right) */}
        <div className="h-full overflow-auto p-4 text-gray-800 prose dark:prose-invert bg-gray-50 dark:bg-gray-800">
          <MDEditor.Markdown
            source={content}
            style={{
              background: 'transparent',
              padding: 0,
              color: 'black'
            }}
          />
        </div>
      </Split>
      {/* <div
        contentEditable={!readOnly}
        dir="ltr"
        style={{
          direction: 'ltr', // CSS fallback
          unicodeBidi: 'isolate', // Blocks parent RTL influence
          textAlign: 'left' // Force alignment
        }}
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: marked(content) }}  // 👈 Converts markdown to HTML
        onInput={(e) => {
          // For now, just pass the raw HTML (you'll need turndown later)
          onChange(e.currentTarget.innerHTML, 'markdown');
        }}
        className="markdown-preview border rounded-lg p-4 min-h-[200px] prose dark:prose-invert"
      /> */}


      {/* Markdown Help */}
      {!isPreviewMode && (
        <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div><strong>**bold**</strong> → <strong>bold</strong></div>
            <div><em>*italic*</em> → <em>italic</em></div>
            <div><code>`code`</code> → <code>code</code></div>
            <div>[link](url) → <a href="#" className="text-blue-600">link</a></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;


// import React, { useState } from 'react';
// import { EditorContent, useEditor } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Link from '@tiptap/extension-link';
// import Table from '@tiptap/extension-table';
// import TableRow from '@tiptap/extension-table-row';
// import TableCell from '@tiptap/extension-table-cell';
// import TableHeader from '@tiptap/extension-table-header';
// import {unified} from 'unified';
// import remark from 'remark-parse';
// import remarkHtml from 'remark-html';

// import {
//   Bold, Italic, Strikethrough, Heading1, Heading2, Heading3,
//   List, ListOrdered, Link as LinkIcon, Code, Quote, Table as TableIcon,
//   Eye, Type, Hash
// } from 'lucide-react';

// const RichTextEditor = () => {
//   const [mode, setMode] = useState<'wysiwyg' | 'markdown'>('wysiwyg');
//   const [markdownContent, setMarkdownContent] = useState('');

//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Link.configure({ openOnClick: false }),
//       Table.configure({ resizable: true }),
//       TableRow,
//       TableHeader,
//       TableCell,
//     ],
//     content: '<p>Start editing...</p>',
//   });

//   const insertTable = () => {
//     if (!editor) return;
//     editor.commands.insertTable({ rows: 3, cols: 3, withHeaderRow: true });
//   };

//   const exportToMarkdown = async () => {
//     const html = editor?.getHTML();
//     const result = await unified().use(remark).use(remarkHtml).process(html || '');
//     return result.toString();
//   };

//   const importMarkdown = async () => {
//     // simple Markdown to HTML example
//     const html = await unified()
//       .use(remark)
//       .use(remarkHtml)
//       .process(markdownContent);
//     editor?.commands.setContent(html.toString());
//   };

//   const toggleMode = () => {
//     if (mode === 'wysiwyg') {
//       exportToMarkdown().then((md) => {
//         setMarkdownContent(md);
//         setMode('markdown');
//       });
//     } else {
//       importMarkdown();
//       setMode('wysiwyg');
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {/* Toggle */}
//       <div className="flex justify-between items-center">
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={() => setMode('wysiwyg')}
//             className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${mode === 'wysiwyg'
//               ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
//               : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
//               }`}
//           >
//             <Type className="w-4 h-4 mr-1 inline" />
//             WYSIWYG
//           </button>
//           <button
//             onClick={toggleMode}
//             className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${mode === 'markdown'
//               ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
//               : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
//               }`}
//           >
//             <Hash className="w-4 h-4 mr-1 inline" />
//             Markdown
//           </button>
//         </div>
//       </div>

//       {/* Toolbar */}
//       {mode === 'wysiwyg' && editor && (
//         <div className="flex flex-wrap items-center gap-1 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
//           <button onClick={() => editor.chain().focus().toggleBold().run()} title="Bold" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
//             <Bold className="w-4 h-4" />
//           </button>
//           <button onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
//             <Italic className="w-4 h-4" />
//           </button>
//           <button onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
//             <Strikethrough className="w-4 h-4" />
//           </button>
//           <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="H1" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
//             <Heading1 className="w-4 h-4" />
//           </button>
//           <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="H2" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
//             <Heading2 className="w-4 h-4" />
//           </button>
//           <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="H3" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
//             <Heading3 className="w-4 h-4" />
//           </button>
//           <button onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet List" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
//             <List className="w-4 h-4" />
//           </button>
//           <button onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered List" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
//             <ListOrdered className="w-4 h-4" />
//           </button>
//           <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Code" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
//             <Code className="w-4 h-4" />
//           </button>
//           <button onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Quote" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
//             <Quote className="w-4 h-4" />
//           </button>
//           <button onClick={insertTable} title="Table" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
//             <TableIcon className="w-4 h-4" />
//           </button>
//           <button
//             onClick={() => {
//               const url = prompt('Enter URL');
//               if (url) {
//                 editor.chain().focus().setLink({ href: url }).run();
//               }
//             }}
//             title="Insert Link"
//             className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
//           >
//             <LinkIcon className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       {/* Editor */}
//       {mode === 'wysiwyg' ? (
//         <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900 text-black dark:text-white">
//           <EditorContent editor={editor} />
//         </div>
//       ) : (
//         <textarea
//           className="w-full h-96 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-black dark:text-white"
//           value={markdownContent}
//           onChange={(e) => setMarkdownContent(e.target.value)}
//         />
//       )}
//     </div>
//   );
// };

// export default RichTextEditor;
