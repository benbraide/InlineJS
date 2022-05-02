const path = require('path');
module.exports = {
   entry: {
       "inlinejs": "./src/inlinejs.ts",
       "inlinejs-extended": "./src/inlinejs-extended.ts",
       "inlinejs-router": "./src/inlinejs-router.ts",
       "inlinejs-cart": "./src/inlinejs-cart.ts",
       "inlinejs-favorites": "./src/inlinejs-favorites.ts",
       "inlinejs-collection": "./src/inlinejs-collection.ts",
       "inlinejs-stripe": "./src/inlinejs-stripe.ts",
       "inlinejs-quill": "./src/inlinejs-quill.ts",
       "inlinejs-swal": "./src/inlinejs-swal.ts",
       "inlinejs-canvas": "./src/inlinejs-canvas.ts"
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
   mode: 'development',
   devtool: false
}
