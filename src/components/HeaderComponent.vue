<script setup>
import {storeToRefs} from 'pinia';
import {useUserStore} from '@/stores/user';

const userStore = useUserStore();


</script>

<template>
  <!-- Header -->
  <header id="header">
    <div class="logo"><a href="/"><span id="siteName">Movie Site</span></a></div>


    <!-- Nav -->
    <nav class="nav">
      <!-- Menu -->
      <ul class="menus">
        <li v-if="userStore.isAdmin"><a href="/admin">관리자 페이지</a></li>
        <li><a href="/notice">공지사항</a></li>
        <li><a href="/board">감상 후기</a></li>
        <li><a href="/contact">고객지원</a></li>
      </ul>
      <!-- User Info -->
      <div class="user-box">
        <div class="user-image-box" v-if="!userStore.isAuthenticated">
          <img class="profile_image" src="@/assets/images/test-account-96.png" alt="user profile image">
          <span><a href="/sign-in">로그인</a></span>
        </div>

        <div class="user-image-box" v-if="userStore.isAuthenticated">
          <!-- profile image -->
          <img class="profile_image" v-if="userStore.profileImage != null"
               :src="userStore.profileImage" alt="user profile image"/>
          <img class="profile_image" v-if="!userStore.profileImage"
               src="@/assets/images/test-account-96.png" alt="user profile image">


          <span class="userbox-text" v-if="userStore.user != null">{{ userStore.name }}님 반갑습니다.</span>
          <br>
          <span class="userbox-text">
            <a v-if="userStore.isAuthenticated" href="/mypage" style="margin-right: 3px">내정보</a>
        </span>
          <span>
          <a href="#" @click="document.getElementById('logout').submit();">로그아웃</a>
        </span>
          &nbsp;
          <form id="logout" action="/logout" method="POST"></form>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>

</style>