<script setup>
import UserCard from "@/components/sub/UserCardComponent.vue";
import Swal from 'sweetalert2';
import {useUserStore} from "@/stores/user";
import RegDateReformateComponent from "@/components/sub/RegDateReformateComponent.vue";
import {ref} from "vue";

const props = defineProps(['comment']);
const comment = props.comment;
const modifyMode = ref(false);

const userStore = useUserStore();
await userStore.getCurrentUser();
const loginUser = userStore.user;

function changeCommentUpdateForm() {
  const inputs = document.getElementsByClassName(`board_item_comments`);
  inputs.contenteditable = false;

  const input = document.getElementById(`comment_${comment.id}`);
  input.contenteditable = true;
}

async function updateComment() {
  const value = document.getElementById(`comment_${comment.id}`).innerHTML;

  if (value) {
    await commentStore.updateComment(comment.id, value);
    const input = document.getElementById(`comment_${comment.id}`);
    input.contenteditable = false;
  } else {
    Swal.fire({
      text: '댓글 내용을 입력해주세요.',
      icon: 'warning'
    });
  }
}

function deleteComment() {
  Swal.fire({
    text: '댓글을 삭제하시겠습니까?',
    icon: 'question',
    confirmButtonText: '확인',
    cancelButtonText: '취소'
  }).then(async result => {
    if (result.isConfirmed) {
      await commentStore.deleteComment(comment.id);
    }
  })
}

</script>

<template>
  <div class="board_item_comment comment-item-box" :id="comment.id">
    <div class="comment-box-group">
      <!-- Writer & RegDate -->
      <div class="comment-writer-box">
        <UserCard :member="{memNo: comment.writerId, name: comment.writerName,
      profileImage: comment.writerProfileImage, role: comment.writerRole}" imageSize="2rem"></UserCard>
        <RegDateReformateComponent :regDate="comment.regDate"></RegDateReformateComponent>

        <!-- Comment Options -->
        <ul class="comment-option-box">
          <li>
            <button v-if="loginUser.memNo === comment.writerId && !modifyMode"
                    type="button" @click="changeCommentUpdateForm">수정</button>
          </li>
          <li>
            <button v-if="loginUser.memNo === comment.writerId && !modifyMode"
                    type="button" @click="deleteComment">삭제</button>
          </li>
          <li>
            <button v-if="loginUser.memNo === comment.writerId && modifyMode"
                    type="button" @click="updateComment">완료</button>
          </li>
        </ul>
      </div>

    </div>

    <!-- Comment Content -->
    <div class="comment-item-content">
      <div :id="`comment_${comment.id}`" v-html="comment.content" readonly contenteditable="false"></div>
    </div>

  </div>
</template>

<style scoped>
.comment-item-box {
  display: flex;
  flex-direction: column;

  border-bottom: 0.1rem solid #f2f2f2;
  margin-bottom: 1rem;
}

.comment-item-box:last-child {
  border-bottom: none;
}

.comment-box-group {
  display: flex;
  flex-direction: row;
}

.comment-item-box .comment-writer-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 17rem;
  margin-bottom: 0.5rem;
}

.comment-item-content {
  width: 100%;
  padding: 1rem 1rem 1.5rem 1rem;
}

.comment-item-content textarea {
  display: flex;
  align-items: center;
  align-content: center;
  width: calc(100% - 2rem);
}

.comment-option-box {
  display: flex;
  flex-direction: row;
  width: fit-content;
  height: fit-content;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid #f2f2f2;
  align-items: center;
  margin-left: 1rem;
}

.comment-option-box li {
  height: fit-content;
  width: fit-content;
}

.comment-option-box li:not(li:last-child) {
  border-right: 1px solid #f2f2f2;
}

.comment-option-box li button {
  border: none;
  background-color: transparent;
  box-shadow: none;
  padding: 0.5rem 0.5rem;
  display: flex;
}
</style>