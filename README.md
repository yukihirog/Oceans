# sitekit

## ファイル構成

    (git repository)
        +- .gitignore : Git登録の除外ファイル指定
        |
        +- config/ : 開発環境の設定
        |   +- browsersync.base.js : ローカルサーバー（Browsersync）基本設定
        |   +- browsersync.user.js : ローカルサーバーのユーザー設定
        |   +- path.js : パスの設定
        |
        +- run.bat : 開発環境の起動コマンド（Windows）
        +- run.command : 開発環境の起動コマンド（Mac）
        |
        +- gulpfile.js : 開発環境の実行内容を記述したファイル
        |
        +- html/ : テンプレートHTML等
        |   +- common/ : サイト共通のCSS、JS、画像など（生成後のCSS、JS、画像）
        |       +- css/ : CSS
        |       +- img/ : 画像
        |       +- js/ : JS
        |
        +- install.bat : 開発環境のインストールコマンド（Windows）
        +- install.command : 開発環境のインストールコマンド（Mac）
        |
        +- node_modules/ : 開発用モジュール（install.bat/install.commandを実行時に作成されます）
        |
        +- package.json : 開発用モジュールの指定ファイル
        +- package-lock.json : 開発用モジュールの指定ファイル
        |
        +- resources/ : CSS、JSなどの開発用ファイル
            +- common/ : サイト共通のCSS、JS、画像など（開発用ファイル）
                +- img/ : 画像
                |
                +- css/ : CSS（Sassのscss形式）
                |   +- _element.scss : HTMLの基本要素のスタイル
                |   +- _env.scss : 変数などの共通設定ファイル（フォントの指定、色など）
                |   +- _frame.scss : ヘッダー、フッター、ページ枠組みなどの共通スタイル
                |   +- _module.scss : コンポーネントのimportファイル
                |   +- common.scss : サイト共通ヘッダー・フッターなどのスタイル
                |   +- module/ : 共通コンポーネントのスタイル
                |   +- page/ : 個別テンプレートのスタイル
                |
                +- js/ : JS
                    +- vendor/ : jQuery等の外部ライブラリ
                    +- components/ : サイト内のコンポーネント用
                    +- main/ : メインJS


## 開発環境

### 導入方法

#### 1. Node.jsのインストール
以下のサイトから「X.X.X LTS」をダウンロード＆インストールしてください。

https://nodejs.org/


##### 古いNode.jsが既にインストールされている場合
以下のコマンドで最新版にアップデートされます。

```
n lts
```

```
npm update -g npm
```


#### 2. 開発モジュールのインストール
以下をダブルクリックしてください。

    Windows: install.bat
    Mac: install.command

※モジュールのアップデートがあった場合はお知らせしますので、その際はこのインストール操作を再度、行ってください


### 起動方法

#### gulpの実行
以下をダブルクリックしてください。

    Windows: run.bat
    Mac: run.command

コマンドラインのウィンドウとブラウザのウィンドウが開きます。

http://localhost:3000/

#### ローカルサーバー（Browsersync）の設定

下記にアクセスすると、UIからBrowsersyncの設定ができます。
（起動時にリセットされます）

http://localhost:3001/

##### JSで設定する場合

以下のファイルにBrowsersyncの設定を上書きすることができます。
（毎回の起動時に適用されます）

    config/browsersync.user.js

オプションについては以下のページを参照してください。

https://browsersync.io/docs/options

※初期状態では「ghostMode: false」が設定されています。


### 終了方法

コマンドラインのウィンドウを閉じると開発環境の実行が止まります。


### 起動後の挙動
開発環境を起動しておくと、以下の対応が自動で行われます。

* 画像ファイルの編集時に自動デプロイ（ファイルサイズ圧縮）
* scssファイルの編集時に自動デプロイ（Sass->CSSへの自動変換、ソースコード圧縮、mapファイルの作成）
* jsファイルの編集時に自動デプロイ（ソースコード圧縮、mapファイルの作成）
* HTML/CSS/JSファイルの編集時にブラウザを自動でリロード
* localhostでSSI（include）を実行（HTMLファイルのinclude）

