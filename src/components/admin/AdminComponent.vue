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
          <small>
            <router-link to="/admin/notices">더보기</router-link>
          </small>
        </div>
        <div class="block-content">
          <ListComponent :list="noticeStore.listItems" :field-show="false" category="notices"
                         :comment="false"></ListComponent>
        </div>
      </div>

      <!-- Impression Boards -->
      <div class="admin-panel-block-2">
        <div class="block-title">
          <h3>감상 후기 게시글 관리</h3>
          <small>
            <router-link to="/admin/board">더보기</router-link>
          </small>
        </div>
        <div class="block-content">
          <ListComponent :list="boardStore.listItems" :field-show="false" category="boards"></ListComponent>
        </div>
      </div>
    </div>

    <div class="admin-panel-seperate-line"></div>

    <div class="admin-panel-block-1">
      <!-- Movie Comments -->
      <div class="admin-panel-block-2">
        <div class="block-title">
          <h3>영화 후기 관리</h3>
          <small>
            <router-link to="/admin/movie-comment">더보기</router-link>
          </small>
        </div>
        <div class="block-content">
          <ListComponent :list="movieCommentStore.listItems" :field-show="false" category="movies" seq-field="movieCd"></ListComponent>
        </div>
      </div>

      <!-- Impression Board Comments -->
      <div class="admin-panel-block-2">
        <div class="block-title">
          <h3>감상 후기 게시글 댓글 관리</h3>
          <small>
            <router-link to="/admin/imp-comment">더보기</router-link>
          </small>
        </div>
        <div class="block-content">
          <ListComponent :list="commentStore.listItems" :field-show="false" :view="false" :comment="false"
                         category="boards" seq-field="boardId"></ListComponent>
        </div>
      </div>
    </div>

    <div class="admin-panel-seperate-line"></div>

    <div class="admin-panel-block-1">
      <div class="admin-panel-block-2">
        <div class="block-title">
          <h3>회원 관리</h3>
          <small>
            <router-link to="/admin/users">더보기</router-link>
          </small>
        </div>
        <div class="block-content">
          <ListComponent :list="userStore.listItems" :field-show="false" :view="false" :comment="false" category="admin/users"
                         seq-field="memNo"></ListComponent>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#adminPanel {
  display: flex;
}

#adminPanel .admin-panel-block-1 {
  display: flex;
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
  height: 350px;
  overflow: hidden;
  //background-color: rgb(181 166 149 / 33%);
  border-radius: 1rem;
}

@media (min-width: 1290px) {
  #adminPanel {
    flex-direction: row;
    padding-left: 4rem;
    padding-right: 4rem;
  }

  #adminPanel .admin-panel-seperate-line {
    width: 100%;
    border-right: 1px solid #f2f2f2;
    margin: 0 2rem;
  }

  #adminPanel .admin-panel-block-1 {
    flex-direction: column;
  }

  #adminPanel .block-content {
    width: 340px;
  }
}

@media (max-width: 1289px) {
  #adminPanel {
    flex-direction: column;
    padding-left: 2rem;
    padding-right: 2rem;
  }

  #adminPanel .admin-panel-seperate-line {
    height: 100%;
    border-bottom: 1px solid #f2f2f2;
    margin: 2rem 0;
  }

  #adminPanel .admin-panel-block-1 {
    flex-direction: row;
    justify-content: space-between;
  }

  #adminPanel .block-content {
    width: 500px;
  }
}

@media(max-width: 1100px) {
  #adminPanel .admin-panel-block-1 {
    flex-direction: column;
  }

  #adminPanel .admin-panel-block-2 {
    margin-bottom: 1rem;
  }

  #adminPanel .block-content {
    width: 100%;
    height: fit-content;
  }
}
</style>