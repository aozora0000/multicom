# YouTubeコメントを複数窓で見るやつ

複数のYouTubeライブチャットを、指定したレイアウトで同時に表示するための小さなWebツールです。

## 使い方

1. `レイアウト` から表示形式を選びます。
2. `w1` から `w8` にYouTubeの動画IDまたはURLを入力します。
3. `反映` を押すと、各枠にYouTube Live Chatが読み込まれます。
4. 認識できたURLは、入力欄上では動画IDだけに変換されます。

対応URL例:

- YouTube動画ID
- `https://www.youtube.com/watch?v=...`
- `https://youtu.be/...`
- `https://www.youtube.com/embed/...`
- `https://www.youtube.com/shorts/...`
- `https://www.youtube.com/live/...`

## レイアウト

対応レイアウト:

- `2x1`
- `3x1`
- `4x1`
- `2x2`
- `2x3`
- `3x2`
- `4x2`
- `1x2`
- `1x3`
- `1x4`

レイアウトは後から変更できます。変更時はブラウザのURLも共有用に更新されます。

## 空枠から追加

空の表示枠には入力欄と `追加` ボタンが出ます。

その枠へ直接YouTube URLまたは動画IDを入れて `追加` を押すと、該当枠にコメントを読み込みます。

## D&Dで入れ替え

上部の入力ブロックをドラッグ&ドロップすると、対応する表示枠の位置を入れ替えられます。

D&D後もブラウザのURLは現在の配置に合わせて更新されます。

## 共有URL

ステータス行の `共有URL` をクリックすると、現在のレイアウトと入力値を含むURLをコピーできます。

URLは `?l=2x2&w1=...&w2=...` のようなクエリパラメータで状態を表します。

## 操作欄

`操作欄を隠す` を押すと、コメント表示領域を広く使えます。

画面上部の復帰ボタン、または `Esc` で操作欄を表示できます。

## 開発

pnpmを使います。npmは使わないでください。

```sh
pnpm install
pnpm dev
pnpm test
pnpm build
```

## GitHub Pages

GitHub Pagesへの公開は `.github/workflows/deploy-pages.yml` のGitHub Actionsで行います。

リポジトリ設定で Pages の Source を `GitHub Actions` にしてください。
