<script setup>
import {useNoticeStore} from "@/stores/notice.js";
import ListComponent from "@/components/sub/ListComponent.vue";

const noticeStore = useNoticeStore();

noticeStore.getNotices(noticeStore.currentPage, 15, null);
// noticeStore.getTotalPages();
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
          <div style="display: flex; justify-content: space-between; margin-bottom: 2rem;">
            <button class="button-default submit" type="button">작성하기</button>
            <select>
              <option value="recent" selected>최신순</option>
              <option value="comment">댓글순</option>
              <option value="view">조회순</option>
            </select>
          </div>

          <!-- Board List -->
          <div>
            <ListComponent :list="noticeStore.boardList" :recommended="false"></ListComponent>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>