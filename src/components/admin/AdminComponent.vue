<script setup>
import {useUserStore} from '@/stores/user.js'
import {useNoticeStore} from "@/stores/notice";
import {useBoardStore} from "@/stores/board";
import {useMovieCommentStore} from "@/stores/moviecomments";
import {useCommentStore} from "@/stores/comment";

const userStore = useUserStore();
const noticeStore = useNoticeStore();
const boardStore = useBoardStore();
const movieCommentStore = useMovieCommentStore();
const commentStore = useCommentStore();

// userStore.getUsers(0, 10, null);
// noticeStore.getBoards(0, 10, null);
// boardStore.getBoards(0, 10, null);
// movieCommentStore.getComments(0, 10, null);
// commentStore.getComments(0, 10, null);
</script>

<template>
  <div style="display: flex; flex-direction: row;">

    <div style="display: flex; flex-direction: column">
      <!-- Notices -->
      <div style="display: flex; flex-direction: column">
        <div class="block-title" style="display: flex; justify-content: space-between; align-content: center;">
          <h3>공지사항 게시글 관리</h3>
          <small>더보기</small>
        </div>
        <div class="block-content">
          <!--        <ListComponent list="noticeStore.boardList"></ListComponent>-->
        </div>
      </div>

      <!-- Impression Boards -->
      <div style="display: flex; flex-direction: column">
        <div class="block-title" style="display: flex; justify-content: space-between; align-content: center;">
          <h3>감상 후기 게시글 관리</h3>
          <small>더보기</small>
        </div>
        <div class="block-content">
          <!--        <ListComponent list="boardStore.boardList"></ListComponent>-->
        </div>
      </div>
    </div>

    <div style="display: flex; flex-direction: column">
      <!-- Movie Comments -->
      <div style="display: flex; flex-direction: column">
        <div class="block-title" style="display: flex; justify-content: space-between; align-content: center;">
          <h3>영화 후기 관리</h3>
          <small>더보기</small>
        </div>
        <div class="block-content">
          <!--        <ListComponent list="movieCommentStore.boardList"></ListComponent>-->
        </div>
      </div>

      <!-- Impression Board Comments -->
      <div style="display: flex; flex-direction: column">
        <div class="block-title" style="display: flex; justify-content: space-between; align-content: center;">
          <h3>감상 후기 게시글 댓글 관리</h3>
          <small>더보기</small>
        </div>
        <div class="block-content">
          <!--        <ListComponent list="commentStore.boardList"></ListComponent>-->
        </div>
      </div>
    </div>

    <div style="display: flex; flex-direction: column">
      <div class="block-title" style="display: flex; justify-content: space-between; align-content: center;">
        <h3>회원 관리</h3>
        <small>더보기</small>
      </div>
      <div class="block-content">
        <!--        <ListComponent list="noticeStore.boardList"></ListComponent>-->
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>