<script setup>
const props = defineProps(['regDate']);

const regDate = new Date(props.regDate);
const now = new Date();

let writeTime
const millisecond = now - regDate;
if (millisecond / 1000 < 60) {
  writeTime = Math.floor(millisecond / 1000) + '초'; // n초

} else if (millisecond / (60 * 1000) < 60) {
  writeTime = Math.floor(millisecond / (60 * 1000)) + '분';
} else if (millisecond / (60 * 60 * 1000) < 24) {
  writeTime = Math.floor(millisecond / (60 * 60 * 1000)) + '시간';
} else if (millisecond / (24 * 60 * 60 * 1000) < 30) {
  writeTime = Math.floor(millisecond / (24 * 60 * 60 * 1000)) + '일';
} else if (millisecond / (30 * 24 * 60 * 60 * 1000) < 365) {
  writeTime = Math.floor(millisecond / (30 * 24 * 60 * 60 * 1000)) + '달';
} else if (millisecond / (365 * 30 * 24 * 60 * 60 * 1000) < 365) {
  writeTime = Math.floor(millisecond / (30 * 24 * 60 * 60 * 1000)) + '년';
}
writeTime += '전';
</script>

<template>
  <p class="reg-date-rf-data">{{writeTime}}</p>
</template>

<style scoped>
.reg-date-rf-data {
  font-size: smaller;
}
</style>