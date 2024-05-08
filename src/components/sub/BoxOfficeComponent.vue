<script setup>
import 'vue3-carousel/dist/carousel.css'
import {Carousel, Navigation, Pagination, Slide} from "vue3-carousel";
import BoxOfficeItem from './BoxOfficeItem.vue';

const props = defineProps(['movies']);
</script>

<template>
  <carousel :items-to-show="4" :wrap-around="true" :autoplay="5000">
    <slide v-for="movie in props.movies" :key="movie.movieCd">
      <div class="carousel__item">
        <BoxOfficeItem :movie="movie"></BoxOfficeItem>
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