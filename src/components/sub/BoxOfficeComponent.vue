<script setup>
import 'vue3-carousel/dist/carousel.css'
import {Carousel, Navigation, Pagination, Slide} from "vue3-carousel";
import BoxOfficeItem from './BoxOfficeItem.vue';

const props = defineProps(['movies']);

// function openMovieDetail(title) {
//
// }
</script>

<template>
  <carousel :items-to-show="4" :wrap-around="true" :autoplay="5000">
    <slide v-for="item in props.movies" :key="item.movie.movieCd">
      <!-- 감독, 개봉년도 등을 함께 전달해 정확성 높이기 -->
      <div class="carousel__item"><!--  @click="openMovieDetail(item)" -->
        <BoxOfficeItem :movie="item"></BoxOfficeItem>
      </div>
    </slide>

    <template #addons>
      <navigation/>
      <pagination/>
    </template>


  </carousel>
</template>

<style scoped>

</style>