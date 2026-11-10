const esbuild = require('esbuild');

esbuild.buildSync({
  entryPoints: ['src/pulse-heart-entry.jsx'],
  bundle: true,
  outfile: 'pulse-heart-bundle.js',
  loader: { '.jsx': 'jsx', '.css': 'css' },
  minify: true,
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});

console.log('PulseHeart bundle build successful!');

