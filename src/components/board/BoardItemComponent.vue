<script setup>
import {useRouter} from "vue-router";
import {useUserStore} from "@/stores/user.js";
import VueSimpleAlert from "vue3-simple-alert";
import {useNoticeStore} from "@/stores/notice.js";
import UserCard from "@/components/sub/UserCardComponent.vue";
import {useBoardStore} from "@/stores/board.js";

import CommentItem from "@/components/sub/CommentItemComponent.vue";
import {useCommentStore} from "@/stores/comment.js";
import {ref} from "vue";

const props = defineProps(['category']);
const router = useRouter();
const id = router.currentRoute.value.params.id;

const userStore = useUserStore();
const commentStore = useCommentStore();
const store = props.category === 'notice' ? useNoticeStore() : props.category === 'board' ? useBoardStore() : null;

await store.getBoard(id);
const board = store.currentBoard;

const regDate = new Date(board.regDate);
const now = new Date();

let writeTime
const millisecond = now - regDate;
if (millisecond / 1000 < 60) {
  writeTime = Math.floor(millisecond / 1000) + '초'; // n초

} else if (millisecond / (60 * 1000) < 60) {
  writeTime = Math.floor(millisecond / (60 * 1000)) + '분';
} else if (millisecond / (60 * 60 * 1000) < 24) {
  writeTime = Math.floor(millisecond / (60 * 60 * 1000)) + '시간';
} else if (millisecond / (24 * 60 * 60 * 1000) < 30) {
  writeTime = Math.floor(millisecond / (24 * 60 * 60 * 1000)) + '일';
} else if (millisecond / (30 * 24 * 60 * 60 * 1000) < 365) {
  writeTime = Math.floor(millisecond / (30 * 24 * 60 * 60 * 1000)) + '달';
} else if (millisecond / (365 * 30 * 24 * 60 * 60 * 1000) < 365) {
  writeTime = Math.floor(millisecond / (30 * 24 * 60 * 60 * 1000)) + '년';
}
writeTime += '전';

// get comments
await commentStore.getCommentImpsByBoard(board.id, commentStore.currentPage);

async function submitComment() {
  const value = document.getElementById('commentInput').value;
  if (value) {
    const result = await commentStore.saveCommentImp(board.id, userStore.user.memNo, value);
    if (result.data) {
      await commentStore.getCommentImpsByBoard(board.id, commentStore.currentPage, 20);
    }
  } else {
    VueSimpleAlert.alert("댓글 내용을 입력해주세요.");
  }
}

async function modifyBoard() {
  router.push(`/newpost?id=${board.id}&category=${props.category}`);
}

function deleteBoard() {
  VueSimpleAlert.confirm("정말 삭제하시겠습니까?")
      .then(async result => {
        if (result) {
          await store.deleteBoard(board.id);
          router.push('/notice')
        }
      })
}

async function go(path) {
  // await router.push(path);
  location.href = path; // re-rendering을 위해 사용
}
</script>

<template>
  <div id="index_boarditem" class="wrapper-block">
    <div class="inner">
      <div class="inner-block">
        <div class="content">
          <div class="breadcrumb">
            <!--            <div class="breadcrumb-line breadcrumb-line-1"></div>-->
            <span class="breadcrumb-item">
              <router-link v-if="props.category === 'notice'" to="/notice">공지사항</router-link>
              <router-link v-if="props.category === 'board'" to="/board">감상 후기</router-link>
            </span>
            <div class="breadcrumb-line breadcrumb-line-2"></div>
          </div>

          <!-- Board -->
          <div class="board-box">
            <div class="board-datas">
              <UserCard
                  :member="{memNo: board.writerId, name: board.writerName, profileImage: board.writerProfileImage}"></UserCard>

              <div class="board-regdt-box">
                <p id="writeTime">{{ writeTime }}</p>
              </div>

              <div class="board-view-box">
                <img src="@/assets/images/icons/icons8-eye-48.png" alt="조회수">
                <p id="boardViews">{{ board.views }}</p>
              </div>
            </div>


            <div class="board-title-box">
              <h2 id="boardTitle" v-text="board.title"></h2>
            </div>

            <!--            <div v-if="props.category === 'board'">-->
            <!--              <p>영화</p>-->
            <!--              <div>-->
            <!--                <p></p>-->
            <!--              </div>-->
            <!--            </div>-->

            <div class="board-content-box">
              <p id="boardContent" type="text" v-text="board.content"></p>
            </div>

            <div class="button-box">
              <button class="button-large icon-button submit" type="button" @click="modifyBoard">
                <img src="@/assets/images/icons/icons8-pencil-48.png" alt="수정"/>수정
              </button>
              <button class="button-large button-gray icon-button" type="button" @click="deleteBoard">
                <img src="@/assets/images/icons/icons8-trash-48.png" alt="삭제"/>삭제
              </button>
            </div>
          </div>

          <!-- TODO. 수정 필요 -->
          <!-- 댓글 -->
          <div v-if="category === 'board'" style="display: flex; flex-direction: column;">
            <p id="commentsBlockTitle">댓글</p>
            <div class="comment-write-form">
              <div class="comment-input-box">
                <UserCard
                    :member="{memNo: userStore.user.memNo, name: userStore.user.name, profileImage: userStore.user.profileImage}"
                    :image-only="true"></UserCard>
                <div style="margin: 0 1.4rem 0 0; height: 100%; border-right: 0.1rem solid #f2f2f2"></div>
                <textarea id="commentInput" type="text" style="width: 100%; border: 0.1rem solid #f2f2f2;"></textarea>
              </div>

              <div style="display: flex; justify-content: end; margin-top: 0.5rem">
                <button class="button-default submit" @click="submitComment()" type="button">작성</button>
              </div>
            </div>

            <!-- Comments -->
            <div class="comment-box">
              <div v-if="commentStore.comments.length === 0">
                <div
                    style="border: 0.1rem solid #f2f2f2; border-radius: 2px; display: flex; justify-content: center; align-items: center;">
                  <p>작성된 댓글이 없습니다.</p>
                </div>
              </div>
              <CommentItem v-for="comment in commentStore.comments" :key="comment" :comment="comment"></CommentItem>
            </div>
          </div>

          <!-- TODO. 작성 필요 -->
          <div style="display: flex; flex-direction: column">
            <ul>
              <li style="display: flex;">
                <div style="margin-right: 1rem;">이전글</div>
                <p style="cursor: pointer;" v-if="store.prevBoard" @click="go(`/${category}/${store.prevBoard.id}`)">
                  {{ store.prevBoard.title }}</p>
                <p style="cursor: pointer;" v-if="!store.prevBoard">없음</p>
              </li>
              <li style="display: flex;">
                <div style="margin-right: 1rem;">다음글</div>
                <p style="cursor: pointer;" v-if="store.nextBoard" @click="go(`/${category}/${store.nextBoard.id}`)">
                  {{ store.nextBoard.title }}</p>
                <p style="cursor: pointer;" v-if="!store.nextBoard">없음</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*
#index_boarditem {
  width: 60rem;
}*/

.breadcrumb {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.breadcrumb > .breadcrumb-line {
  height: 50%;
  border-bottom: 0.1rem solid #f2f2f2;
}

/*
.breadcrumb > .breadcrumb-line-1 {
  width: 1rem;
}*/

.breadcrumb > .breadcrumb-line-2 {
  width: calc(100% - 5rem);
}

.breadcrumb > .breadcrumb-item {
  width: 5rem;
  text-align: center;
  cursor: pointer;
}

.board-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 2rem auto;
}

.board-box > .board-datas {
  display: flex;
  flex-direction: row;
  align-items: center;
  min-width: 20rem;
}

.board-box > .board-datas > .board-regdt-box > #writeTime {
  /*color: #555555;*/
  font-size: smaller;
  margin-right: 1rem;
}

.board-box > .board-datas > .board-view-box {
  display: flex;
  flex-direction: row;
}

.board-box > .board-datas > .board-view-box > img {
  width: 1rem;
  height: 1rem;
  margin-right: 0.3rem;
}

.board-box > .board-datas > .board-view-box > #boardViews {
  font-size: smaller;
  margin-right: 1rem;
}

#index_boarditem .button-box {
  display: flex;
  flex-direction: row;
  justify-content: end;
}

#index_boarditem .button-box > button {
  margin: 0 0.2rem;
}

.board-box > .board-title-box {
  display: flex;
  flex-direction: column;
  margin: 2rem 0;
}

#boardTitle {
  height: 2rem;
  padding: 0 1rem;
}

#boardContent {
  padding: 1rem 1rem 3rem 1rem;
}

#commentsBlockTitle {
  height: 2rem;
  padding: 1rem 0;
  align-content: center;
  border-top: 0.1rem solid #f2f2f2;
}

.comment-write-form {
  display: flex;
  flex-direction: column;
  width: calc(100% - 2rem);
  border: 0.1rem solid #f2f2f2;
  border-radius: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
}

.comment-input-box {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 6rem;
}

.comment-box {
  padding: 2rem 0;
}
</style>