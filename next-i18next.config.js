const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "fi",
    locales: ["fi", "en", "sv"]
  },
  localePath: path.resolve("./public/locales")
};
