
/*
  .babelrc is also need on the browser side for parcel to work
*/

process.env.NODE_ENV = 'production';

require('babel-register')({

  presets: [
    [ require.resolve('babel-preset-env'), { targets: { node: 'current' } } ],
    require.resolve('babel-preset-stage-2')
  ],

  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: [ './' ],
        alias: {
          '/lib': './src/lib',
          '/client': './src/client',
          '/public': './public',
          '/server': './src/server'
        },
      }
    ]
  ]

});

require('./src/server/index.js');
