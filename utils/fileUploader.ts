import cuid from "cuid";

// R2
const BUCKET_URL = process.env.NEXT_PUBLIC_R2_BUCKET_URL!;

//ファイル名から拡張子を取得する
function getExt(filename: string) {
  const pos = filename.lastIndexOf(".");
  if (pos === -1) return "";
  return filename.slice(pos + 1);
}

//アップロードを許可する拡張子
const allowExts = new Array("jpg", "jpeg", "png", "gif", "webp");

//アップロード予定のファイル名の拡張子が許可されているか確認する
function checkExt(filename: string) {
  const ext = getExt(filename).toLowerCase();
  if (allowExts.indexOf(ext) === -1) return false;
  return true;
}

export const fileUploader = async (file: File, dirName = "images") => {
  try {
    if (file) {
      const filename = encodeURIComponent(file.name);
      const ext = getExt(filename);

      if (!checkExt(filename)) {
        alert("画像ファイルを選択してください");
        return;
      }

      // cuidでランダムなファイル名を生成
      const objectName = `${dirName}/${cuid()}.${ext}`;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", objectName);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        console.info("Uploaded successfully!");
        return `${BUCKET_URL}/${objectName}`;
      } else {
        alert("Upload failed.");
      }
    }
  } catch (error) {
    alert("Upload failed.");
  }
};
