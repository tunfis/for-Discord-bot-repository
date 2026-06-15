# TRPG用BOT(仮)

身内のTRPGサーバー向けに作成したDiscord Botです。

## 機能

- `XdY` 任意の個数・面数でダイスロール (例: `2d6`)
- `XdYcZ` スキルチェック (例: `1d100c70`)
- `XoY` 能動側X・受動側Yで対抗ロール (例: `10o8`)
  計算式：成功値 = 50 + ( ( 能動 - 受動 ) × 5 )
- `XdYvAdB` ダイス同士の比較 (例: `3d6v2d6`)
- `/help` コマンド一覧を表示
- `/status` ランダムなステータスを生成（制作中）
- メンバーの入退室通知

## 使用技術

- Node.js v24.16.0
- Discord.js v14.11.0

## セットアップ

1. [Node.js](https://nodejs.org/)をインストール
2. リポジトリをクローン
3. `npm install`
4. `.env.example`を参考に`.env`を作成
5. `node module.js`で起動

## 環境変数

`.env.example`を参照してください。
