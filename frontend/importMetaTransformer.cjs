const babel = require("@babel/core");

// Custom transformer to handle import.meta.env
module.exports = {
  process(src, filename) {
    // Replace import.meta.env with a reference to global env constants
    const transformed = src.replace(/import\.meta\.env/g, "process.env");

    // Use babel to handle the rest of the transformations
    const result = babel.transformSync(transformed, {
      filename,
      presets: [
        ["@babel/preset-env", { targets: { node: "current" } }],
        "@babel/preset-typescript",
        ["@babel/preset-react", { runtime: "automatic" }],
      ],
    });

    return {
      code: result.code || "",
      map: result.map,
    };
  },
};
