import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
router.afterEach((to, from, next) => {
    window.scrollTo(0, 0);
})
const app = createApp(App)


app.use(createPinia())
app.use(router)

app.mount('#app')
