<script setup>
import {useMovieStore} from "@/stores/movie.js";
import {ref} from "vue";

const props = defineProps(['movie']);
const movie = props.movie;

const movieStore = useMovieStore();

const overview = ref(false);
function changeOverView() {
  overview.value = !overview.value;
}

function showOverview() {
  // const poster = document.querySelector(`#movie-item-poster-${movie.id}`);
  // const overview = document.querySelector(`#movie-item-${movie.id}`);
  // poster.dim;

  changeOverView();
}

</script>

<template>
  <div class="movie-search-result">
    <div class="movie-image-box" @click="showOverview()">
      <img :id="`movie-item-poster-${movie.id}`" :class="overview ? 'low-opacity' : ''"
           :src="`${movieStore.configurations.images.tmdbSecureImageUrl}/${movieStore.configurations.images.backdropSizes[0]}/${movie.poster_path}`" :alt="movie.title">
      <div :id="`movie-item-poster-${movie.id}`" class="movie-overview" v-show="overview">
        <p>{{movie.overview}}</p>
      </div>
    </div>

    <div class="movie-title-box">
      <p>{{movie.title}}(👍 {{movie.vote_average.toFixed(1)}})</p>
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

.movie-search-result > .movie-image-box img.low-opacity {
  opacity: 0.3;
}

.movie-search-result > .movie-image-box div.movie-overview {
  position: absolute;
}

.movie-search-result > .movie-image-box div.movie-overview > p {
  margin: 1rem;
  line-height: 1.21rem;
  width: calc(100% - 2rem);
  height: calc(100% - 2rem);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 19;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
}

.movie-search-result > .movie-image-box img,
.movie-search-result > .movie-image-box div.movie-overview {
  width: 18rem;
  height: 25rem;
}

.movie-search-result > .movie-title-box {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 2.4rem;
}
</style>