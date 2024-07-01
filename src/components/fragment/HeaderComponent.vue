<script setup>
import {useUserStore} from '@/stores/user.js';
import Logo from "@/components/fragment/LogoComponent.vue";

const userStore = useUserStore();
userStore.getUser();

const logoutUrl = `http://${import.meta.env.VITE_APP_HOST}:8080/api/members/logout`;

async function logout() {
  // const result = await userStore.logout();
  const form = document.getElementById('logout');
  form.submit();
}
</script>

<template>
  <!-- Header -->
  <header id="header">
    <div id="header-main">
      <Logo></Logo>

      <!-- Nav -->
      <nav class="nav">
        <!-- Menu -->
        <ul class="menus">
          <li v-if="userStore.isAdmin">
            <router-link to="/admin">관리자 페이지</router-link>
          </li>
          <li>
            <router-link to="/notice">공지사항</router-link>
          </li>
          <li>
            <router-link to="/board">감상 후기</router-link>
          </li>
        </ul>
        <!-- User Info -->
        <div class="user-box">
          <div class="user-image-box" v-if="!userStore.isAuthenticated">
            <img class="profile_image" src="@/assets/images/test-account-96.png" alt="user profile image">
            <span><router-link to="/sign-in">로그인</router-link></span>
          </div>

          <div class="user-image-box" v-if="userStore.isAuthenticated">
            <!-- profile image -->
            <img class="profile_image" v-if="userStore.profileImage"
                 :src="userStore.profileImage" alt="user profile image"/>
            <div class="profile_image user_no_image" v-if="!userStore.profileImage && !userStore.isAdmin"></div>
            <div class="profile_image admin_no_image" v-if="!userStore.profileImage && userStore.isAdmin"></div>
            <span class="userbox-text" v-if="userStore.user != null">{{ userStore.user.name }}
          <span v-if="userStore.user.role ==='ROLE_ADMIN'" style="color: #c6c6c6; font-size: 0.8rem">(관리자)</span>
          </span>
            <br>
            <span class="userbox-text">
            <router-link to="/mypage" v-if="userStore.isAuthenticated" style="margin-right: 3px">내정보</router-link>
        </span>
        <span>
          <p style="cursor: pointer;" @click="logout()">로그아웃</p>
        </span>
            <form id="logout" :action="logoutUrl" method="POST"></form>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>

</style>