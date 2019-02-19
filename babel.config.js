module.exports = {
  presets: [['@babel/preset-env', { targets: 'Firefox ESR', modules: false }]],
  plugins: [['@babel/plugin-transform-react-jsx', { pragma: 'h' }]],
};
