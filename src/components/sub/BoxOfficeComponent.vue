<script setup>
import 'vue3-carousel/dist/carousel.css'
import {Carousel, Navigation, Pagination, Slide} from "vue3-carousel";
import BoxOfficeItem from './BoxOfficeItem.vue';
import {ref} from "vue";

const props = defineProps(['movies']);

const itemsToShow = ref(4);

setItemsToShow();

window.addEventListener('resize', function() {
  setItemsToShow();
})

function setItemsToShow() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  if (width >= 1097) {
    itemsToShow.value = 4;
  } else if (640 < width && width < 1096) {
    itemsToShow.value = 3;
  } else if (500 < width && width < 640) {
    itemsToShow.value = 2;
  } else {
    itemsToShow.value = 1;
  }
}
// function openMovieDetail(title) {
//
// }
</script>

<template>
  <carousel :items-to-show="itemsToShow" :wrap-around="true" :autoplay="5000">
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