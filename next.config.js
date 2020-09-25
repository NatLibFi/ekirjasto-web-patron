const withTM = require("next-transpile-modules")([
  "library-simplified-webpub-viewer"
]);

const config = {
  publicRuntimeConfig: {
    NEXT_PUBLIC_AXIS_NOW_DECRYPT: process.env.NEXT_PUBLIC_AXIS_NOW_DECRYPT,
    NEXT_PUBLIC_COMPANION_APP: process.env.NEXT_PUBLIC_COMPANION_APP,
    SIMPLIFIED_CATALOG_BASE: process.env.SIMPLIFIED_CATALOG_BASE,
    SHORTEN_URLS: process.env.SHORTEN_URLS,
    CONFIG_FILE: process.env.CONFIG_FILE,
    REACT_AXE: process.env.REACT_AXE,
    CACHE_EXPIRATION_SECONDS: process.env.CACHE_EXPIRATION_SECONDS
  },
  env: {
    SIMPLIFIED_CATALOG_BASE: process.env.SIMPLIFIED_CATALOG_BASE
  },
  webpack: (config, { _buildId, _dev, isServer, _defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config
    !isServer && config.plugins.push(new webpack.IgnorePlugin(/jsdom$/));
    // react-axe should only be bundled when REACT_AXE=true
    !process.env.REACT_AXE &&
      config.plugins.push(new webpack.IgnorePlugin(/react-axe$/));
    // Fixes dependency on "fs" module.
    // we don't (and can't) depend on this in client-side code.
    if (!isServer) {
      config.node = {
        fs: "empty"
      };
    }

    return config;
  }
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
});
module.exports = withTM(withBundleAnalyzer(config));
