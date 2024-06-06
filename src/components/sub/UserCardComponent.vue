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
      <img :src="member.profileImage" alt="프로필 이미지"/>
    </div>
    <div v-if="!member.profileImage" id="writerProfileImage">{{ member.name ? member.name[0] : '' }}</div>
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
  width: fit-content;
}

.writer-box > div#writerProfileImage {
  background: #231eff;
  color: #FFFFFF;
  width: 2rem;
  height: 2rem;
  border-radius: 2rem;
  margin-right: 0.5rem;
  text-align: center;
  line-height: 2rem;
}

.writer-box > #writerData {
  display: flex;
  flex-direction: column;
}

.writer-box > #writerData > #writerName {
  white-space: nowrap;
}

.writer-box > #writerData > #writerRole {
  font-size: smaller;
  margin-left: 0.1rem;
}
</style>