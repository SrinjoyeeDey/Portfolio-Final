const esbuild = require('esbuild');

try {
  esbuild.buildSync({
    entryPoints: ['src/pixel-transition-entry.jsx'],
    bundle: true,
    outfile: 'pixel-transition-bundle.js',
    loader: { '.jsx': 'jsx', '.css': 'css' },
    minify: true,
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  });

  console.log('PixelTransition build successful!');
} catch (err) {
  console.error('PixelTransition build failed:', err);
  process.exit(1);
}

