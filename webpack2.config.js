const path = require('path');
module.exports = {
   entry: {
       "inlinejs.min": "./src/inlinejs.ts",
       "inlinejs-extended.min": "./src/inlinejs-extended.ts",
       "inlinejs-router.min": "./src/inlinejs-router.ts",
       "inlinejs-cart.min": "./src/inlinejs-cart.ts",
       "inlinejs-favorites.min": "./src/inlinejs-favorites.ts",
       "inlinejs-collection.min": "./src/inlinejs-collection.ts",
       "inlinejs-stripe.min": "./src/inlinejs-stripe.ts",
       "inlinejs-quill.min": "./src/inlinejs-quill.ts",
       "inlinejs-swal.min": "./src/inlinejs-swal.ts",
       "inlinejs-canvas.min": "./src/inlinejs-canvas.ts"
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
