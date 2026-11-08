const esbuild = require('esbuild');

esbuild.buildSync({
  entryPoints: ['src/grid-scan-entry.jsx'],
  bundle: true,
  outfile: 'grid-scan-bundle.js',
  loader: { '.jsx': 'jsx', '.css': 'css' },
  minify: true,
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});

console.log('GridScan build successful!');
