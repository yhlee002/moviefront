<script setup>
import AdminUserLoginLog from "@/components/admin/user/sub/AdminUserLoginLogsComponent.vue";

const props = defineProps(['memNo']);
</script>

<template>
  <div id="index_user_notices" class="wrapper-block">
    <div class="inner">
      <div class="inner-block">
        <div class="content">
          <div class="block-title-box">
            <h2 class="block-title">회원 로그인 기록</h2>
          </div>

          <AdminUserLoginLog :memNo="memNo"></AdminUserLoginLog>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>