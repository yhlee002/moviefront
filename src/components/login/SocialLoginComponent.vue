<script setup>
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import VueSimpleAlert from "vue3-simple-alert";

const router = useRouter();
const props = defineProps(['provider', 'code', 'state']);
const userStore = useUserStore();

// const data = await userStore.getToken(props.provider, props.code, props.state);
// if (data) {
//   const response = await userStore.getSocialProfile(props.provider);
//   if (response.data.result) {
//     router.push("/");
//   } else {
//     router.push("/sign-in");
//
//     const status = response.data.status;
//     if (status === 'SIGNUP_REQUIRED') {
//       VueSimpleAlert.confirm(response.data.message + "회원가입을 진행하시겠습니까?")
//           .then(async result => {
//             await userStore.getSocialProfileFromServer(response.data.id);
//             if (result) {
//               const profile = userStore.profile;
//               const signUpdata = {
//                 identifier: profile.identifier,
//                 name: profile.name,
//                 provider: profile.provider,
//                 certification: "Y"
//               }
//               const result = await userStore.signUp(signUpdata);
//               if (result) {
//                 await userStore.getUser();
//                 router.push('/');
//               }
//             } else {
//               userStore.removeSocialProfile();
//             }
//           });
//     } else {
//       VueSimpleAlert.alert(response.data.message);
//     }
//   }
// }
</script>

<template>
  <div></div>
</template>

<style scoped>

</style>