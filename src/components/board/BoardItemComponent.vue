<script setup>
import {useRouter} from "vue-router";
import {useUserStore} from "@/stores/user.js";
import {useNoticeStore} from "@/stores/notice.js";
import {useCommentStore} from "@/stores/comment.js";
import {useBoardStore} from "@/stores/board.js";

import Swal from 'sweetalert2'
import UserCard from "@/components/sub/UserCardComponent.vue";
import CommentItem from "@/components/sub/CommentItemComponent.vue";
import {ref, watch} from "vue";
import RegDateReformateComponent from "@/components/sub/RegDateReformateComponent.vue";

const props = defineProps(['category']);
const router = useRouter();
const id = router.currentRoute.value.params.id;

const userStore = useUserStore();
const commentStore = useCommentStore();
const store = props.category === 'notices' ? useNoticeStore() : props.category === 'boards' ? useBoardStore() : null;

store.updateBoardViews(id);
await store.getBoard(id);
const board = store.currentBoard;
const loginUser = userStore.user;

const recommended = ref(false);
const recommendedCnt = ref(0);
const comments = ref([]);

if (props.category === 'boards') {
  // 로그인 유저가 해당 글을 추천했는지 조회
  getRecommendedByCurrentUser();
  getRecommendedCount();
  // 댓글 조회
  commentStore.currentPage = 0;
  await loadComments();
}

watch(recommended, async (newVal) => {
  await getRecommendedCount();
})

async function getRecommendedByCurrentUser() {
  const result = await store.isRecommendedByUser(board.id, loginUser.memNo);
  if (result.data) {
    recommended.value = result.data.data;
  }
}

async function getRecommendedCount() {
  const result = await store.getBoardrecommendedCount(board.id);
  recommendedCnt.value = result.data.data;
}

async function loadComments() {
  commentStore.currentPage += 1;
  await commentStore.getCommentsByBoard(board.id, commentStore.currentPage);
  // comments.value 에다가 commentStore.comments 요소 모두 더해주기
  comments.value = comments.value.concat(commentStore.comments);
}

async function submitComment() {
  if (userStore.checkLogin()) {
    const input = document.getElementById('commentInput');
    const value = input.innerHTML;
    if (value) {
      const result = await commentStore.saveComment(board.id, userStore.user.memNo, value);
      if (result.data) {
        input.innerHTML = '';
        comments.value.unshift(result.data);
      }
    } else {
      Swal.fire({
        text: '댓글 내용을 입력해주세요.',
        icon: 'warning'
      });
    }
  }
}

async function recommendBoard() {
  if (userStore.checkLogin()) {
    const value = !recommended.value;
    const result = await store.updateBoardRecommended(board.id, loginUser.memNo, value);
    if (result.data.data?.id) recommended.value = true;
    else recommended.value = false;
  }
}

async function modifyBoard() {
  router.push(`/newpost?id=${board.id}&category=${props.category}`);
}

function deleteBoard() {
  Swal.fire({
    text: '정말 삭제하시겠습니까?',
    icon: 'question',
    confirmButtonText: '확인',
    cancelButtonText: '취소',
    showCancelButton: true
  }).then(async result => {
    if (result.isConfirmed) {
      await store.deleteBoard(board.id);
      router.push(`/${props.category}`)
    }
  })
}

async function go(path) {
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
              <router-link v-if="props.category === 'notices'" to="/notices">공지사항</router-link>
              <router-link v-if="props.category === 'boards'" to="/boards">감상 후기</router-link>
            </span>
            <div class="breadcrumb-line breadcrumb-line-2"></div>
          </div>

          <!-- Board -->
          <div class="board-box">
            <div class="board-datas">
              <UserCard
                  :member="{memNo: board.writerId, name: board.writerName,
                  profileImage: board.writerProfileImage, role: board.writerRole}"></UserCard>

              <div class="board-regdt-box">
                <RegDateReformateComponent id="writeTime" :regDate="board.regDate"></RegDateReformateComponent>
              </div>

              <div class="board-view-box">
                <img src="@/assets/images/icons/icons8-eye-48.png" alt="조회수">
                <p id="boardViews">{{ board.views }}</p>
              </div>
            </div>


            <div class="board-title-box">
              <h2 id="boardTitle" v-text="board.title"></h2>
            </div>

            <!--            <div v-if="props.category === 'boards'">-->
            <!--              <p>영화</p>-->
            <!--              <div>-->
            <!--                <p></p>-->
            <!--              </div>-->
            <!--            </div>-->

            <div class="board-content-box">
              <div id="boardContent" v-html="board.content"></div>
            </div>

            <div class="button-box">
              <ul class="board-options">
                <li v-if="board.writerId !== loginUser.memNo">
                  <button @click="recommendBoard" :class="recommended ? 'recommended' : ''">
                    <img src="@/assets/images/icons/icons8-heart-30.png" alt="추천"/>
                    <!--                    추천-->
                    <span>{{ recommendedCnt }}</span>
                  </button>
                </li>

                <li v-if="board.writerId === loginUser.memNo">
                  <button @click="modifyBoard">
                    수정
                  </button>
                </li>

                <li v-if="board.writerId === loginUser.memNo">
                  <button @click="deleteBoard">
                    삭제
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <!-- 댓글 -->
          <div v-if="category === 'boards'" style="display: flex; flex-direction: column;">
            <p id="commentsBlockTitle">댓글</p>
            <div class="comment-write-form">
              <div class="comment-input-box">
                <UserCard
                    :member="{memNo: loginUser.memNo, name: loginUser.name,
                  profileImage: loginUser.profileImage, role: loginUser.role}"
                    :image-only="true"></UserCard>
                <div style="margin: 0 1.4rem 0 0; height: 100%; border-right: 0.1rem solid #f2f2f2"></div>
                <div contenteditable="true" id="commentInput" type="text"
                     style="width: 100%; border: 0.1rem solid #f2f2f2; padding: 1rem;"></div>
              </div>

              <div style="display: flex; justify-content: end; margin-top: 0.5rem">
                <button class="button-default" @click="submitComment()" type="button">작성</button>
              </div>
            </div>

            <!-- Comments -->
            <div class="comment-box">
              <div v-if="comments.length === 0">
                <div
                    style="border: 0.1rem solid #f2f2f2; border-radius: 2px; display: flex; justify-content: center; align-items: center;">
                  <p style="margin: 1rem 0;">작성된 댓글이 없습니다.</p>
                </div>
              </div>
              <CommentItem v-for="comment in comments" :key="comment" :comment="comment"></CommentItem>
              <div style="display: flex; justify-content: center;">
                <button id="loadCommentsBtn" v-if="comments.length < commentStore.totalElements" @click="loadComments()" type="button">댓글 더보기</button>
              </div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column">
            <ul>
              <li style="display: flex; margin-bottom: 0.5rem;">
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
  height: 2rem;
}

.breadcrumb > .breadcrumb-line {
  height: 1px;
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
  padding: 0 0.5rem;
  width: calc(100% - 1rem);
}

#boardContent {
  padding: 0.5rem 0.5rem 3rem 0.5rem;
  width: calc(100% - 1rem);
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
  border-radius: 2px; /*1rem;*/
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

.board-options {
  display: flex;
  flex-direction: row;
  width: fit-content;
  height: fit-content;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid #f2f2f2;
  align-items: center;
}

.board-options li {
  height: fit-content;
  width: fit-content;
}

.board-options li:not(li:last-child) {
  border-right: 1px solid #f2f2f2;
}

.board-options li button {
  border: none;
  background-color: transparent;
  box-shadow: none;
  padding: 0.5rem 0.5rem;
  display: flex;
}

.board-options li button.recommended img {
  opacity: 1;
}

.board-options li button img {
  width: 1rem;
  height: 1rem;
  opacity: 0.7;
}

.board-options li button span {
  margin: 0 0.2rem;
}

#loadCommentsBtn {
  width: fit-content;
  height: fit-content;
  padding: 0.5rem 0.5rem;
  background-color: transparent;
  border-radius: 0.5rem;
  border: 1px solid #f2f2f2;
  align-items: center;
}
</style>