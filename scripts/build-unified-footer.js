const esbuild = require('esbuild');

try {
  esbuild.buildSync({
    entryPoints: ['src/unified-footer-entry.tsx'],
    bundle: true,
    outfile: 'unified-footer-bundle.js',
    loader: { '.tsx': 'tsx', '.ts': 'ts', '.jsx': 'jsx', '.css': 'css' },
    minify: true,
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  });

  console.log('Unified footer bundle build successful!');
} catch (err) {
  console.error('Unified footer build failed:', err);
  process.exit(1);
}

