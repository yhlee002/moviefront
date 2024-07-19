<script setup>
import NoProfileImageComponent from "@/components/icon/NoProfileImageComponent.vue";

const props = defineProps(['profileImage', 'role', 'width', 'height'])
</script>

<template>
  <div v-if="profileImage" id="writerProfileImage">
    <img v-if="profileImage && role !== 'ROLE_ADMIN'" :src="profileImage"
         :style="{width: width, height: height}"
         class="profile_image" alt="프로필 이미지"/>
  </div>
  <div v-if="!profileImage" id="writerProfileImage">
    <NoProfileImageComponent :role="role" :width="width" :height="height"></NoProfileImageComponent>
  </div>
</template>

<style scoped>
div#writerProfileImage {
  width: 100%;
  height: 100%;
  border-radius: 3rem;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>