import rollup      from 'rollup'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs    from 'rollup-plugin-commonjs';
import uglify      from 'rollup-plugin-uglify'

export default {
    entry: 'aot/src/app/main.js',
    dest: 'dist/app.min.js',
    sourceMap: false,
    format: 'iife',
    plugins: [
        nodeResolve({jsnext: true, module: true}),
        commonjs({
            include: [
                'node_modules/ag-grid-ng2/**',
                'node_modules/rxjs/**'
            ]
        }),
        uglify()
    ]
}

