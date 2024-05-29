<script setup>
  import {useModalStore} from "@/stores/modal.js";

  const modalStore = useModalStore();

  const data = modalStore.data;
  const movie = data.movie;
  const detail = data.detail;

  let posters = [];
  const postersStr = detail.posters;
  if (postersStr) {
    posters = postersStr.split('|');
  }

  let directors = [];
  const directorStr = detail.directors;
  if (directorStr) {
    directors = directorStr.split('|');
  }
</script>

<template>
  <div :id="`md-mno${movie.movieCd}`">
    <!-- title -->
    <div>
      <h2>{{movie.movieNm}}</h2>
    </div>

    <!-- body -->
    <div>
      <div id="md-posters">
        <img v-for="(po, idx) in posters" :src="po" :key="idx" :alt="`영화 포스터(${idx})`" />
      </div>

      <div id="md-details">
        <ul>
          <li>감독: {{}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>