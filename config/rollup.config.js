const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const uglify = require('rollup-plugin-uglify');
const manifest = require('../package.json');

const plugins = [
  nodeResolve({
    browser: true,
  }),
  commonjs({
    include: 'node_modules/**',
    ignoreGlobal: true,
  }),
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
      },
    }),
  );
}

const output = process.env.NODE_ENV === 'production'
  ? [
      {
        file: 'build/cdn/adaptive.min.js',
        format: 'umd',
        name: 'fsAdaptive',
      },
      {
        file: `build/cdn/adaptive-${manifest.version}.min.js`,
        format: 'umd',
        name: 'fsAdaptive',
      },
    ]
  : {
      file: 'build/browser/index.umd.js',
      format: 'umd',
      name: 'fsAdaptive',
    }

module.exports = {
  input: 'build/module/index.js',
  output,
  sourcemap: true,
  plugins,
}
