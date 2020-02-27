const postcss = require('rollup-plugin-postcss');
const scss = require('rollup-plugin-scss');

module.exports = {
  rollup(config, options) {
    config.plugins.push(
      // TODO: fix
      scss({
        sourceMapEmbed: true,
      }),
      postcss({
        modules: true,
        plugins: [],
        inject: false,
        // only write out CSS for the first bundle (avoids pointless extra files):
        extract: !!options.writeMeta,
      })
    );
    return config;
  },
};
