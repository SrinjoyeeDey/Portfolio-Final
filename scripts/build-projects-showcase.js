const esbuild = require('esbuild');

try {
  esbuild.buildSync({
    entryPoints: ['src/projects-showcase-entry.jsx'],
    bundle: true,
    outfile: 'projects-showcase-bundle.js',
    loader: { '.jsx': 'jsx', '.css': 'css' },
    minify: true,
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  });

  console.log('ProjectsShowcase bundle build successful!');
} catch (err) {
  console.error('Build failed:', err);
  process.exit(1);
}
