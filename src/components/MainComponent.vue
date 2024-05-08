<script setup>
import {useBoardStore} from "@/stores/board.js";
import {useNoticeStore} from "@/stores/notice.js";
import {useMovieStore} from "@/stores/movie.js";
import BoxOffice from "@/components/sub/BoxOfficeComponent.vue";
import {storeToRefs} from "pinia";

const boardStore = useBoardStore();
const noticeStore = useNoticeStore();
const movieStore = useMovieStore();

const {dailyBoxOfficeList, weeklyBoxOfficeList} = storeToRefs(movieStore);
await movieStore.getDailyBoxOffice();
await movieStore.getWeeklyBoxOffice();

movieStore.getDailyBoxOffice();
movieStore.getWeeklyBoxOffice();

</script>

<template>
  <div style="display: flex; width: 100%;justify-content: space-around; margin: 1em 0">
    <div class="search-text" style="display: flex; align-content: center; height: 2em;">
      <input type="text" placeholder="영화를 검색하세요." style="width: 20em; padding: 0.4em"/>
      <img alt="검색"/>
    </div>
  </div>


  <!-- BoxOffice -->
  <div id="index_boxoffice" class="wrapper-block">
    <div class="inner">
      <!-- Daily -->
      <div class="box">
        <div class="content align-center">
          <h2 class="block-title">일간 박스오피스</h2>
          <div class="image_slider" slideWidth="100%">
            <Suspense>
              <BoxOffice :movies="dailyBoxOfficeList"></BoxOffice>
              <template #fallback>
                Loading...
              </template>
            </Suspense>
          </div>
        </div>
      </div>
      <!-- Weekly -->
      <div class="box">
        <div class="content align-center">
          <h2 class="block-title">주말 박스오피스</h2>
          <div class="image_slider" slideWidth="100%">
            <Suspense>
              <BoxOffice :movies="weeklyBoxOfficeList"></BoxOffice>
              <template #fallback>
                Loading...
              </template>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.wrapper-block {
  padding: 2rem 1rem;
  border-bottom: 0.8em solid #f2f2f2;
}
.wrapper-block .block-title {
  margin-bottom: 0.8em;
}
</style>