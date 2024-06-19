<script setup>
import UserCard from "@/components/sub/UserCardComponent.vue";
import VueSimpleAlert from "vue3-simple-alert";

const props = defineProps(['comment']);

const comment = props.comment;

function changeCommentUpdateForm(commentId) {
  const inputs = document.getElementsByClassName(`board_item_comments`);
  inputs.readonly = true;

  const input = document.getElementById(`comment_${commentId}`);
  input.readonly = false;
}

async function updateComment(commentId) {
  const value = document.getElementById(`comment_${commentId}`).value;

  if (value) {
    await commentStore.updateComment(commentId, value);
  } else {
    VueSimpleAlert.alert("댓글 내용을 입력해주세요.");
  }
}

function deleteComment(commentId) {
  VueSimpleAlert.confirm("댓글을 삭제하시겠습니까?")
      .then(result => {
        if (result) {
          commentStore.deleteComment(commentId);
        }
      })
}

// TODO. 미구현 기능(신고 기능)
function reportComment(commentId) {
  VueSimpleAlert.alert("아직 구현되지 않은 기능입니다.");
}
</script>

<template>
  <div class="board_item_comment comment-item-box" :id="comment.id">
    <!-- Writer & RegDate -->
    <div style="width: 10rem; margin-right: 1rem; border-right: 0.1rem solid #f2f2f2;">
      <UserCard :member="{memNo: comment.writerId, name: comment.writerName, profileImage: comment.writerProfileImage}"></UserCard>
    </div>

    <div style="height: 100%;"></div>

    <!-- Comment Content -->
    <div class="comment-item-content">
      <textarea v-model="comment.content"></textarea>
    </div>

    <!-- Comment Options -->
    <div class="comment-option-box">
      <button class="button-modify-minimalize" type="button" @click="changeCommentUpdateForm"></button>
      <button class="button-delete-minimalize" type="button" @click="deleteComment"></button>
      <button class="button-report-minimalize" type="button" @click="reportComment"></button>
    </div>
  </div>
</template>

<style scoped>
.comment-item-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.comment-item-content {
  width: 100%;
}

.comment-item-content textarea {
  display: flex;
  align-items: center;
  align-content: center;
  width: calc(100% - 2rem);
}

.comment-option-box {
  display: flex;
  width: fit-content;
}

.comment-option-box > button {
  width: 2rem;
  height: 2rem;
  margin-left: 0.2rem;
}
</style>