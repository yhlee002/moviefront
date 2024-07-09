<script setup>
import {useNoticeStore} from "@/stores/notice.js";
import {useBoardStore} from "@/stores/board.js";
import {useMovieStore} from "@/stores/movie.js";
import BoxOffice from "@/components/sub/BoxOfficeComponent.vue";
import ListComponent from "@/components/sub/ListComponent.vue";
import {storeToRefs} from "pinia";

const noticeStore = useNoticeStore();
const boardStore = useBoardStore();
const movieStore = useMovieStore();

// box office
const {boxOfficeType, dailyBoxOfficeList, weeklyBoxOfficeList} = storeToRefs(movieStore);

const today = new Date().getDay(); // 요일
if (5 <= today <= 7) {
  movieStore.getWeeklyBoxOffice();
  movieStore.changeBoxOfficeType("W");
} else {
  movieStore.getDailyBoxOffice();
  movieStore.changeBoxOfficeType("D");
}

// notices
noticeStore.getBoards(1, 5);
// boards
boardStore.getBoards(1, 5);

function searchMovie() {
  if (window.event.keyCode === 13) location.href = '/search?query=' + event.target.value;
}
</script>

<template>
  <div class="movie-search-box">
    <div class="movie-search search-text">
      <input type="text" placeholder="영화를 검색하세요." @keydown="searchMovie()"/>
      <!--      <img alt="검색"/>-->
    </div>
  </div>


  <!-- BoxOffice -->
  <div id="index_boxoffice" class="wrapper-block">
    <div class="inner">
      <!-- Daily -->
      <div class="inner-block" v-if="boxOfficeType === 'D'">
        <div class="content">
          <div class="block-title-box">
            <h2 class="block-title">주간 박스오피스</h2>
          </div>
          <div class="image_slider" slideWidth="86%">
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
      <div class="inner-block" v-if="boxOfficeType === 'W'">
        <div class="content">
          <div class="block-title-box">
            <h2 class="block-title">주말 박스오피스</h2>
          </div>
          <div class="image_slider" slideWidth="86%">
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

  <div id="index_boards" class="wrapper-block" style="margin-top: 4rem;">
    <div class="inner">
      <!-- Notice Board -->
      <div class="inner-block">
        <div class="content">
          <div class="block-title-box">
            <h2 class="block-title">공지사항</h2>
            <a class="more" href="/notice">더보기</a>
          </div>
          <div>
            <ListComponent category="notice" :list="noticeStore.boardList" :field-show="false" :comment="false" :sub-title-show="false"></ListComponent>
          </div>
        </div>
      </div>

      <div class="block-vertical-line"></div>

      <!-- Impression Board -->
      <div class="inner-block">
        <div class="content">
          <div class="block-title-box">
            <h2 class="block-title">감상평</h2>
            <a class="more" href="/board">더보기</a>
          </div>
          <div>
            <ListComponent category="board" :list="boardStore.boardList" :field-show="false" :sub-title-show="false"></ListComponent>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

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

@media(min-width: 1097px) {
  #index_boards .inner {
    flex-direction: row;
  }
}

@media(max-width: 1096px) {
  #index_boards .inner {
    flex-direction: column;
  }

  #index_boards .inner .inner-block:not(.inner-block:last-child) {
    margin-bottom: 2rem;
  }

  #index_boards .block-vertical-line {
    margin: 0;
  }
}
</style>