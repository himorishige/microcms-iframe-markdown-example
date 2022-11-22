# はじめに

[microCMSの拡張フィールドをつかってMarkdownの入稿環境をつくる](https://blog.microcms.io/)のサンプルコードです。

## 初期設定

記事を参考に`.env.local`ファイルを用意する必要があります。

```bash
NEXT_PUBLIC_MICROCMS_ORIGIN=https://xxxx.microcms.io
# Cloudflare R2
NEXT_PUBLIC_R2_BUCKET_URL=https://pub-xxxxxxxxxxxxxxx.r2.dev
NEXT_PUBLIC_BUCKET_NAME=yourbuketname
R2_ENDPOINT=https://xxxxxxxxxxx.r2.cloudflarestorage.com
R2_ACCESS_KEY=xxxxxxxxxxxxxx
R2_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## インストール

```bash
npm install
# or
yarn install
```

## アプリケーションの起動

```bash
npm run dev
# or
yarn dev
```

[http://localhost:3000](http://localhost:3000)
