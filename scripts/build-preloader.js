const esbuild = require('esbuild');

try {
  esbuild.buildSync({
    entryPoints: ['src/preloader-entry.jsx'],
    bundle: true,
    outfile: 'preloader-bundle.js',
    loader: {
      '.jsx': 'jsx',
      '.tsx': 'tsx',
      '.js': 'jsx',
      '.css': 'css'
    },
    minify: true,
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  });

  console.log('Preloader bundle build successful!');
} catch (err) {
  console.error('Preloader build failed:', err);
  process.exit(1);
}
