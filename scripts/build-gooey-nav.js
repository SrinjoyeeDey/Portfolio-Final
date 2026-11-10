const esbuild = require('esbuild');

esbuild.buildSync({
  entryPoints: ['src/gooey-nav-entry.jsx'],
  bundle: true,
  outfile: 'gooey-nav-bundle.js',
  loader: { '.jsx': 'jsx', '.css': 'css' },
  minify: true,
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});

console.log('GooeyNav bundle build successful!');

