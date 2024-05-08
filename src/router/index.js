import { createRouter, createWebHistory } from 'vue-router'
import Admin from '@/components/AdminComponent.vue'
import Main from "@/components/MainComponent.vue";
import Notice from "@/components/NoticeComponent.vue";
import Board from "@/components/BoardComponent.vue";
import User from "@/components/UserComponent.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/admin',
      name: 'admin',
      component: Admin
    },
    {
      path: '/',
      name: 'main',
      component: Main,
      children: [
        {
          path: '/notice',
          name: 'boardNotice',
          component: Notice
        },
        {
          path: '/board',
          name: 'boardImp',
          component: Board
        },
        {
          path: '/user/:id',
          name: 'user',
          component: User,
          // children: [
          //   {
          //     path: '/profile',
          //     component: UserProfile
          //   },
          //   {
          //     path: '/board',
          //     component: Board
          //   },
          //   {
          //     path: '/comment',
          //     component: Comment
          //   }
          // ]
        }
      ]
    },
  ]
})

export default router
