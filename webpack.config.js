const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  mode: "production",
  watch: true,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        include: [path.resolve(__dirname, "src")],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    publicPath: "public",
    filename: "app.js",
    path: path.resolve(__dirname, "public"),
  },
};
