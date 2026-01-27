const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,

  // Оптимизация сборки для разработки
  devServer: {
    // Отключаем overlay для ошибок - ускоряет разработку
    client: {
      overlay: {
        warnings: false,
        errors: true
      }
    }
  },

  // Отключаем source maps для продакшена (ускоряет сборку)
  productionSourceMap: false,

  // Оптимизация производительности
  configureWebpack: {
    // Увеличиваем лимит размера чанков (уменьшает количество предупреждений)
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },
    // Оптимизация для разработки
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // Выделяем vendor библиотеки в отдельный чанк
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10
          },
          // Swiper в отдельный чанк (большая библиотека)
          swiper: {
            test: /[\\/]node_modules[\\/]swiper[\\/]/,
            name: 'swiper',
            priority: 20
          }
        }
      }
    }
  },

  // Параллельная обработка для ускорения сборки
  parallel: require('os').cpus().length > 1,

  // Кеширование для ускорения повторных сборок
  cache: {
    type: 'filesystem',
    cacheDirectory: './node_modules/.cache/vue-cli'
  }
})
