module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'zh',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  },
  baseUrl: './',
  devServer: {
    disableHostCheck: true,
    proxy: {
      '/iciba': {
        target: 'http://dict-co.iciba.com',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/iciba': ''
        }
      },
      '/api': {
        target: 'http://www.api.zhuishushenqi.com',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/content': {
        target: 'http://chapter2.zhuishushenqi.com',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/content': ''
        }
      }
    }
  }
}
