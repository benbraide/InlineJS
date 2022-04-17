const path = require('path');
module.exports = {
   entry: {
       "inlinejs.min": "./src/inlinejs.ts",
    //    "inlinejs-extended.min": "./src/inlinejs-extended.ts",
    //    "inlinejs-animated.min": "./src/inlinejs-animated.ts",
    //    "inlinejs-custom.min": "./src/inlinejs-custom.ts"
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
   }
}
