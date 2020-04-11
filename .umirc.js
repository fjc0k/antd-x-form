/** @type import('umi').IConfig */
module.exports = {
  title: 'antd-x-form',
  nodeModulesTransform: {
    type: 'none',
  },
  devtool: false,
  // chainWebpack: config => {
  //   if (process.env.NODE_ENV === 'development') {
  //     config.module
  //       .rule('js-in-node_modules')
  //       .exclude.add(/node_modules/)
  //       .end()
  //     config.module
  //       .rule('ts-in-node_modules')
  //       .exclude.add(/node_modules/)
  //       .end()
  //   }
  // },
}
