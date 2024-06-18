<script setup>
import {useNoticeStore} from "@/stores/notice.js";
import ListComponent from "@/components/sub/ListComponent.vue";
import {useRouter} from "vue-router";
import {useUserStore} from "@/stores/user.js";

const router = useRouter();
const userStore = useUserStore();
const noticeStore = useNoticeStore();

noticeStore.getBoards(noticeStore.currentPage, 15, null);

// noticeStore.getTotalPages();

function writeNewPost() {
  router.push("/newpost?category=notice");
}
</script>

<template>
  <div id="index_board" class="wrapper-block">
    <div class="inner">
      <div class="inner-block">
        <div class="content">
          <div class="block-title-box">
            <h2 class="block-title">공지사항</h2>
          </div>

          <!-- Function Buttons -->
          <div style="display: flex; margin-bottom: 2rem;" :style="userStore.isAdmin ? {'justify-content': 'space-between'} : {'justify-content': 'end'}">
            <button class="button-default submit" type="button" @click="writeNewPost" v-show="userStore.isAdmin">작성하기</button>
            <select>
              <option value="recent" selected>최신순</option>
              <option value="comment">댓글순</option>
              <option value="view">조회순</option>
            </select>
          </div>

          <div class="block-horizontal-line"></div>

          <!-- Board List -->
          <div>
            <ListComponent category="notice" :list="noticeStore.boardList" :recommended="false"></ListComponent>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>