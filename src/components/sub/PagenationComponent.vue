<script setup>
import {useRouter} from "vue-router";
import {computed, ref, watch} from "vue";

const router = useRouter();
const props = defineProps(['category', 'pages', 'page']); // total pages, current page

let showPages = ref([]); // page list

// watch(() => props.page, (newVal, oldVal) => {
//   updateShowPages(props.pages, newVal);
// })

const page = computed(() => {
  const nanable = Number(props.page || '1')
  return isNaN(nanable) ? 1 : nanable
})

watch(page, (newPage) => {
      updateShowPages(props.pages, newPage);
    }, {immediate: true}
)

updateShowPages(props.pages, page.value);

function updateShowPages(pages, page) {
  showPages.value = [];

  if (page <= 5) {
    for (let i = 1; i <= 5; i++) {
      showPages.value.push(i);
      if (i + 1 > pages) return;
    }
  } else {
    const nth = Math.abs(page % 5); // 배열의 자신의 위치값
    const idx = nth === 0 ? 5 : nth;
    const start = page - (idx - 1);

    for (let i = start; i <= start + 4; i++) {
      showPages.value.push(i);
      if (i + 1 > pages) return;
    }
  }
}

function getPage(page) {
  const path = router.currentRoute.value.path;
  router.push({path: path, query: {page: page}, force: true});
}

function goPrevPage() {
  const path = router.currentRoute.value.path;
  const startPage = getStartPage(props.page);
  const newVal = startPage - 1;

  if (newVal >= 1) router.push(`${path}?page=${newVal}`)

  function getStartPage(page) {
    if (page <= 5) {
      return 1;
    } else {
      const nth = Math.abs(page % 5);
      const idx = nth === 0 ? 5 : nth; // 배열의 자신의 위치값
      return page - (idx - 1);
    }
  }
}

function goNextPage() {
  const path = router.currentRoute.value.path;
  const endPage = getEndPage(props.page);
  const newVal = endPage + 1;

  if (newVal <= props.pages) router.push(`${path}?page=${newVal}`)

  function getEndPage(page) {
    if (page <= 5) {
      return 5;
    } else {
      const nth = Math.abs(page % 5);
      const idx = nth === 0 ? 5 : nth; // 배열의 자신의 위치값
      return page + (5 - idx);
    }
  }
}

</script>

<template>
  <div class="pagenation-box">
    <div class="prev-button">
      <button class="image-button" type="button" @click="goPrevPage()" :disabled="showPages[0] === 1"></button>
    </div>
    <div>
      <ul class="pagenation-page-list">
        <li v-for="idx in showPages" :key="`page-${idx}`" @click="getPage(idx)"
            :class="idx === page? 'current-page' : ''">{{ idx }}
        </li>
        <!--        <router-link v-for="idx in showPages" :key="`page-${idx}`"-->
        <!--                     :to="{ name: category, query: { page: idx }, force: true }">-->
        <!--          <li :class="idx === page? 'current-page' : ''">-->
        <!--            {{ idx }}-->
        <!--          </li>-->
        <!--        </router-link>-->
      </ul>
    </div>
    <div class="next-button">
      <button class="image-button" type="button" @click="goNextPage()"
              :disabled="showPages[showPages.length - 1] === pages"></button>
    </div>
  </div>
</template>

<style scoped>
.pagenation-box {
  display: flex;
  justify-content: space-between;
  margin: 2rem 0;
}

.pagenation-box ul.pagenation-page-list li {
  padding: 0 0.2rem;
  margin: 0 0.3rem;
  cursor: pointer;
  color: #000000;
}

.pagenation-box ul.pagenation-page-list li.current-page {
  color: #2553a7;
  font-weight: bold;
}

.pagenation-box > .prev-button,
.pagenation-box > .next-button {
  width: 3rem;
  height: 1.8rem;
}

.pagenation-box > .prev-button > button,
.pagenation-box > .next-button > button {
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.pagenation-box > .prev-button > button {
  background-image: url("@/assets/images/icons/pagenation/icons8-back-to-50.png");
}

.pagenation-box > .prev-button > button:disabled {
  background-image: url("@/assets/images/icons/pagenation/icons8-back-to-gray-50.png");
}

.pagenation-box > .next-button > button {
  background-image: url("@/assets/images/icons/pagenation/icons8-next-page-50.png");
}

.pagenation-box > .next-button > button:disabled {
  background-image: url("@/assets/images/icons/pagenation/icons8-next-page-gray-50.png");
}

.pagenation-box .pagenation-page-list {
  display: flex;
  flex-direction: row;
}
</style>