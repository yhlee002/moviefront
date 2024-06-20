<script setup>
import {useRouter} from "vue-router";

const router = useRouter();
const props = defineProps(['pages', 'page']);

const pages = props.pages; // total pages
const page = props.page; // current page

const showPages = [1, 2, 3, 4]; // pagenation show pages

function goPrevPage() {
  // if (page > 1) location.href = router.getRoutes();
  console.log('이전 페이지로 이동');
}

function goNextPage() {
  // if (page < pages) location.href = router.getRoutes();
  console.log('다음 페이지로 이동');
}
</script>

<template>
  <div class="pagenation-box">
    <div class="prev-button">
<!--      <img v-if="showPages[0] > 1" src="@/assets/images/icons/icons8-left-arrow-50.png" alt="이전 페이지">-->
<!--      <img v-if="showPages[0] === 1" src="@/assets/images/icons/icons8-left-arrow-50-gray.png" alt="이전 페이지">-->
      <button class="image-button" type="button" @click="goPrevPage()" :disabled="showPages[0] === 1"></button>
    </div>
    <div>
      <ul class="pagenation-page-list">
        <li :style="showPages[0] === 1 ? {'color': 'gray', 'cursor': 'default'} : {}">...</li>
        <li v-for="idx in showPages" :key="idx" :class="idx === page? 'current-page' : ''">{{ idx }}</li>
        <li v-if="showPages[showPages.length - 1] > 1">...</li>
      </ul>
    </div>
    <div class="next-button">
<!--      <img v-if="showPages[showPages.length - 1] < pages[pages.length - 1]"-->
<!--           src="@/assets/images/icons/icons8-right-arrow-50.png" alt="다음 페이지">-->
<!--      <img v-if="showPages[showPages.length - 1] >= pages[pages.length - 1]"-->
<!--           src="@/assets/images/icons/icons8-right-arrow-50-gray.png" alt="다음 페이지">-->
      <button class="image-button" type="button" @click="goNextPage()" :disabled="showPages[showPages.length - 1] >= pages[pages.length - 1]"></button>
    </div>
  </div>
</template>

<style scoped>
.pagenation-box {
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
}

.pagenation-box ul.pagenation-page-list > li {
  padding: 0 0.2rem;
  margin: 0 0.3rem;
  cursor: pointer;
}

.pagenation-box ul.pagenation-page-list > li.current-page {
  color: #2553a7;
  font-weight: bold;
}

.pagenation-box > .prev-button,
.pagenation-box > .next-button {
  width: 3rem;
  height: 1.8rem;
}

.pagenation-box > .prev-button > button,
.pagenation-box > .next-button > button {
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.pagenation-box > .prev-button > button {
  background-image: url("@/assets/images/icons/icons8-left-arrow-50.png");
}

.pagenation-box > .prev-button > button:disabled {
  background-image: url("@/assets/images/icons/icons8-left-arrow-50-gray.png");
}

.pagenation-box > .next-button > button {
  background-image: url("@/assets/images/icons/icons8-right-arrow-50.png");
}

.pagenation-box > .next-button > button:disabled {
  background-image: url("@/assets/images/icons/icons8-right-arrow-50-gray.png");
}

.pagenation-box .pagenation-page-list {
  display: flex;
  flex-direction: row;
}
</style>