const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const uglify = require('rollup-plugin-uglify').uglify;
const namedExports = require('./named_exports.json');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const manifest = require('../package.json');
const babel = require('rollup-plugin-babel');

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
  babel({ 
    runtimeHelpers: true,
    presets: [
      [
        "@babel/preset-env",
        {
          targets: "> 0.25%, not dead",
        },
      ],
    ],
    plugins: ["minify-dead-code-elimination"]
  }),
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    uglify({
      sourcemap: true,
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
        sourcemapFile: 'build/cdn/adaptive.min.js.map',
        sourcemap: true,
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
  sourcemap: true,
  output,
  banner: `/* version ${manifest.version} */`,
  plugins,
  treeshake: true
}
