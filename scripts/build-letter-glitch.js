const esbuild = require('esbuild');

try {
  esbuild.buildSync({
    entryPoints: ['src/letter-glitch-entry.jsx'],
    bundle: true,
    outfile: 'letter-glitch-bundle.js',
    loader: { '.jsx': 'jsx', '.css': 'css' },
    minify: true,
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  });

  console.log('LetterGlitch build successful!');
} catch (err) {
  console.error('LetterGlitch build failed:', err);
  process.exit(1);
}

