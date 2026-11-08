const esbuild = require('esbuild');

try {
  esbuild.buildSync({
    entryPoints: ['src/footer-shuffle-entry.jsx'],
    bundle: true,
    outfile: 'footer-shuffle-bundle.js',
    loader: { '.jsx': 'jsx', '.css': 'css' },
    minify: true,
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  });

  console.log('FooterShuffle build successful!');
} catch (err) {
  console.error('FooterShuffle build failed:', err);
  process.exit(1);
}

