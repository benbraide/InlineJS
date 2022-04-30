const path = require('path');
module.exports = {
   entry: {
       "inlinejs": "./src/inlinejs.ts",
       "inlinejs-extended": "./src/inlinejs-extended.ts",
       "inlinejs-router": "./src/inlinejs-router.ts",
       "inlinejs-stripe": "./src/inlinejs-stripe.ts",
       "inlinejs-quill": "./src/inlinejs-quill.ts",
       "inlinejs-swal": "./src/inlinejs-swal.ts",
       "inlinejs-canvas": "./src/inlinejs-canvas.ts",
    //    "inlinejs-animated": "./src/inlinejs-animated.ts",
    //    "inlinejs-custom": "./src/inlinejs-custom.ts"
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
