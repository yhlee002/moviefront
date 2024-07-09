<script setup>
import Swal from "sweetalert2";
import {ref} from "vue";
import {useNoticeStore} from "@/stores/notice";
import {useRouter} from "vue-router";

const router = useRouter()

const noticeStore = useNoticeStore();
const props = defineProps(['memNo']);

await noticeStore.getBoardsByMemNo(props.memNo, 1, 10);
const boards = ref(noticeStore.boardList);

async function deleteBoards() {
  const inputs = document.querySelectorAll('.userdetail-notice-checkbox > input[type=checkbox]:checked');

  const ids = [];
  for (let input of inputs) {
    ids.push(input.value);
  }

  if (ids.length === 0) {
    Swal.fire({
      text: '선택된 게시글이 없습니다.',
      icon: 'warning'
    })
    return;
  }

  Swal.fire({
    text: '선택한 게시글들을 삭제하시겠습니까?.',
    icon: 'question',
    confirmButtonText: '확인',
    cancelButtonText: '취소',
    showCancelButton: true
  }).then(async result => {
    if (result.isConfirmed) {
      const result = await noticeStore.deleteBoards(ids);
      if (result.data) {
        Swal.fire({
          text: '성공적으로 삭제되었습니다.',
          icon: 'success'
        })

        await noticeStore.getBoardsByMemNo(props.memNo, noticeStore.currentPage, 10);
        boards.value = noticeStore.boardList;
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
  router.push(`/notice/${id}`)
}

</script>

<template>
  <div id="userNotices">
    <!--    <h4>작성한 글 목록</h4>-->
    <table id="userNoticesTable">
      <thead>
      <tr>
        <th style="width: 3rem;"></th>
        <th style="width: 5rem;">식별번호</th>
        <th>제목</th>
        <th style="width: 12rem;">작성일자</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="board in boards" :key="board.id">
        <td class="userdetail-notice-checkbox" style="display: flex; justify-content: center;">
          <input :value="board.id" type="checkbox"/>
        </td>
        <td>{{ board.id }}</td>
        <td>
          <span @click="goBoardPage(board.id)" style="cursor:pointer;">{{ board.title }}</span>
        </td>
        <td>{{ board.regDate }}</td>
      </tr>
      <tr v-if="boards.length === 0">
        <td colspan="4" style="text-align: center;">작성한 게시글이 존재하지 않습니다.</td>
      </tr>
      </tbody>
    </table>

    <div class="button-box" style="text-align: end;">
      <button @click="deleteBoards()" class="button-default">삭제</button>
    </div>
  </div>
</template>

<style scoped>
#userNotices, #userNoticesTable {
  width: 100%;
}
</style>