"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const MenuBar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    const btnClass = "px-3 py-1.5 text-sm font-bold rounded-lg transition-colors border";
    const activeClass = "bg-indigo-600 text-white border-indigo-600";
    const inactiveClass = "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700";

    return null;
};

export default function RichTextEditor({ content, onChange }) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none dark:prose-invert max-w-none min-h-[300px] px-4 py-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl",
            },
        },
    });

    return (
        <div className="w-full">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
