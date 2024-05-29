<script setup>
import {useMovieStore} from "@/stores/movie.js";

const movieStore = useMovieStore();
movieStore.getConfigurations();
</script>

<template>
  <RouterView></RouterView>
</template>

<style scoped>

</style>