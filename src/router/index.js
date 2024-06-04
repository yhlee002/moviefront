import { createRouter, createWebHistory } from 'vue-router'
import Admin from '@/components/admin/AdminComponent.vue'
import Preview from "@/components/PreviewComponent.vue";
import Main from "@/components/MainComponent.vue";
import SearchMovie from "@/components/SearchMovieComponent.vue";
import Notice from "@/components/NoticeComponent.vue";
import Board from "@/components/BoardComponent.vue";
import BoardItem from "@/components/BoardItemComponent.vue";
import User from "@/components/UserComponent.vue";
import SignIn from "@/components/SignInComponent.vue";
import SignUp from "@/components/SignUpComponent.vue";

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
          path: '/search',
          name: 'searchMovie',
          component: SearchMovie,
          props: route => ({ query: route.query.query })
        },
        {
          path: '/',
          name: 'preview',
          component: Preview
        },
        {
          path: '/notice',
          name: 'boardNotice',
          component: Notice
        },
        // {
        //   path: '/board',
        //   name: 'boardImp',
        //   component: Board,
        //   children: [
        //     {
        //       path: '/:id',
        //       name: 'singleBoardImp',
        //       component: BoardItem,
        //
        //     }
        //   ]
        // },
        {
          path: '/board',
          name: 'boardImp',
          component: Board,
        },
        {
          path: '/board/:id',
          name: 'singleBoardImp',
          component: BoardItem,
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
        },
        {
          path: '/sign-in',
          name: 'sign-in',
          component: SignIn
        },
        {
          path: '/sign-up',
          name: 'sign-up',
          component: SignUp
        }
      ]
    },
  ]
})

export default router
