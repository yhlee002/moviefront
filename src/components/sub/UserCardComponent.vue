<script setup>
import {useUserStore} from "@/stores/user.js";

const userStore = useUserStore();
const props = defineProps(['member', 'imageOnly']);

let member = props.member ?? userStore.defaultUser;
let imageOnly = props.imageOnly ?? false;

member.profileImage = member.profileImage ?? '';
</script>

<template>
  <div class="writer-box">
    <div v-if="member.profileImage" id="writerProfileImage">
      <img v-if="member.profileImage && member.role !== 'ROLE_ADMIN'" :src="member.profileImage" alt="프로필 이미지"/>
    </div>
    <div v-if="!member.profileImage && member.role === 'ROLE_ADMIN'" id="writerProfileImage" class="admin_no_image">
    </div>
    <div v-if="!member.profileImage && member.role !== 'ROLE_ADMIN'" id="writerProfileImage" class="user_no_image">
    </div>
    <div id="writerData" v-if="!imageOnly">
      <p id="writerName">{{ member.name }}</p>
      <img id="writerRole" v-if="member.role === 'ROLE_USER'" src="@/assets/images/icons/icons8-check-48.png">
    </div>
  </div>
</template>

<style scoped>
.writer-box {
  display: flex;
  flex-direction: row;
  margin-right: 1rem;
  align-items: center;
  justify-content: center;
  width: fit-content;
}

.writer-box > div#writerProfileImage {
  width: 3rem;
  height: 3rem;
  border-radius: 3rem;
  overflow: hidden;
}

.writer-box > div#writerProfileImage > img {
  width: 3rem;
  height: 3rem;
}

.writer-box > #writerData {
  display: flex;
  flex-direction: column;
  margin-left: 0.5rem;
}

.writer-box > #writerData > #writerName {
  white-space: nowrap;
}

.writer-box > #writerData > #writerRole {
  font-size: smaller;
  margin-left: 0.1rem;
}
</style>