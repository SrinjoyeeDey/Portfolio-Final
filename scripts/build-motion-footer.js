const esbuild = require('esbuild');

try {
  esbuild.buildSync({
    entryPoints: ['src/motion-footer-entry.tsx'],
    bundle: true,
    outfile: 'motion-footer-bundle.js',
    loader: { '.tsx': 'tsx', '.ts': 'ts', '.jsx': 'jsx', '.css': 'css' },
    minify: true,
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  });

  console.log('Motion footer bundle build successful!');
} catch (err) {
  console.error('Motion footer build failed:', err);
  process.exit(1);
}

