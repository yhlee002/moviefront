<script setup>
  const props = defineProps(['value']);
</script>

<template>
  <div class="modal-title">
    {{props.value}}
  </div>
</template>

<style scoped>

</style>