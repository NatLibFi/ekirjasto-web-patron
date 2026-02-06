const withTM = require("next-transpile-modules")([
  "@thepalaceproject/webpub-viewer"
]);

// ✅ i18n (next-i18next)
const { i18n } = require("./next-i18next.config");

const {
  BugsnagBuildReporterPlugin,
  BugsnagSourceMapUploaderPlugin
} = require("webpack-bugsnag-plugins");

const chalk = require("chalk");
const packageJson = require("./package.json");
const APP_VERSION = packageJson.version;
const { NODE_ENV, CONFIG_FILE, REACT_AXE } = process.env;

const log = (...message) =>
  console.log(chalk.blue("app info") + "  -", ...message);

// Compute some git info by running commands in a child process
const execSync = require("child_process").execSync;
const GIT_COMMIT_SHA = execSync("git rev-parse HEAD").toString().trim();
const GIT_BRANCH = execSync("git rev-parse --abbrev-ref HEAD")
  .toString()
  .trim();

// compute the release stage of the app
const RELEASE_STAGE =
  NODE_ENV === "production" && GIT_BRANCH === "production"
    ? "production"
    : NODE_ENV === "production" && GIT_BRANCH === "qa"
      ? "qa"
      : "development";

const BUILD_ID = `${APP_VERSION}-${GIT_BRANCH}.${GIT_COMMIT_SHA}`;

// fetch the config file synchronously
const APP_CONFIG = JSON.parse(
  execSync("node --unhandled-rejections=strict src/config/fetch-config.js", {
    encoding: "utf-8"
  })
);

// log some info to the console for the record.
log(`Instance Name: ${APP_CONFIG.instanceName}`);
log(`CONFIG_FILE: ${CONFIG_FILE}`);
log(`GIT_BRANCH: ${GIT_BRANCH}`);
log(`APP_VERSION: ${APP_VERSION}`);
log(`NODE_ENV: ${NODE_ENV}`);
log(`RELEASE_STAGE: ${RELEASE_STAGE}`);
log(`BUILD_ID: ${BUILD_ID}`);
log(`Companion App: ${APP_CONFIG.companionApp}`);
log(`Show Medium: ${APP_CONFIG.showMedium ? "enabled" : "disabled"}`);
log(
  `Google Tag Manager: ${
    APP_CONFIG.gtmId
      ? `enabled - ${APP_CONFIG.gtmId}`
      : "disabled (no gtm_id in config file)"
  }`
);
log(
  `Bugsnag: ${
    APP_CONFIG.bugsnagApiKey
      ? `enabled - ${APP_CONFIG.bugsnagApiKey}`
      : "disabled (no bugsnag_api_key in config file)"
  }`
);
log(`Open eBooks Config: `, APP_CONFIG.openebooks);
log(`Media Support: `, APP_CONFIG.mediaSupport);
log(`Libraries: `, APP_CONFIG.libraries);

const config = {
  env: {
    CONFIG_FILE,
    REACT_AXE,
    APP_VERSION,
    BUILD_ID,
    GIT_BRANCH,
    GIT_COMMIT_SHA,
    RELEASE_STAGE,
    APP_CONFIG: JSON.stringify(APP_CONFIG)
  },
  productionBrowserSourceMaps: true,
  generateBuildId: async () => BUILD_ID,
  webpack: (config, { dev, isServer, webpack }) => {
    console.log(
      chalk.cyan("info  -"),
      `Building ${isServer ? "server" : "client"} files using Webpack version ${
        webpack.version
      }.`
    );

    if (!isServer) {
      config.plugins.push(
        new webpack.IgnorePlugin({ resourceRegExp: /jsdom$/ })
      );
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        fs: false
      };
    }

    if (REACT_AXE !== "true") {
      config.plugins.push(
        new webpack.IgnorePlugin({ resourceRegExp: /react-axe$/ })
      );
    }

    if (!dev && APP_CONFIG.bugsnagApiKey) {
      const bugsnagConfig = {
        apiKey: APP_CONFIG.bugsnagApiKey,
        appVersion: BUILD_ID
      };

      config.plugins.push(new BugsnagBuildReporterPlugin(bugsnagConfig));
      config.plugins.push(
        new BugsnagSourceMapUploaderPlugin({
          ...bugsnagConfig,
          publicPath: isServer ? "" : "*/_next",
          overwrite: true
        })
      );
    }

    return config;
  }
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
});

module.exports = {
  ...withTM(withBundleAnalyzer(config)),
  i18n,
  distDir: "_next",
  generateBuildId: async () => {
    if (process.env.BUILD_ID) {
      return process.env.BUILD_ID;
    }
    return `${Date.now()}`;
  }
};
