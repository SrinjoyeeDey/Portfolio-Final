const esbuild = require('esbuild');

try {
  esbuild.buildSync({
    entryPoints: ['src/memory-wall-entry.jsx'],
    bundle: true,
    outfile: 'memory-wall-bundle.js',
    loader: { '.jsx': 'jsx', '.css': 'css' },
    minify: true,
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  });

  console.log('MemoryWall bundle build successful!');
} catch (err) {
  console.error('Build failed:', err);
  process.exit(1);
}
