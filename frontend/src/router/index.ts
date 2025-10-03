import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        breadcrumb: 'Главная'
      }
    },
    {
      path: '/tasks',
      name: 'Task',
      component: () => import('@/views/TasksView.vue'),
      meta: {
        breadcrumb: 'Задания'
      }
    },
    {
      path: '/tasks/new',
      name: 'TaskCreate',
      component: () => import('@/views/TaskFormView.vue'),
      props: { mode: 'create' },
      meta: {
        breadcrumb: 'Создание задания'
      }
    },
    {
      path: '/tasks/:id/edit',
      name: 'TaskEdit',
      component: () => import('@/views/TaskFormView.vue'),
      props: { mode: 'edit' },
      meta: {
        breadcrumb: 'Редактирование задания'
      }
    },
    {
      path: '/tasks/:id',
      name: 'TaskView',
      component: () => import('@/views/TaskFormView.vue'),
      props: { mode: 'view' },
      meta: {
        breadcrumb: 'Просмотр задания'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
})

export default router
