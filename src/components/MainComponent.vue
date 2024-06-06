<script setup>
import {useMovieStore} from "@/stores/movie.js";
import HeaderComponent from "@/components/fragment/HeaderComponent.vue";
import FooterComponent from "@/App.vue";

const movieStore = useMovieStore();
movieStore.getConfigurations();
</script>

<template>
  <RouterView></RouterView>
</template>

<style scoped>

</style>