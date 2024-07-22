<script setup>
import RegDateReformateComponent from "@/components/sub/RegDateReformateComponent.vue";
import UserCard from "@/components/sub/UserCardComponent.vue";
import Swal from 'sweetalert2';
import {ref} from "vue";
import {useUserStore} from "@/stores/user.js";
import {useCommentStore} from "@/stores/comment";
import emitter from '@/eventBus/emitter.js';

const props = defineProps(['comment', 'editMode']);
const item = ref(Object.assign({}, props.comment));
const editMode = ref(props.editMode) || ref(false);

const commentStore = useCommentStore();
const userStore = useUserStore();
await userStore.getCurrentUser();
const loginUser = userStore.user;

emitter.on('changeCommentUpdateForm', param => {
  if (param.current !== item.value.id) {
    editMode.value = false;
  }
})

function changeCommentUpdateForm() {
  emitter.emit('changeCommentUpdateForm', {
    current: item.value.id
  });

  editMode.value = true;
}

async function updateComment() {
  const value = document.getElementById(`comment_${item.value.id}`).innerHTML;

  if (value) {
    await commentStore.updateComment(item.value.id, value);
    const input = document.getElementById(`comment_${item.value.id}`);
    input.contenteditable = false;
  } else {
    Swal.fire({
      text: '댓글 내용을 입력해주세요.',
      icon: 'warning'
    });
  }
}

function cancelUpdate() {
  const comment = document.getElementById(`comment_${item.value.id}`);
  comment.innerHTML = item.value.content;

  editMode.value = false;
}

function deleteComment() {
  Swal.fire({
    text: '댓글을 삭제하시겠습니까?',
    icon: 'question',
    confirmButtonText: '확인',
    cancelButtonText: '취소',
    showCancelButton: true
  }).then(async result => {
    if (result.isConfirmed) {
      await commentStore.deleteComment(item.value.id);

      emitter.emit('deleteComment', {
        id: item.value.id
      })
    }
  })
}

</script>

<template>
  <div class="board_item_comment comment-item-box" :id="item.id">
    <div class="comment-box-group">
      <!-- Writer & RegDate -->
      <div class="comment-writer-box">
        <UserCard :member="{memNo: item.writerId, name: item.writerName,
      profileImage: item.writerProfileImage, role: item.writerRole}" imageSize="2rem"></UserCard>
        <RegDateReformateComponent :regDate="item.regDate"></RegDateReformateComponent>

        <!-- Comment Options -->
        <ul class="comment-option-box">
          <li v-if="loginUser.memNo === item.writerId && !editMode">
            <button type="button" @click="changeCommentUpdateForm">수정</button>
          </li>
          <li v-if="loginUser.memNo === item.writerId && !editMode">
            <button type="button" @click="deleteComment">삭제</button>
          </li>
          <li v-if="loginUser.memNo === item.writerId && editMode">
            <button type="button" @click="updateComment">완료</button>
          </li>
          <li v-if="loginUser.memNo === item.writerId && editMode">
            <button type="button" @click="cancelUpdate">취소</button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Comment Content -->
    <div class="comment-item-content">
      <div :id="`comment_${item.id}`" v-html="item.content"
           :class="editMode ? 'edit-item' : ''"
           :contenteditable="editMode"></div>
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
  /* padding: 1rem 1rem 1.5rem 1rem; */
}

.comment-item-content div.edit-item {
  border: 0.1rem solid #dfdfdf;
  border-radius: 0.1rem;
}

.comment-item-content div {
  display: flex;
  align-items: center;
  align-content: center;
  /* width: calc(100% - 2rem); */
  width: 100%;
  padding: 1rem 1rem 1.5rem 1rem;
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