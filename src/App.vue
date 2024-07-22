<script setup>
import {RouterView} from 'vue-router'
import HeaderComponent from '@/components/fragment/HeaderComponent.vue'
import FooterComponent from '@/components/fragment/FooterComponent.vue'
import BasicModal from '@/components/BasicModal.vue';
import {useModalStore} from '@/stores/modal.js';
import {storeToRefs} from "pinia";
import Logo from "@/components/fragment/LogoComponent.vue";

const modalStore = useModalStore();
const {modalOpen, datas, open} = storeToRefs(modalStore);
</script>

<template>
  <div id="app">
    <Suspense>
      <HeaderComponent></HeaderComponent>
      <template #fallback>
        <header id="header">
          <div id="header-main">
            <Logo></Logo>

            <!-- Nav -->
            <nav class="nav">
            </nav>
          </div>
        </header>
      </template>
    </Suspense>

    <div class="main-block">
      <Suspense>
        <RouterView/>
        <template #fallback>
          Loading...
        </template>
      </Suspense>
    </div>
<!--    <FooterComponent></FooterComponent>-->
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

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
