<script setup>
  const props = defineProps(['role', 'width', 'height'])
</script>

<template>
  <img v-if="role === 'ROLE_ADMIN'" class="profile_image admin_no_image"
       src="@/assets/images/icons/icons8-female-user-100.png" alt="프로필 이미지" :style="{width: width, height: height}"/>
  <img v-if="role === 'ROLE_USER'" class="profile_image user_no_image"
       src="@/assets/images/icons/icons8-customer-100.png" alt="프로필 이미지" :style="{width: width, height: height}"/>
</template>

<style scoped>

</style>