<script setup>
import ModalTitle from "@/components/modal/ModalTitle.vue";
import ResetPasswordBody from "@/components/modal/sub/ResetPasswordBody.vue";

</script>

<template>
  <div class="find-pwd-modal basic-modal">
    <ModalTitle value="비밀번호 변경"></ModalTitle>

    <div class="modal-content">
      <div class="modal-content-main" style="justify-content: center;">
        <ResetPasswordBody></ResetPasswordBody>
      </div>
    </div>
  </div>
</template>

<style scoped>
.find-pwd-modal {
  width: 24rem;
  height: 14rem
}
</style>