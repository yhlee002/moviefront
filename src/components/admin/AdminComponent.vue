<script setup>
import {useUserStore} from '@/stores/user.js'
import {useNoticeStore} from "@/stores/notice.js";
import {useBoardStore} from "@/stores/board.js";
import {useMovieCommentStore} from "@/stores/moviecomments.js";
import {useCommentStore} from "@/stores/comment.js";
import ListComponent from "@/components/sub/ListComponent.vue";

const userStore = useUserStore();
const noticeStore = useNoticeStore();
const boardStore = useBoardStore();
const movieCommentStore = useMovieCommentStore();
const commentStore = useCommentStore();

userStore.getUsers(1, 10, null);
noticeStore.getBoards(1, 10, null);
boardStore.getBoards(1, 10, null);
movieCommentStore.getComments(1, 10, null);
commentStore.getComments(1, 10, null);
</script>

<template>
  <div id="adminPanel">

    <div class="admin-panel-block-1">
      <!-- Notices -->
      <div class="admin-panel-block-2">
        <div class="block-title" style="display: flex; justify-content: space-between; align-content: center;">
          <h3>공지사항 게시글 관리</h3>
          <small><router-link to="/admin/notice">더보기</router-link></small>
        </div>
        <div class="block-content">
          <ListComponent :list="noticeStore.listItems" :field-show="false" category="notice"
                         :comment="false"></ListComponent>
        </div>
      </div>

      <!-- Impression Boards -->
      <div class="admin-panel-block-2">
        <div class="block-title">
          <h3>감상 후기 게시글 관리</h3>
          <small><router-link to="/admin/board">더보기</router-link></small>
        </div>
        <div class="block-content">
          <ListComponent :list="boardStore.listItems" :field-show="false" category="board"></ListComponent>
        </div>
      </div>
    </div>

    <div class="admin-panel-seperate-line"></div>

    <div class="admin-panel-block-1">
      <!-- Movie Comments -->
      <div class="admin-panel-block-2">
        <div class="block-title">
          <h3>영화 후기 관리</h3>
          <small><router-link to="/admin/movie-comment">더보기</router-link></small>
        </div>
        <div class="block-content">
          <ListComponent :list="movieCommentStore.listItems" :field-show="false" category="movie" seq-field="movieCd"></ListComponent>
        </div>
      </div>

      <!-- Impression Board Comments -->
      <div class="admin-panel-block-2">
        <div class="block-title">
          <h3>감상 후기 게시글 댓글 관리</h3>
          <small><router-link to="/admin/imp-comment">더보기</router-link></small>
        </div>
        <div class="block-content">
          <ListComponent :list="commentStore.listItems" :field-show="false" :view="false" :comment="false" category="board" seq-field="boardId"></ListComponent>
        </div>
      </div>
    </div>

    <div class="admin-panel-seperate-line"></div>

    <div class="admin-panel-block-1">
      <div class="admin-panel-block-2">
        <div class="block-title">
          <h3>회원 관리</h3>
          <small><router-link to="/admin/user">더보기</router-link></small>
        </div>
        <div class="block-content">
          <ListComponent :list="userStore.listItems" :field-show="false" :view="false" :comment="false" category="user" seq-field="memNo"></ListComponent>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#adminPanel {
  display: flex;
  flex-direction: row;
  padding-left: 4rem;
  padding-right: 4rem;
}

#adminPanel .admin-panel-seperate-line {
  width: 100%;
  border-right: 1px solid #f2f2f2;
  margin: 0 2em;
}

#adminPanel .admin-panel-block-1 {
  display: flex;
  flex-direction: column;
}

#adminPanel .admin-panel-block-2 {
  display: flex;
  flex-direction: column;
}

#adminPanel .block-title {
  display: flex;
  justify-content: space-between;
  align-content: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

#adminPanel .block-content {
  width: 340px;
  height: 350px;
  overflow: hidden;
}
</style>