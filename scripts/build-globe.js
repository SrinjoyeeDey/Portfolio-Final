const esbuild = require('esbuild');

try {
  esbuild.buildSync({
    entryPoints: ['src/globe-entry.tsx'],
    bundle: true,
    outfile: 'globe-bundle.js',
    loader: { '.tsx': 'tsx', '.ts': 'ts', '.jsx': 'jsx', '.css': 'css' },
    minify: true,
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  });

  console.log('Globe bundle build successful!');
} catch (err) {
  console.error('Globe build failed:', err);
  process.exit(1);
}

