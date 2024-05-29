<script setup>
import {RouterLink, RouterView} from 'vue-router'
import HeaderComponent from './components/fragment/HeaderComponent.vue'
import FooterComponent from './components/fragment/FooterComponent.vue'
import BasicModal from '@/components/BasicModal.vue';
import {useModalStore} from '@/stores/modal.js';
import {storeToRefs} from "pinia";

const modalStore = useModalStore();
const {modalOpen, datas, open} = storeToRefs(modalStore);

</script>

<template>
  <div id="app">
    <HeaderComponent></HeaderComponent>
    <div class="main-block">
      <Suspense>
        <RouterView/>
        <template #fallback>
          Loading...
        </template>
      </Suspense>
    </div>
    <FooterComponent></FooterComponent>
  </div>
  <BasicModal v-if="modalOpen" ref="basicModal" :datas="datas" @close="open = false">
    <template #title></template>
    <template #content></template>
  </BasicModal>

</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav a.router-link-exact-active {
  color: #555555;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid;
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
