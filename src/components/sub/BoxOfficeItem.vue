<script setup>
const props = defineProps(['movie']);
</script>

<template>
  <figure>
    <div class="boxoffice-image">
      <img src="" :alt="props.movie.movieNm"/>
    </div>
    <figcaption>
      <em>{{ props.movie.movieNm }}</em>
      <div class="movie-rank-inten">
        <span v-if="props.movie.rankInten !== 0">{{ Math.abs(props.movie.rankInten) }}</span>
        <img class="sort_icons" v-if="movie.rankInten < 0" src="@/assets/images/sort_down.png" alt="하락">
        <img class="sort_icons" v-if="movie.rankInten === 0" src="@/assets/images/horizontal_line.png" alt="유지">
        <img class="sort_icons" v-if="movie.rankInten > 0" src="@/assets/images/sort_up.png" alt="상승">
      </div>

    </figcaption>
  </figure>
</template>

<style scoped>
.boxoffice-image {
  height: 10em;
  border: 0.1em #f2f2f2 solid;
}
.movie-rank-inten {
  display: flex;
  align-items: center;
  justify-content: center;
}
.movie-rank-inten .sort_icons {
  width: 1.5em;
  height: 1.5em;
  display: inline;
  float: right;
}
</style>