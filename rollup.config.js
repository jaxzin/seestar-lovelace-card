import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/seestar-card.ts',
  output: {
    file: 'dist/seestar-card.js',
    format: 'es',
    sourcemap: false,
  },
  plugins: [nodeResolve(), typescript(), terser()],
};
