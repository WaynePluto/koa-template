import console from 'console'
import esbuild from 'esbuild'
import process from 'process'

const options = {
  entryPoints: ['src/main.ts'],
  outdir: 'dist',
  sourcemap: true,
  bundle: true,
  platform: 'node',
  minify: true,
  external: ['pg', 'better-sqlite3', 'tedious', 'mysql', 'oracledb', 'pg-query-stream', 'sqlite3'],
  alias: {
    '@': 'src',
  },
}

esbuild.build(options).catch(err => {
  console.error(err)
  process.exit(1)
})
