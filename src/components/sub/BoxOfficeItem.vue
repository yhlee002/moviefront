<script setup>
import {useModalStore} from '@/stores/modal.js';
const modalStore = useModalStore();

const props = defineProps(['movie']);

let poster = '';
const posters = props.movie.detail.posters;
if (posters) {
  poster = posters.split('|')[0];
}

function openMovieDetailModal() {
  const movie = props.movie; // movie, detail
  modalStore.setData(movie);
  modalStore.openModal('BoxOfficeMovieDetail');
}
</script>

<template>
  <figure :id="props.movie.movie.movieCd" class="boxoffice-item" @click="openMovieDetailModal()">
    <div class="boxoffice-image">
      <img :src="poster" alt="영화 포스터"/>
    </div>
    <figcaption>
<!--      <em>{{ props.movie.movie.movieNm }}</em>-->
      <p class="boxoffice-item-title">{{ props.movie.movie.movieNm }}</p>
      <div class="movie-rank-inten">
        <span v-if="props.movie.rankInten !== 0">{{ Math.abs(props.movie.movie.rankInten) }}</span>
        <img class="sort_icons" v-if="movie.movie.rankInten < 0" src="@/assets/images/sort_down.png" alt="하락">
        <img class="sort_icons" v-if="movie.movie.rankInten === 0" src="@/assets/images/horizontal_line.png" alt="유지">
        <img class="sort_icons" v-if="movie.movie.rankInten > 0" src="@/assets/images/sort_up.png" alt="상승">
      </div>

    </figcaption>
  </figure>
</template>

<style scoped>
.boxoffice-item {
  overflow: hidden;
  cursor: pointer;
}

.boxoffice-item > .boxoffice-image {
  height: 19em;
  margin-bottom: 0.2rem;
}

.boxoffice-item > .boxoffice-image > img {
  height: 18rem;
}

.boxoffice-item > .boxoffice-item-title {
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.boxoffice-item .movie-rank-inten {
  display: flex;
  align-items: center;
  justify-content: center;
}
.boxoffice-item .movie-rank-inten .sort_icons {
  width: 1rem;
  height: 1rem;
  display: inline;
  float: right;
}
</style>