const esbuild = require('esbuild');

try {
  esbuild.buildSync({
    entryPoints: ['src/parallax-entry.tsx'],
    bundle: true,
    outfile: 'parallax-bundle.js',
    loader: { '.tsx': 'tsx', '.ts': 'ts', '.jsx': 'jsx', '.css': 'css' },
    minify: true,
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  });

  console.log('Parallax bundle build successful!');
} catch (err) {
  console.error('Parallax build failed:', err);
  process.exit(1);
}

