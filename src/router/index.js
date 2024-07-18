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
                    path: '/admin/users',
                    name: 'users',
                    component: AdminUser,
                    props: route => ({page: route.query.page})
                },
                {
                    path: '/admin/users/:id',
                    name: 'userDetail',
                    component: AdminUserDetailContainer,
                    // props: true
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
                    path: '/notices',
                    name: 'notices',
                    component: Notice,
                    props: route => ({page: route.query.page})
                },
                {
                    path: '/notices/:id',
                    name: 'noticeDetail',
                    component: BoardItem,
                    props: {category: 'notices'} // true
                },
                {
                    path: '/boards',
                    name: 'boards',
                    component: Board,
                    props: route => ({page: route.query.page})
                },
                {
                    path: '/boards/:id',
                    name: 'boardDetail',
                    component: BoardItem,
                    props: {category: 'boards'}
                },
                {
                    path: '/newpost',
                    name: 'editor',
                    component: Editor,
                    props: route => ({id: route.query.id, category: route.query.category})
                },
                {
                    path: '/users/:id',
                    name: 'userPopup',
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
