<script setup>
import ModalTitle from "@/components/modal/ModalTitle.vue";
import ValidationPhoneBody from "@/components/modal/sub/ValidationPhoneBody.vue";

</script>

<template>
  <div class="validate-phone-modal basic-modal">
    <ModalTitle value="Movie Site 휴대번호 인증"></ModalTitle>

    <div class="modal-content">
      <div class="modal-content-main">
        <ValidationPhoneBody mode="CREATE"></ValidationPhoneBody>
      </div>
    </div>
  </div>
</template>

<style scoped>
.validate-phone-modal {
  width: 24rem;
  height: 14rem
}
</style>