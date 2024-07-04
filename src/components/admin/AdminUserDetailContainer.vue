<script setup>
import AdminUserDetail from "@/components/admin/AdminUserDetailComponent.vue";

const props = defineProps(['memNo']);
</script>

<template>
  <div id="index_userdetail" class="wrapper-block">
    <div class="inner">
      <div class="inner-block">
        <div class="content">
          <div class="block-title-box">
            <h2 class="block-title">회원정보 상세 조회</h2>
          </div>

          <AdminUserDetail :memNo="memNo"></AdminUserDetail>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>