<script setup>
import {useUserStore} from "@/stores/user.js";
import UserImageComponent from "@/components/icon/UserImageComponent.vue";

const userStore = useUserStore();
const props = defineProps(['member', 'imageOnly']);

let member = props.member ?? userStore.defaultUser;
let imageOnly = props.imageOnly ?? false;

member.profileImage = member.profileImage ?? '';
</script>

<template>
  <div class="writer-box">
    <UserImageComponent :profileImage="member.profileImage" :role="member.role"></UserImageComponent>
    <div id="writerData" v-if="!imageOnly">
      <p id="writerName">{{ member.name }}</p>
<!--      <img id="writerRole" v-if="member.role === 'ROLE_USER'" src="@/assets/images/icons/icons8-check-48.png">-->
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