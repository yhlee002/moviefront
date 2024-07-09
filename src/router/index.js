import {createRouter, createWebHistory} from 'vue-router'
import Admin from '@/components/admin/AdminComponent.vue'
import Preview from "@/components/PreviewComponent.vue";
import Main from "@/components/MainComponent.vue";
import SearchMovie from "@/components/SearchMovieComponent.vue";
import Notice from "@/components/board/NoticeComponent.vue";
import BoardItem from "@/components/board/BoardItemComponent.vue";
import Board from "@/components/board/BoardComponent.vue";
import User from "@/components/UserComponent.vue";
import SignIn from "@/components/login/SignInComponent.vue";
import SignUp from "@/components/login/SignUpComponent.vue";
import Editor from "@/components/board/EditorComponent.vue";
import UserProfile from "@/components/UserProfileComponent.vue";
import AdminUser from "@/components/admin/AdminUserComponent.vue";
import AdminUserDetail from "@/components/admin/AdminUserDetailComponent.vue";
import AdminUserLoginLogs from "@/components/admin/AdminUserLoginLogsComponent.vue";
import AdminUserDetailContainer from "@/components/admin/AdminUserDetailContainer.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'main',
            component: Main,
            children: [
                {
                    path: '/admin',
                    name: 'admin',
                    component: Admin,
                    children: []
                },
                {
                    path: '/admin/user',
                    name: 'userList',
                    component: AdminUser,
                },
                {
                    path: '/admin/user/:id',
                    component: AdminUserDetailContainer,
                },
                {
                    path: '/search',
                    name: 'searchMovie',
                    component: SearchMovie,
                    props: route => ({query: route.query.query})
                },
                {
                    path: '/',
                    name: 'preview',
                    component: Preview
                },
                {
                    path: '/notice',
                    name: 'boardNotice',
                    component: Notice,
                    props: route => ({page: route.query.page})
                },
                {
                    path: '/notice/:id',
                    name: 'singleBoardNotice',
                    component: BoardItem,
                    props: {category: 'notice'} // true
                },
                {
                    path: '/board',
                    name: 'boardImp',
                    component: Board,
                    props: route => ({page: route.query.page})
                },
                {
                    path: '/board/:id',
                    name: 'singleBoardImp',
                    component: BoardItem,
                    props: {category: 'board'}
                },
                {
                    path: '/newpost',
                    name: 'editor',
                    component: Editor,
                    props: route => ({id: route.query.id, category: route.query.category})
                },
                {
                    path: '/user/:id',
                    name: 'user',
                    component: User,
                    props: true
                },
                {
                    path: '/sign-in',
                    name: 'sign-in',
                    component: SignIn,
                },
                {
                    path: '/sign-up',
                    name: 'sign-up',
                    component: SignUp,
                    props: route => ({type: route.query.type})
                },
                {
                    path: '/mypage',
                    name: 'mypage',
                    component: UserProfile
                }
            ]
        },
    ]
})

export default router
