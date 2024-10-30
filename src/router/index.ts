import { createRouter, createWebHistory, createWebHashHistory, RouterOptions, Router } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
// console.log(generatedRoutes)

const options: RouterOptions = {
  history: (import.meta.env.VITE_APP_ROUTER_MODE === 'history') ? createWebHistory(import.meta.env.VITE_APP_BASE_URL) : createWebHashHistory(import.meta.env.VITE_APP_BASE_URL),
  routes: setupLayouts(generatedRoutes)
}

const router: Router = createRouter(options)

router.beforeEach(async (to, from) => {
  const apiUrl = import.meta.env.VITE_APP_API_BASE_URL
  const token = JSON.parse(localStorage.getItem('token') as string)

  if (to.meta.auth) {
    try {
      const response = await axios.get(`${apiUrl}profile`, { headers: { Authorization: token } })
    } catch (error) {
      // console.log('error', error.response)
      router.push('/')
    }
  }
})
export default router
