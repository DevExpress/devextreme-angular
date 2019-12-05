var webpack = require('webpack');
var path = require('path');

module.exports = {
    devtool: 'inline-source-map',

    plugins: [
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)(@angular|esm5)/,
            path.join(__dirname, '../tests'),
            {} 
        )
    ],
    resolve: {
        alias: {
          'devextreme-angular': path.resolve(__dirname, 'npm/dist')
        }
      }
};
