const path = require("path");

module.exports = {
  entry: "./src/index.tsx", // Adjust path if different
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: {
      name: "RDateTime",
      type: "umd", // Makes it compatible with CommonJS, AMD, and script tags
    },
    globalObject: "this", // Fixes UMD issues in Node.js
    clean: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  externals: {
    react: "react",
    "react-dom": "react-dom", // Avoid bundling React
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/, // Optional: if you're using CSS
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
