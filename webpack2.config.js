const path = require('path');
module.exports = {
   entry: {
       "inlinejs.min": "./src/inlinejs.ts",
       "inlinejs-extended.min": "./src/inlinejs-extended.ts",
       "inlinejs-router.min": "./src/inlinejs-router.ts",
       "inlinejs-cart.min": "./src/inlinejs-cart.ts",
       "inlinejs-favorites.min": "./src/inlinejs-favorites.ts",
       "inlinejs-collection.min": "./src/inlinejs-collection.ts",
       "inlinejs-screen.min": "./src/inlinejs-screen.ts",
       "inlinejs-tdiff.min": "./src/inlinejs-tdiff.ts",
       "inlinejs-stripe.min": "./src/inlinejs-stripe.ts",
       "inlinejs-quill.min": "./src/inlinejs-quill.ts",
       "inlinejs-swal.min": "./src/inlinejs-swal.ts",
       "inlinejs-canvas.min": "./src/inlinejs-canvas.ts",
       "inlinejs-pack.min": "./src/inlinejs-pack.ts",
       "inlinejs-plugins.min": "./src/inlinejs-plugins.ts",
       "inlinejs-animation.min": "./src/inlinejs-animation.ts",
       "inlinejs-animation-lite.min": "./src/inlinejs-animation-lite.ts",
   },
   output: {
       filename: "[name].js",
       path: path.resolve(__dirname, 'dist')
   },
   resolve: {
       extensions: [".webpack.js", ".web.js", ".ts", ".js"]
   },
   module: {
       rules: [{ test: /\.ts$/, loader: "ts-loader" }]
   },
   mode: 'production'
}
