const esbuild = require('esbuild');

try {
  esbuild.buildSync({
    entryPoints: ['src/circular-text-entry.jsx'],
    bundle: true,
    outfile: 'circular-text-bundle.js',
    loader: { '.jsx': 'jsx', '.css': 'css' },
    minify: true,
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  });

  console.log('CircularText bundle build successful!');
} catch (err) {
  console.error('Build failed:', err);
  process.exit(1);
}
