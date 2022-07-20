import { createApp } from 'vue'
import { setupAssets } from './plugins'
// import { setupRouter } from './router'
import App from './App.vue'

async function setupApp() {
  // import assets: js、css
  setupAssets()

  const app = createApp(App)

  // vue router
  // await setupRouter(app)

  // mount app
  app.mount('#app')
}

setupApp()
