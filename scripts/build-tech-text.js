const esbuild = require('esbuild');

esbuild.buildSync({
  entryPoints: ['src/tech-text-entry.jsx'],
  bundle: true,
  outfile: 'tech-text-bundle.js',
  loader: { '.jsx': 'jsx', '.css': 'css' },
  minify: true,
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});

console.log('TechText build successful!');
