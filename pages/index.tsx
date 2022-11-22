import { useFieldExtension } from "microcms-field-extension-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { onImagePasted } from "../utils/onImagePasted";
import styles from "../styles/Home.module.css";

const MDEditor = dynamic(import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => <div className={styles.loading}>initializing...</div>,
});

const IndexPage = () => {
  const [markdown, setMarkdown] = useState<string | undefined>();
  const { data, sendMessage } = useFieldExtension("", {
    origin: process.env.NEXT_PUBLIC_MICROCMS_ORIGIN!,
    height: 543,
  });

  useEffect(() => {
    if (!markdown) {
      setMarkdown(data);
    }
  }, [markdown, data]);

  return (
    <div data-color-mode="light" className={styles.container}>
      <MDEditor
        value={markdown}
        previewOptions={{
          linkTarget: "_blank",
          rehypePlugins: [
            [
              rehypeSanitize,
              {
                ...defaultSchema,
                attributes: {
                  ...defaultSchema.attributes,
                  span: [
                    ...(defaultSchema?.attributes?.span || []),
                    // List of all allowed tokens:
                    ["className"],
                  ],
                  code: [["className"]],
                },
              },
            ],
          ],
        }}
        onChange={(value) => {
          setMarkdown(value);
          sendMessage({
            data: value,
          });
        }}
        height={540}
        textareaProps={{
          placeholder: "Please enter Markdown text",
        }}
        onDrop={async (event) => {
          event.preventDefault();
          await onImagePasted(event.dataTransfer, setMarkdown);
        }}
      />
    </div>
  );
};

export default IndexPage;
