const esbuild = require("esbuild");

try {
  esbuild.buildSync({
    entryPoints: ["src/keyboard-entry.tsx"],
    bundle: true,
    outfile: "keyboard-bundle.js",
    loader: { ".tsx": "tsx", ".ts": "ts", ".jsx": "jsx", ".js": "js", ".css": "css" },
    minify: true,
    define: {
      "process.env.NODE_ENV": '"production"',
    },
  });

  console.log("Keyboard bundle build successful!");
} catch (err) {
  console.error("Keyboard build failed:", err);
  process.exit(1);
}

