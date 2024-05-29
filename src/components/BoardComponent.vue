<script setup>
import {useBoardStore} from '@/stores/board';
import ListComponent from "@/components/sub/ListComponent.vue";
import Pagenation from "@/components/sub/PagenationComponent.vue";
import {useRouter} from "vue-router";

const router = useRouter();
const boardStore = useBoardStore();

boardStore.getBoards(boardStore.currentPage, 15, null, null);

function enter() {
  if (window.event.keyCode === 13) {
    search(window.event.target.value);
  }
}

function search(condition, query) {

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

          <div style="display: flex; flex-direction: row; width: 100%; justify-content: space-between;">
            <div style="display: flex; width: 20%; height: 100%">
<!--              <div-->
<!--                  style="position: fixed; display: flex; flex-direction: column; justify-content: center; width: 15rem; border: 0.1rem solid #f2f2f2; border-radius: 1rem">-->
<!--                <div style="height: 100%">-->
<!--                  <h3>인기 감상글 Top 5</h3>-->
<!--                </div>-->
<!--                <ListComponent :list="boardStore.top5Boards" :field-show="false"></ListComponent>-->
<!--              </div>-->
            </div>

            <div class="board-vertical-line"></div>

            <!-- Board List -->
            <div id="boardList">
              <!-- Function Buttons -->
              <div class="board-options">
                <button class="button-default submit icon-button" type="button">
                  <img src="@/assets/images/icons/icons8-pencil-48.png" alt="작성하기">
                  작성하기
                </button>

                <!-- Search Bar -->
                <input id="boardSearchInput" @keydown="enter()" type="text" placeholder="...">

                <select>
                  <option value="recent" selected>최신순</option>
                  <option value="comment">댓글순</option>
                  <option value="view">조회순</option>
                </select>
              </div>

              <Pagenation :pages="boardStore.totalPages" :page="boardStore.currentPage"></Pagenation>

              <ListComponent :list="boardStore.boardList" :recommended="true"></ListComponent><!-- :sub-url="router." -->

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
  width: 30rem;
  min-width: 20rem;
  border: 0.1rem solid #000000;
  border-radius: 4rem;
  padding: 0 2rem;
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