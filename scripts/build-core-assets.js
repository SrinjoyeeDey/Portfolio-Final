const esbuild = require('esbuild');
const path = require('path');

const CSS_FILES = [
  ['lib/lenis.css', 'lib/lenis.min.css'],
  ['styles.css', 'styles.min.css'],
  ['journey-timeline.css', 'journey-timeline.min.css'],
  ['scroll-reveal.css', 'scroll-reveal.min.css'],
  ['memory-wall.css', 'memory-wall.min.css'],
  ['tech-arsenal.css', 'tech-arsenal.min.css'],
  ['responsive-mobile.css', 'responsive-mobile.min.css']
];

const JS_FILES = [
  ['sound-system.js', 'sound-system.min.js'],
  ['script.js', 'script.min.js'],
  ['tech-arsenal.js', 'tech-arsenal.min.js'],
  ['hero-3d-model.js', 'hero-3d-model.min.js'],
  ['scroll-reveal.js', 'scroll-reveal.min.js']
];

try {
  for (const [input, output] of CSS_FILES) {
    esbuild.buildSync({
      entryPoints: [path.resolve(__dirname, '..', input)],
      outfile: path.resolve(__dirname, '..', output),
      bundle: false,
      minify: true,
      sourcemap: false,
      legalComments: 'none'
    });
  }

  for (const [input, output] of JS_FILES) {
    esbuild.buildSync({
      entryPoints: [path.resolve(__dirname, '..', input)],
      outfile: path.resolve(__dirname, '..', output),
      bundle: false,
      minify: true,
      sourcemap: false,
      legalComments: 'none',
      drop: ['debugger'],
      pure: ['console.log', 'console.debug', 'console.info']
    });
  }

  console.log('Core CSS & JS minification successful!');
} catch (err) {
  console.error('Core assets minification failed:', err);
  process.exit(1);
}

