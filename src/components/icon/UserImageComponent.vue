<script setup>
const props = defineProps(['profileImage', 'role', 'width', 'height'])
</script>

<template>
  <div v-if="profileImage" id="writerProfileImage" :style="{width: width, height: height}">
    <img v-if="profileImage && role !== 'ROLE_ADMIN'" :src="profileImage" alt="프로필 이미지"/>
  </div>
  <div v-if="!profileImage" id="writerProfileImage" :class="role === 'ROLE_ADMIN' ? 'admin_no_image' : 'user_no_image'"
       :style="{width: width, height: height}"></div>
</template>

<style scoped>
div#writerProfileImage {
  width: 3rem;
  height: 3rem;
  border-radius: 3rem;
  overflow: hidden;
}

div#writerProfileImage > img {
  width: 3rem;
  height: 3rem;
}
</style>