<script setup>
import {useMovieStore} from "@/stores/movie.js";
import MovieItem from '@/components/sub/MovieItem.vue';

const movieStore = useMovieStore();
const props = defineProps(['query']);

await movieStore.searchMovie(props.query);

function searchMovie() {
  if (window.event.keyCode === 13) {
    location.href = '/search?query=' + event.target.value;
  }
}

const query = props.query;
</script>

<template>
  <div>
    <div class="movie-search-box">
      <div class="movie-search search-text">
        <input type="text" v-model="query" placeholder="영화를 검색하세요." @keydown="searchMovie()"/>
        <!--      <img alt="검색"/>-->
      </div>
    </div>

    <div>
      <div class="movie-search-result-box" style="display: grid; flex-direction: column;">
        <MovieItem v-for="item in movieStore.movies" :movie="item" :key="item"></MovieItem>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Search bar */
.movie-search-box {
  display: flex;
  width: 100%;
  justify-content: space-around;
  margin: 1rem 0
}

.movie-search-box > .movie-search {
  display: flex;
  align-content: center;
  height: 2rem;
}

.movie-search-box > .movie-search > input[type=text] {
  width: 20rem;
  padding: 0.4rem
}

/* Result List */
.movie-search-result-box {
  display: grid;
  grid-template-rows: repeat(3, minmax(100px, auto));
  grid-template-columns: repeat(auto-fill, minmax(20%, auto));
  row-gap: 1rem;
  column-gap: 1rem;
  margin: 2rem;
}
/*
.movie-search-result-box > .movie-search-result > .movie-image-box > img {
}*/
</style>