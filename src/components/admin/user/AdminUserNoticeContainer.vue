<script setup>
import AdminUserNotice from "@/components/admin/user/sub/AdminUserNoticeComponent.vue";

const props = defineProps(['memNo']);
</script>

<template>
  <div id="index_user_notices" class="wrapper-block">
    <div class="inner">
      <div class="inner-block">
        <div class="content">
          <div class="block-title-box">
            <h2 class="block-title">회원이 작성한 공지사항</h2>
          </div>

          <AdminUserNotice :memNo="memNo"></AdminUserNotice>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>