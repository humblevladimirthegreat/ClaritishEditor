import * as esbuild from 'esbuild';

await esbuild.build({
    entryPoints: ['script.js'],
    bundle: true,
    outfile: 'editor.bundle.js',
    format: 'iife',
    platform: 'browser',
    target: ['es2020'],
    logLevel: 'info',
});
