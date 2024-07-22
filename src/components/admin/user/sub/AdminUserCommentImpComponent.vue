<script setup>
import {useCommentStore} from "@/stores/comment.js";
import Swal from "sweetalert2";
import {ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter()

const commentStore = useCommentStore();
const props = defineProps(['memNo']);

await commentStore.getCommentsByMember(props.memNo, 1, 10);
const comments = ref(commentStore.comments);

async function deleteComments() {
  const inputs = document.querySelectorAll('.userdetail-comment-checkbox > input[type=checkbox]:checked');

  const ids = [];
  for (let input of inputs) {
    ids.push(input.value);
  }

  if (ids.length === 0) {
    Swal.fire({
      text: '선택된 댓글이 없습니다.',
      icon: 'warning'
    })
    return;
  }

  Swal.fire({
    text: '선택한 댓글들을 삭제하시겠습니까?.',
    icon: 'question',
    confirmButtonText: '확인',
    cancelButtonText: '취소',
    showCancelButton: true
  }).then(async result => {
    if (result.isConfirmed) {
      const result = await commentStore.deleteComments(ids);
      if (result.data) {
        Swal.fire({
          text: '성공적으로 삭제되었습니다.',
          icon: 'success'
        })

        await commentStore.getCommentsByMember(props.memNo, commentStore.currentPage, 10);
        comments.value = commentStore.comments;
      } else {
        Swal.fire({
          text: '삭제에 실패했습니다.',
          icon: 'error'
        })
      }
    }
  })
}

function goBoardPage(id) {
  router.push(`/boards/${id}`)
}
</script>

<template>
  <div id="userComments">
    <table id="userCommentsTable">
      <thead>
      <tr>
        <th style="width: 3rem;"></th>
        <th style="width: 5rem;">식별번호</th>
        <th>내용</th>
        <th style="width: 16rem;">게시글</th>
        <th style="width: 12rem;">작성일자</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="comment in comments" :key="comment.id">
        <td class="userdetail-comment-checkbox" style="text-align: center;">
          <input :value="comment.id" type="checkbox"/>
        </td>
        <td>{{ comment.id }}</td>
        <td>
          <span @click="goBoardPage(comment.boardId)" style="cursor:pointer;">{{ comment.content }}</span>
        </td>
        <td>
          <span @click="goBoardPage(comment.boardId)" style="cursor:pointer;">{{ comment.boardTitle }}</span>
        </td>
        <td style="width: 11rem;">{{ comment.regDate }}</td>
      </tr>
      <tr v-if="comments.length === 0">
        <td colspan="5" style="text-align: center;">작성한 댓글이 존재하지 않습니다.</td>
      </tr>
      </tbody>
    </table>

    <div class="button-box" style="text-align: end;">
      <button @click="deleteComments()" class="button-default">삭제</button>
    </div>
  </div>
</template>

<style scoped>
#userComments, #userCommentsTable {
  width: 100%;
}
</style>