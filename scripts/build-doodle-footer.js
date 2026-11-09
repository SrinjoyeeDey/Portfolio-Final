const esbuild = require('esbuild');

try {
  esbuild.buildSync({
    entryPoints: ['src/doodle-footer-entry.tsx'],
    bundle: true,
    outfile: 'doodle-footer-bundle.js',
    loader: { '.tsx': 'tsx', '.ts': 'ts', '.jsx': 'jsx', '.css': 'css' },
    minify: true,
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  });

  console.log('Doodle footer bundle build successful!');
} catch (err) {
  console.error('Doodle footer build failed:', err);
  process.exit(1);
}

