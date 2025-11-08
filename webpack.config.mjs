import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import ESLintPlugin from 'eslint-webpack-plugin';

const filename = fileURLToPath(import.meta.url);
const __dirname = dirname(filename);

export default {
  mode: 'production',
  entry: {
    main: resolve(__dirname, './src/index.ts'),
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'index.js',
    path: resolve(__dirname, 'dist'),
    clean: true,
    module: true,
    chunkFormat: 'module',
  },
  experiments: {
    outputModule: true,
  },
  plugins: [
    new ESLintPlugin({ extensions: 'ts' }),
  ],
};
