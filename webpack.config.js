const path = require('path');
module.exports = {
   entry: {
       "inlinejs": "./src/inlinejs.ts",
       "inlinejs-extended": "./src/inlinejs-extended.ts",
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
