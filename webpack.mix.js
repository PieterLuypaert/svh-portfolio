let mix = require("laravel-mix");

mix
  .js("src/js/main.js", "build/js")
  .setPublicPath("build")
  .sass("src/scss/app.scss", "build/css")
  .copyDirectory("src/images", "build/images")
  .version()
  .browserSync({
    server: {
      baseDir: "./",
    },
    files: ["*.html", "build/css/*.css", "build/js/*.js"],
  })
  .options({
    processCssUrls: false,
  });

if (mix.inProduction()) {
  mix.version();
} else {
  mix.sourceMaps();
}
