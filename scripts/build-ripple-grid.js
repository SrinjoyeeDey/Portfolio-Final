const esbuild = require('esbuild');

esbuild.buildSync({
  entryPoints: ['src/ripple-grid-entry.jsx'],
  bundle: true,
  outfile: 'ripple-grid-bundle.js',
  loader: { '.jsx': 'jsx', '.css': 'css' },
  minify: true,
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});

console.log('RippleGrid build successful!');
