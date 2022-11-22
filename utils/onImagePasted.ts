import type { SetStateAction } from "react";
import { fileUploader } from "./fileUploader";
import { insertToTextArea } from "./insertToTextArea";

export const onImagePasted = async (
  dataTransfer: DataTransfer,
  setMarkdown: (value: SetStateAction<string | undefined>) => void
) => {
  const files: File[] = [];
  for (let index = 0; index < dataTransfer.items.length; index += 1) {
    const file = dataTransfer.files.item(index);

    if (file) {
      files.push(file);
    }
  }

  await Promise.all(
    files.map(async (file) => {
      const url = await fileUploader(file);

      if (!url) return;

      const insertedMarkdown = insertToTextArea(`![](${url})`);

      if (!insertedMarkdown) return;

      setMarkdown(insertedMarkdown);
    })
  );
};
