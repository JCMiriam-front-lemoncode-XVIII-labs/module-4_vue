import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'weekly-plan',
    component: () => import('@/features/meal-plan/views/WeeklyPlanView.vue'),
    meta: { title: 'Plan semanal' },
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import('@/features/favorites/views/FavoritesView.vue'),
    meta: { title: 'Platos favoritos' },
  },
  {
    path: '/meals/new',
    name: 'meal-create',
    component: () => import('@/features/meal-plan/views/MealDetailView.vue'),
    meta: { title: 'Añadir comida' },
  },
  {
    path: '/meals/:id',
    name: 'meal-detail',
    component: () => import('@/features/meal-plan/views/MealDetailView.vue'),
    meta: { title: 'Detalle del plato' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/common/views/NotFoundView.vue'),
    meta: { title: 'Página no encontrada' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  const pageTitle = typeof to.meta.title === 'string' ? to.meta.title : undefined
  document.title = pageTitle ? `${pageTitle} · Meal Planner` : 'Meal Planner'
})

export default router
