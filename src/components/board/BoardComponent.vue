<script setup>
import {useBoardStore} from '@/stores/board.js';
import ListComponent from "@/components/sub/ListComponent.vue";
import Pagenation from "@/components/sub/PagenationComponent.vue";
import {useRouter} from "vue-router";
import {ref, watch} from "vue";

const router = useRouter();
const boardStore = useBoardStore();

boardStore.getBoards(boardStore.currentPage, 15, null, null);
boardStore.getWeeklyRecommendedTopBoards(5);
boardStore.getWeeklyViewTopBoards(5);

const condition = ref("recent");

watch(condition, (newVal) => {
  if (newVal === 'recent') {
    boardStore.getBoards(boardStore.currentPage, 15, null, null)
  } else {
    boardStore.getBoards(boardStore.currentPage, 15, null, newVal);
  }
})

function enter() {
  if (window.event.keyCode === 13) {
    search(window.event.target.value);
  }
}

function search(condition, query) {

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
                <div style="height: 100%">
                  <h4>주간 추천수 Top 5</h4>
                </div>

                <small v-if="boardStore.mostPopularBoards.length === 0">
                  일주일내에 작성된 게시글이 존재하지 않습니다.
                </small>
                <div v-if="boardStore.mostPopularBoards.length > 0">
                  <ListComponent :list="boardStore.mostPopularBoards"
                                 :field-show="false" category="board"
                                 :subTitleShow="false"></ListComponent>
                </div>

              </div>

              <div class="board-side-block-item">
                <div style="height: 100%">
                  <h4>주간 조회수 Top 5</h4>
                </div>
                <small v-if="boardStore.mostSeenBoards.length === 0">
                  일주일내에 작성된 게시글이 존재하지 않습니다.
                </small>
                <div v-if="boardStore.mostSeenBoards.length === 0">
                  <ListComponent :list="boardStore.mostSeenBoards"
                               :field-show="false" category="board"
                               :subTitleShow="false"></ListComponent>
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
                <input id="boardSearchInput" @keydown="enter()" type="text" placeholder="...">

                <select v-model="condition">
                  <option value="recent" selected>최신순</option>
                  <option value="recommended">추천순</option>
                  <option value="comments">댓글순</option>
                  <option value="views">조회순</option>
                </select>
              </div>

              <div class="block-horizontal-line"></div>

              <!--              <Pagenation :pages="boardStore.totalPages" :page="boardStore.currentPage"></Pagenation>-->

              <ListComponent category="board" :list="boardStore.listItems" :recommended="true"></ListComponent>
              <!-- :sub-url="router." -->

              <Pagenation :pages="boardStore.totalPages" :page="boardStore.currentPage"></Pagenation>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#boardList {
  width: 80%;
  margin-left: 2rem;
}

#boardSearchInput {
  height: 2rem;
  border: 0.1rem solid #000000;
  border-radius: 4rem;
  padding: 0 2rem;
}

.board-main-block {
  display: flex;
  justify-content: space-between;
}

.board-side-block {
  display: flex;
  flex-direction: column;
}

.board-side-block .board-side-block-item {
  /* position: fixed; */
  display: flex;
  flex-direction: column;
  width: 10rem;
  margin-bottom: 2rem;
  min-height: 4rem;
}

@media (min-width: 1024px) {
  #boardSearchInput {
    width: 30rem;
    min-width: 20rem;
  }

  .board-main-block {
    flex-direction: row;
    width: 100%;
  }

  .board-side-block {
    width: 20%;
    height: 100%;
    max-width: 167px;
  }
}

@media (max-width: 1023px) {
  /* min-width: 536px */
  #boardSearchInput {
    width: 50%;
    min-width: 6rem;
  }

  .board-main-block {
    flex-direction: column;
    width: 100%;
  }

  .board-side-block {
    display: flex;
    width: 100%;
    height: 100%;
    min-width: 167px;
  }
}

.board-vertical-line {
  margin: 0 1rem;
  border-right: 0.1rem solid #f2f2f2
}

.board-options {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 1rem;
  border-bottom: 0.1rem solid #f2f2f2;
  margin-bottom: 1rem;
}

.board-options > button {
  /*width: fit-content;*/
  min-width: fit-content;
  margin-right: 1rem;
}

.board-options > select {
  /*width: fit-content;*/
  min-width: fit-content;
  margin-left: 1rem;
}

</style>