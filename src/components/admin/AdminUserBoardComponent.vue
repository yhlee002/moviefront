<script setup>
import {useBoardStore} from "@/stores/board.js";
import Swal from "sweetalert2";
import {ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter()

const boardStore = useBoardStore();
const props = defineProps(['memNo']);

await boardStore.getBoardsByMemNo(props.memNo, 1, 10);
const boards = ref(boardStore.boardList);

async function deleteBoards() {
  const inputs = document.querySelectorAll('.userdetail-board-checkbox > input[type=checkbox]:checked');

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
      const result = await boardStore.deleteBoards(ids);
      if (result.data) {
        Swal.fire({
          text: '성공적으로 삭제되었습니다.',
          icon: 'success'
        })

        await boardStore.getBoardsByMemNo(props.memNo, boardStore.currentPage, 10);
        boards.value = boardStore.boardList;
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
  <div id="userBoards">
    <div style="display: flex; justify-content: end; width: 100%; margin: 0.5rem 0;">
      <router-link :to="`/admin/notices?memNo=${memNo}`">더보기</router-link>
    </div>
    <table id="userBoardsTable">
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
        <td class="userdetail-board-checkbox" style="text-align: center;">
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
#userBoards, #userBoardsTable {
  width: 100%;
}
</style>