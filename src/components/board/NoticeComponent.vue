<script setup>
import '@/assets/css/board.css'

import {useNoticeStore} from "@/stores/notice.js";
import ListComponent from "@/components/sub/ListComponent.vue";
import {useRouter} from "vue-router";
import {useUserStore} from "@/stores/user.js";
import {ref, watch} from "vue";
import Pagenation from "@/components/sub/PagenationComponent.vue";
import {useBoardStore} from "@/stores/board.js";

const props = defineProps(['page']);

const router = useRouter();
const userStore = useUserStore();
const noticeStore = useNoticeStore();

const renderCnt = ref(0);
const query = ref("");
const condition = ref("titleOrContent");
const orderBy = ref("recent");

if (props.page) {
  noticeStore.currentPage = props.page;
} else {
  noticeStore.currentPage = 1;
}

watch(() => props.page, async (newVal, oldVal) => {
  if (newVal) {
    noticeStore.currentPage = newVal;
  } else {
    noticeStore.currentPage = 1;
  }

  await noticeStore.getBoards(noticeStore.currentPage, 10, null, null);
});

await noticeStore.getBoards(noticeStore.currentPage, 10, null, null);

watch(orderBy, (newVal) => {
    noticeStore.getBoards(noticeStore.currentPage, 10, null, newVal);

  query.value = "";
  condition.value = "titleOrContent";
});

function enter() {
  if (window.event.keyCode === 13) {
    search(window.event.target.value);
  }
}

async function search(query) {
  await noticeStore.getBoards(1, 10, query, condition.value);
}

function writeNewPost() {
  router.push("/newpost?category=notices");
}
</script>

<template>
  <div id="index_notice" class="wrapper-block">
    <div class="inner">
      <div class="inner-block">
        <div class="content">
          <div class="block-title-box">
            <h2 class="block-title">공지사항</h2>
          </div>

          <div class="board-main-block">
            <div id="noticeList">
              <div class="board-options">
                <button class="button-default submit icon-button" type="button" @click="writeNewPost" v-show="userStore.isAdmin">
                  <img src="@/assets/images/icons/icons8-pencil-48.png" alt="작성하기">
                  작성하기</button>

                <div style="display: flex;">
                  <select id="noticeSearchConditionSelect" v-model="condition">
                    <option value="titleOrContent" selected>제목 또는 내용</option>
                    <option value="writerName">작성자</option>
                  </select>
                  <input id="noticeSearchInput" v-model="query" @keydown="enter()" type="text" placeholder="검색">
                </div>

                <select v-model="orderBy">
                  <option value="recent" selected>최신순</option>
                  <option value="views">조회순</option>
                </select>
              </div>

<!--              <div class="block-horizontal-line"></div>-->

              <ListComponent category="notices" :list="noticeStore.listItems" :key="renderCnt"
                             :comment="false" :recommended="false"></ListComponent>
              <Pagenation category="notices" :pages="noticeStore.totalPages" :page="noticeStore.currentPage"></Pagenation>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>