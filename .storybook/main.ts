const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  stories: ["../**/stories/**/*.stories.tsx"],
  addons: [
    // {
    //   name: "@storybook/preset-typescript",
    //   options: {
    //     tsLoaderOptions: {
    //       transpileOnly: true,
    //       configFile: path.resolve(__dirname, "../tsconfig.json")
    //     },
    //     tsDocgenLoaderOptions: {
    //       tsconfigPath: path.resolve(__dirname, "../tsconfig.json")
    //     },
    //     include: [path.resolve(__dirname, "../src")]
    //   }
    // },
    "@storybook/addon-actions",
    "@storybook/addon-links",
    "@storybook/addon-a11y/register"
  ],
  webpackFinal: async config => {
    // do mutation to the config
    config.module.rules.push(
      {
        test: /\.(j|t)s(x)?$/,
        exclude: [/node_modules/, /server/],
        use: {
          loader: "babel-loader",
          options: {
            sourceType: "unambiguous",
            cacheDirectory: true,
            babelrc: false,
            presets: [
              [
                "@babel/preset-env",
                { targets: { browsers: "last 2 versions" } } // or whatever your project requires
              ],
              "@babel/preset-typescript",
              "@babel/preset-react"
            ],
            plugins: [
              "@babel/plugin-transform-runtime",
              ["@babel/plugin-proposal-class-properties", { loose: true }],
              "react-hot-loader/babel",
              "@babel/plugin-proposal-optional-chaining",
              "@babel/plugin-proposal-nullish-coalescing-operator",
              "emotion"
            ]
          }
        }
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // only enable hot in development
              hmr: process.env.NODE_ENV === "development",
              // if hmr does not work, this is a forceful method.
              reloadAll: true
            }
          },
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf).*$/,
        loader: "url-loader?limit=100000"
      }
    );

    // Use real file paths for symlinked dependencies do avoid including them multiple times
    config.resolve.symlinks = true;

    // HACK: extend existing JS rule to ensure all dependencies are correctly ignored
    // https://github.com/storybooks/storybook/issues/3346#issuecomment-459439438
    const jsRule = config.module.rules.find(rule => rule.test.test(".jsx"));
    jsRule.exclude = [/node_modules/, /dist/];

    // HACK: Instruct Babel to check module type before injecting Core JS polyfills
    // https://github.com/i-like-robots/broken-webpack-bundle-test-case
    const babelConfig = jsRule.use.find(
      ({ loader }) => loader === "babel-loader"
    );
    babelConfig.options.sourceType = "unambiguous";

    config.plugins.push(new webpack.IgnorePlugin(/jsdom$/));

    config.resolve.extensions.push(".ts", ".tsx");

    return config;
  }
};
