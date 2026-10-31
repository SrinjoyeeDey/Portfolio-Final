const esbuild = require('esbuild');

esbuild.buildSync({
  entryPoints: ['src/text-pressure-entry.jsx'],
  bundle: true,
  outfile: 'text-pressure-bundle.js',
  loader: { '.jsx': 'jsx', '.css': 'css' },
  minify: true,
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});

console.log('TextPressure build successful!');
