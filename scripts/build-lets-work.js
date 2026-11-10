const esbuild = require('esbuild');

try {
  esbuild.buildSync({
    entryPoints: ['src/lets-work-entry.tsx'],
    bundle: true,
    outfile: 'lets-work-bundle.js',
    loader: { '.tsx': 'tsx', '.ts': 'ts', '.jsx': 'jsx', '.js': 'js', '.css': 'css' },
    minify: true,
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  });

  console.log('LetsWork bundle build successful!');
} catch (err) {
  console.error('LetsWork build failed:', err);
  process.exit(1);
}

