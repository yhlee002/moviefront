<script setup>
import {useBoardStore} from "@/stores/board.js";
import Swal from "sweetalert2";
import {ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter()

const boardStore = useBoardStore();
const props = defineProps(['memNo']);

const boards = ref([]);
const result = await boardStore.getRecommendedBoardByUser(props.memNo, 1, 10);
const data = result.data;
if (data.data) {
  boards.value = data.data.boardImpList;
}

function goBoardPage(id) {
  router.push(`/boards/${id}`)
}
</script>

<template>
  <div id="userRecommendedBoards">
    <div style="display: flex; justify-content: end; width: 100%; margin: 1rem 0;">
      <router-link :to="`/admin/notices?memNo=${memNo}`">더보기</router-link>
    </div>
    <table id="userRecommendedBoardsTable">
      <thead>
      <tr>
        <th style="width: 5rem;">식별번호</th>
        <th>제목</th>
        <th style="width: 12rem;">작성일자</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="board in boards" :key="board.id">
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
  </div>
</template>

<style scoped>
#userRecommendedBoards, #userRecommendedBoardsTable {
  width: 100%;
}
</style>