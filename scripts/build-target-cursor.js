const esbuild = require('esbuild');

esbuild.buildSync({
  entryPoints: ['src/target-cursor-entry.jsx'],
  bundle: true,
  outfile: 'target-cursor-bundle.js',
  loader: { '.jsx': 'jsx', '.css': 'css' },
  minify: true,
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});

console.log('TargetCursor build successful!');
