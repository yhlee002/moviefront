<script setup>
import {useMovieStore} from "@/stores/movie.js";

const props = defineProps(['movie']);

const movieStore = useMovieStore();

const movie = props.movie;
</script>

<template>
  <div class="movie-search-result">
    <div class="movie-image-box">
      <img :src="`${movieStore.configurations.images.tmdbSecureImageUrl}/${movieStore.configurations.images.backdropSizes[0]}/${movie.poster_path}`" alt="포스터">
    </div>

    <div class="movie-title-box">
      <p>{{movie.title}}(평점 {{movie.vote_average}})</p>
    </div>

  </div>
</template>

<style scoped>
.movie-search-result > .movie-image-box {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 25rem;
  overflow: hidden;
}

.movie-search-result > .movie-image-box img {
  width: 18rem;
}

.movie-search-result > .movie-title-box {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 2.4rem;
}
</style>