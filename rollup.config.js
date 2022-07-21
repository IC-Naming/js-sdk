import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
// import builtins from "rollup-plugin-node-builtins";
// import globals from "rollup-plugin-node-globals";
import pkg from './package.json';

const esm = {
  input: 'src/index.ts',
  output: { file: pkg.module, sourcemap: true, format: 'esm' },
  plugins: [typescript()],
  external: ['@dfinity/agent']
};

const cjs = {
  input: 'src/index.ts',
  output: {
    file: pkg.main,
    sourcemap: true,
    format: 'cjs',
    esModule: true
  },
  plugins: [
    commonjs(),
    resolve({
      preferBuiltins: true
    }),
    typescript()
  ],
  external: ['@dfinity/agent']
};

// const umd = {
//   input: "src/index.ts",
//   output: {
//     file: pkg.browser,
//     format: "umd",
//     name: "IcNaming.Client",
//     esModule: true,
//   },
//   plugins: [
//     resolve(),
//     commonjs(),
//     globals(),
//     builtins(),
//     typescript(),
//   ],
// };

const declaration = {
  input: 'src/index.ts',
  output: {
    file: pkg.typings,
    format: 'es'
  },
  plugins: [dts()]
};

export default [esm, cjs, /* umd, */ declaration];
