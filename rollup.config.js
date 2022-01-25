import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json";

const esm = {
  input: "src/index.ts",
  output: { file: pkg.module, sourcemap: true, format: "esm" },
  plugins: [typescript()],
};

const cjs = {
  input: "src/index.ts",
  output: {
    file: pkg.main,
    sourcemap: true,
    format: "cjs",
    esModule: true,
  },
  plugins: [resolve(), typescript()],
};

const umd = {
  input: "src/index.ts",
  output: {
    file: pkg.browser,
    format: "umd",
    name: "IcNaming.JS_SDK",
  },
  plugins: [commonjs(), resolve(), typescript()],
};

export default [esm, cjs, umd];
