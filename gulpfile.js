const { src, dest, watch, series, parallel } = require("gulp");
ejs = require("gulp-ejs");
rename = require("gulp-rename");
sass = require("gulp-sass");
imagemin = require("gulp-imagemin");
changed = require("gulp-changed");
imageminJpg = require("imagemin-jpeg-recompress");
imageminPng = require("imagemin-pngquant");
imageminGif = require("imagemin-gifsicle");
imageminSvgo = require("imagemin-svgo");
cssmin = require("gulp-cssmin");
sftp = require("gulp-sftp");
plumber = require("gulp-plumber");
notify = require("gulp-notify");
htmlmin = require("gulp-htmlmin");
babel = require("gulp-babel");
eslint = require("gulp-eslint");
browserSync = require("browser-sync");
webpack = require("webpack");
webpackStream = require("webpack-stream"); // gulpでwebpackを使うために必要なプラグイン
// webpackの設定ファイルの読み込み
webpackConfig = require("./webpack.config.js");

//ディレクトリ構成
const CONF = {
  EJS: {
    SOURCE: ["./src/ejs/**/*.ejs", "!./src/ejs/_inc/*.ejs"],
    OUTPUT: "./dist",
  },
  SASS: {
    SOURCE: "./src/sass/*.scss",
    OUTPUT: "./dist/assets/css",
  },
  JS: {
    SOURCE: "./src/js/*.js",
    OUTPUT: "./dist/assets/js",
  },
  IMAGE: {
    SOURCE: "./src/image/**/*.+(jpg|jpeg|JPG|png|PNG|gif|svg)",
    OUTPUT: "./dist/assets/image",
  },
  LIB: {
    SOURCE: ["./src/js/lib/*.js", "./src/js/lib/*.css"],
    OUTPUT: "./dist/assets/js/lib",
  },
  BROWSERSYNC: {
    DOCUMENT_ROOT: "./dist",
    INDEX: "index.html",
    GHOSTMODE: {
      clicks: false,
      forms: false,
      scroll: false,
    },
  },
};

// サーバー起動
const buildServer = done => {
  browserSync.init({
    port: 8080,
    server: {
      baseDir: CONF.BROWSERSYNC.DOCUMENT_ROOT,
      index: CONF.BROWSERSYNC.INDEX,
    },
    startPath: "",
    reloadOnRestart: true,
  });
  done();
};

// ブラウザ自動リロード
const browserReload = done => {
  browserSync.reload();
  done();
};

const compileEjs = () => {
  // .ejsファイルを取得
  return (
    src(CONF.EJS.SOURCE)
      // pipe() 1つ一つの処理をつなげる。
      .pipe(plumber(notify.onError("Error: <%= error.message %>")))
      .pipe(ejs({}, {}, { ext: ".html" }))
      .pipe(rename({ extname: ".html" }))
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(dest(CONF.EJS.OUTPUT))
  );
};

var options = {
  outputStyle: "compressed",
  sourceMap: true,
  sourceComments: false,
};

// style.scssをタスクを作成する
const compileSass = done => {
  // style.scssファイルを取得
  return (
    src(CONF.SASS.SOURCE)
      .pipe(plumber(notify.onError("Error: <%= error.message %>")))
      // Sassのコンパイルを実行
      .pipe(sass(options))
      // cssフォルダー以下に保存
      .pipe(dest(CONF.SASS.OUTPUT))
  );
  done(); // 終了宣言
};

const bundleJs = () => {
  return src(CONF.JS.SOURCE) //結果をwatchへ返却する
    .pipe(plumber(notify.onError("Error: <%= error.message %>")))
    .pipe(eslint()) //(＊3)
    .pipe(eslint.format()) //(＊4)
    .pipe(eslint.failAfterError()) //(＊5)
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(dest(CONF.JS.OUTPUT)); //指定のディレクトリに移動させる
};

const LibFunc = () => {
  return src(CONF.LIB.SOURCE) //結果をwatchへ返却する
    .pipe(plumber(notify.onError("Error: <%= error.message %>")))
    .pipe(dest(CONF.LIB.OUTPUT)); //指定のディレクトリに移動させる
};

const imageFunc = () => {
  return src(CONF.IMAGE.SOURCE) //サイト全体の画像を指定
    .pipe(plumber(notify.onError("Error: <%= error.message %>")))
    .pipe(changed(CONF.IMAGE.SOURCE)) //変更があるかチェック
    .pipe(
      imagemin([
        imageminPng(),
        imageminJpg(),
        imageminGif({
          interlaced: false,
          optimizationLevel: 3,
          colors: 180,
        }),
        imagemin.svgo(),
      ])
    ) //結果をwatchへ返却する
    .pipe(dest(CONF.IMAGE.OUTPUT)); //指定のディレクトリに移動させる
};

// const FtpFunc = () => {
//   return src([
//     "**", // アップロードしたいファイルを指定
//   ]).pipe(
//     sftp({
//       // FTP情報を入力
//       host: "orchiddingo5.sakura.ne.jp",
//       user: "orchiddingo5",
//       pass: "h/sa6zE-Tsh,",
//       remotePath: "/home/orchiddingo5/www/test", // リモート側のパス　（デフォルトは "/"）
//     })
//   );
// };

//Watch
const watchFiles = () => {
  watch(CONF.EJS.SOURCE, series(compileEjs, browserReload));
  watch(CONF.SASS.SOURCE, series(compileSass, browserReload));
  watch(CONF.IMAGE.SOURCE, series(imageFunc, browserReload));
  watch(CONF.LIB.SOURCE, series(LibFunc, browserReload));
  watch(CONF.JS.SOURCE, series(bundleJs, browserReload));
};

exports.compileEjs = compileEjs;
exports.compileSass = compileSass;
exports.imageFunc = imageFunc;
exports.LibFunc = LibFunc;
// exports.FtpFunc = FtpFunc;
exports.bundleJs = bundleJs;

exports.default = series(
  parallel(compileEjs, compileSass, LibFunc, imageFunc, bundleJs),
  series(buildServer, watchFiles)
);
