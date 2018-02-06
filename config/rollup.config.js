const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const uglify = require('rollup-plugin-uglify');
const namedExports = require('./named_exports.json');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');

const plugins = [
  builtins(),
  nodeResolve({
    browser: true,
  }),
  commonjs({
    include: 'node_modules/**',
    namedExports: namedExports,
    ignoreGlobal: true,
  }),
  globals(),
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
      }
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
  banner: `/* version ${manifest.version} */`,
  plugins,
}
