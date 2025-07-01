import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface QuillEditorComponentProps {
  content: string;
  onChange: (data: string) => void;
  placeholder?: string;
  height?: string;
}

const QuillEditorComponent: React.FC<QuillEditorComponentProps> = ({
  content,
  onChange,
  placeholder = "Start writing your blog content here...",
  height = "200px",
}) => {
    console.log("comp render")
  // Convert Quill Delta to Inline-Styled HTML
  const convertDeltaToHtml = (delta: any) => {
    let html = "";``
    delta.ops.forEach((op: any) => {
      if (typeof op.insert === "string") {
        let text = op.insert.replace(/\n/g, "<br>"); // Preserve new lines
        let styles = [];

        if (op.attributes) {
          if (op.attributes.bold) styles.push("font-weight: bold;");
          if (op.attributes.italic) styles.push("font-style: italic;");
          if (op.attributes.underline) styles.push("text-decoration: underline;");
          if (op.attributes.strike) styles.push("text-decoration: line-through;");
          if (op.attributes.color) styles.push(`color: ${op.attributes.color};`);
          if (op.attributes.background) styles.push(`background-color: ${op.attributes.background};`);
          if (op.attributes.font) styles.push(`font-family: ${op.attributes.font};`);
          if (op.attributes.size) styles.push(`font-size: ${op.attributes.size};`);
          if (op.attributes.align) styles.push(`text-align: ${op.attributes.align};`);

          text = `<span style="${styles.join(" ")}">${text}</span>`;
        }

        html += text;
      } else if (op.insert.list) {
        // Convert lists into inline-styled div elements
        const listType = op.insert.list === "ordered" ? "ol" : "ul";
        html += `<div style="display: flex; flex-direction: column; padding-left: 20px; list-style-type: ${
          listType === "ul" ? "disc" : "decimal"
        };">${op.insert}</div>`;
      }
    });
    return html;
  };

  // Handle Quill Content Change
  const handleChange = (content: string, delta: any, source: string, editor: any) => {
    const htmlWithInlineStyles = convertDeltaToHtml(editor.getContents()); // Convert to inline styles
    onChange(htmlWithInlineStyles);
  };

  // Custom font sizes
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }], // Heading sizes
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }], // List buttons
      [{ color: [] }, { background: [] }], // Text colors
      ["link"],
      [{ size: ["small", false, "large", "huge"] }], // Custom font sizes
      ["clean"], // Remove formatting
    ],
  };

  return (
    <div className="prose bg-white p-4 rounded-lg mb-4">
      <ReactQuill
        theme="snow"
        value={content ? content : "no content"}
        onChange={handleChange}
        modules={quillModules}
        placeholder={placeholder}
        style={{ height: height || "400px" }}
      />
    </div>
  );
};

export default QuillEditorComponent;
