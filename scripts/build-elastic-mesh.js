const esbuild = require('esbuild');

try {
  esbuild.buildSync({
    entryPoints: ['src/elastic-mesh-entry.jsx'],
    bundle: true,
    outfile: 'elastic-mesh-bundle.js',
    loader: { '.jsx': 'jsx', '.js': 'js', '.css': 'css' },
    minify: true,
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  });

  console.log('ElasticMesh bundle build successful!');
} catch (err) {
  console.error('ElasticMesh build failed:', err);
  process.exit(1);
}

