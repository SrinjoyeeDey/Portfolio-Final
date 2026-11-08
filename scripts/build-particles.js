const esbuild = require('esbuild');

try {
  esbuild.buildSync({
    entryPoints: ['src/particles-loader-entry.jsx'],
    bundle: true,
    outfile: 'particles-bundle.js',
    loader: { '.jsx': 'jsx', '.css': 'css' },
    minify: true,
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  });

  console.log('Particles bundle build successful!');
} catch (err) {
  console.error('Build failed:', err);
  process.exit(1);
}

