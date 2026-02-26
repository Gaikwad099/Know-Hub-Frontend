import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';

const ToolbarButton = ({ onClick, active, title, children }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    style={{
      width: 32,
      height: 32,
      border: 'none',
      borderRadius: 4,
      background: active ? 'var(--accent)' : 'transparent',
      color: active ? 'white' : 'var(--ink-light)',
      cursor: 'pointer',
      fontSize: 14,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: active ? 700 : 400,
      transition: 'all 0.15s',
    }}
    onMouseEnter={e => {
      if (!active) e.currentTarget.style.background = 'var(--paper-dark)';
    }}
    onMouseLeave={e => {
      if (!active) e.currentTarget.style.background = 'transparent';
    }}
  >
    {children}
  </button>
);

const Divider = () => (
  <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 4px' }} />
);

const RichEditor = ({ content, onChange, placeholder = 'Start writing your article...' }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: { HTMLAttributes: { class: 'code-block' } },
      }),
      Underline,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  return (
    <div style={{
      border: '1.5px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      background: 'white',
      transition: 'border-color 0.2s',
    }}
      onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
      onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        padding: '8px 12px',
        background: 'var(--paper-warm)',
        borderBottom: '1px solid var(--border)',
        alignItems: 'center',
      }}>
        {/* Text style */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
        ><strong>B</strong></ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
        ><em>I</em></ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Underline"
        ><u>U</u></ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="Strikethrough"
        ><s>S</s></ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          active={editor.isActive('highlight')}
          title="Highlight"
        >🖌</ToolbarButton>

        <Divider />

        {/* Headings */}
        {[1, 2, 3].map(level => (
          <ToolbarButton
            key={level}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
            active={editor.isActive('heading', { level })}
            title={`Heading ${level}`}
          >H{level}</ToolbarButton>
        ))}

        <Divider />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet List"
        >•≡</ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Numbered List"
        >1≡</ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Blockquote"
        >❝</ToolbarButton>

        <Divider />

        {/* Code */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
          title="Inline Code"
        >{`<>`}</ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          title="Code Block"
        >[ ]</ToolbarButton>

        <Divider />

        {/* Link */}
        <ToolbarButton
          onClick={setLink}
          active={editor.isActive('link')}
          title="Add Link"
        >🔗</ToolbarButton>

        {/* Divider line */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >—</ToolbarButton>

        <Divider />

        {/* Undo/Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >↩</ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >↪</ToolbarButton>
      </div>

      {/* Editor area */}
      <div style={{ padding: '16px 20px', minHeight: 320 }}>
        <style>{`
          .ProseMirror {
            outline: none;
            font-family: var(--font-body);
            font-size: 16px;
            line-height: 1.7;
            color: var(--ink);
            min-height: 280px;
          }
          .ProseMirror p.is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            color: var(--ink-muted);
            pointer-events: none;
            height: 0;
          }
          .ProseMirror h1 { font-size: 28px; margin: 1em 0 0.4em; font-family: var(--font-display); }
          .ProseMirror h2 { font-size: 22px; margin: 1em 0 0.4em; font-family: var(--font-display); }
          .ProseMirror h3 { font-size: 18px; margin: 0.8em 0 0.3em; font-family: var(--font-display); }
          .ProseMirror p { margin-bottom: 0.8em; }
          .ProseMirror ul, .ProseMirror ol { padding-left: 24px; margin-bottom: 0.8em; }
          .ProseMirror li { margin-bottom: 0.3em; }
          .ProseMirror blockquote {
            border-left: 4px solid var(--accent);
            padding-left: 16px;
            margin: 1em 0;
            color: var(--ink-muted);
            font-style: italic;
          }
          .ProseMirror code {
            background: var(--paper-dark);
            padding: 2px 5px;
            border-radius: 3px;
            font-family: var(--font-mono);
            font-size: 0.9em;
          }
          .ProseMirror pre {
            background: #1e1e2e;
            color: #cdd6f4;
            padding: 16px;
            border-radius: 6px;
            overflow-x: auto;
            margin: 1em 0;
          }
          .ProseMirror pre code { background: none; color: inherit; padding: 0; }
          .ProseMirror hr { border: none; border-top: 1px solid var(--border); margin: 1.5em 0; }
          .ProseMirror mark { background: #fef08a; padding: 1px 3px; border-radius: 2px; }
          .ProseMirror a { color: var(--blue); text-decoration: underline; }
        `}</style>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichEditor;
