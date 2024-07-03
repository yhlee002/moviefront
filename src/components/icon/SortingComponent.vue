<script setup>
  import {ref} from "vue";
  const props = defineProps(['type', 'enabled', 'value']);

</script>

<template>
  <button v-if="type === 'number'" v-show="enabled" class="sorting-button" type="button">
    <img v-if="value === 'desc'" src="@/assets/images/icons/sorting/icons8-reversed-numerical-sorting-48.png" />
    <img v-if="value === 'asc'" src="@/assets/images/icons/sorting/icons8-numeric-48.png" />
  </button>

  <button v-if="type === 'text'" v-show="enabled" class="sorting-button" type="button">
    <img v-if="value === 'desc'" src="@/assets/images/icons/sorting/icons8-alphabetical-sorting-2-48.png" />
    <img v-if="value === 'asc'" src="@/assets/images/icons/sorting/icons8-alphabetical-sorting-48.png" />
  </button>

  <button v-if="!type" v-show="enabled" class="sorting-button" type="button">
    <img v-if="value === 'desc'" src="@/assets/images/icons/sorting/icons8-descending-sorting-48.png" />
    <img v-if="value === 'asc'" src="@/assets/images/icons/sorting/icons8-ascending-sorting-48.png" />
  </button>
</template>

<style scoped>
button.sorting-button {
  background-color: transparent;
  border: none;
  width: 1.3rem;
  height: 1.3rem;
  box-shadow: none;
  overflow: hidden;
  position: absolute;
  margin-left: 0.2rem;
}

button.sorting-button > img {
  width: 100%;
  height: 100%;
}
</style>