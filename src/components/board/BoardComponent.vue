<script setup>
import '@/assets/css/board.css'

import {useBoardStore} from '@/stores/board.js';
import ListComponent from "@/components/sub/ListComponent.vue";
import Pagenation from "@/components/sub/PagenationComponent.vue";
import {useRouter} from "vue-router";
import {ref, watch} from "vue";


const router = useRouter();
const boardStore = useBoardStore();

await boardStore.getBoards(boardStore.currentPage, 15, null, null);
await boardStore.getWeeklyRecommendedTopBoards(5);
await boardStore.getWeeklyViewTopBoards(5);

const query = ref("");
const condition = ref("titleOrContent");
const orderBy = ref("recent");

watch(orderBy, async (newVal) => {
  if (newVal === 'recent') {
    await boardStore.getBoards(boardStore.currentPage, 15, null, null)
  } else {
    await boardStore.getBoards(boardStore.currentPage, 15, null, null, newVal);
  }

  query.value = "";
  condition.value = "titleOrContent";
});

function enter() {
  if (window.event.keyCode === 13) {
    search(window.event.target.value);
  }
}

async function search(query) {
  // const condition = document.getElementById('boardSearchConditionSelect').value;
  orderBy.value = "recent";
  await boardStore.getBoards(1, 15, query, condition.value);
}

function writeNewPost() {
  router.push("/newpost?category=board");
}
</script>

<template>
  <div id="index_board" class="wrapper-block">
    <div class="inner">
      <div class="inner-block">
        <div class="content">
          <div class="block-title-box">
            <h2 class="block-title">감상 후기</h2>
          </div>

          <div class="board-main-block">
            <div class="board-side-block">
              <div class="board-side-block-item">
                <div class="board-side-block-item-title">
                  <h4>주간 추천수 Top 5</h4>
                </div>

                <small v-if="boardStore.mostPopularBoards.length === 0">
                  일주일내에 작성된 게시글이 존재하지 않습니다.
                </small>
                <div v-if="boardStore.mostPopularBoards.length > 0">
                  <ListComponent :list="boardStore.mostPopularBoards"
                                 :field-show="false" category="board"
                                 :subTitleShow="false" :recommended="false" :view="false"
                                 :comment="false"></ListComponent>
                </div>

              </div>

              <div class="board-side-block-item">
                <div class="board-side-block-item-title">
                  <h4>주간 조회수 Top 5</h4>
                </div>
                <small v-if="boardStore.mostSeenBoards.length === 0">
                  일주일내에 작성된 게시글이 존재하지 않습니다.
                </small>
                <div v-if="boardStore.mostSeenBoards.length > 0">
                  <ListComponent :list="boardStore.mostSeenBoards"
                                 :field-show="false" category="board"
                                 :subTitleShow="false" :recommended="false" :view="false"
                                 :comment="false"></ListComponent>
                </div>
              </div>
            </div>

            <div class="board-vertical-line"></div>

            <!-- Board List -->
            <div id="boardList">
              <!-- Function Buttons -->
              <div class="board-options">
                <button class="button-default submit icon-button" type="button" @click="writeNewPost">
                  <img src="@/assets/images/icons/icons8-pencil-48.png" alt="작성하기">
                  작성하기
                </button>

                <!-- Search Bar -->
                <select id="boardSearchConditionSelect" v-model="condition">
                  <option value="titleOrContent" selected>제목 또는 내용</option>
                  <option value="writerName">작성자</option>
                </select>
                <input id="boardSearchInput" v-model="query" @keydown="enter()" type="text" placeholder="검색">

                <select v-model="orderBy">
                  <option value="recent" selected>최신순</option>
                  <option value="recommended">추천순</option>
                  <option value="comments">댓글순</option>
                  <option value="views">조회순</option>
                </select>
              </div>

              <div class="block-horizontal-line"></div>

              <ListComponent category="board" :list="boardStore.listItems" :recommended="true"></ListComponent>
              <Pagenation :pages="boardStore.totalPages" :page="boardStore.currentPage"></Pagenation>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>