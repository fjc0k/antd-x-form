import { Config } from 'bili'

const config: Config = {
  input: 'src/index.ts',
  banner: true,
  output: {
    dir: 'lib',
    format: ['cjs', 'es'],
    sourceMap: true,
  },
  babel: {
    minimal: true,
  },
  plugins: {
    typescript2: {
      objectHashIgnoreUnknownHack: false,
      tsconfigOverride: {
        include: ['src/**/*'],
      },
    },
  },
}

export default config
