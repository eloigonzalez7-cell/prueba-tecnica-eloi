const { merge } = require("webpack-merge");
const common = require("./webpack.common");

/** @type {import('webpack').Configuration} */
module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  output: {
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].js",
  },
  optimization: {
    minimize: true,
  },
  performance: {
    // React + Router + DOMPurify in the shell sits just over Webpack's 244 KiB hint.
    hints: "warning",
    maxAssetSize: 512_000,
    maxEntrypointSize: 512_000,
  },
});
