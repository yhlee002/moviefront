<script setup>
import AdminUserComment from "@/components/admin/user/sub/AdminUserCommentImpComponent.vue";

const props = defineProps(['memNo']);
</script>

<template>
  <div id="index_userdetail" class="wrapper-block">
    <div class="inner">
      <div class="inner-block">
        <div class="content">
          <div class="block-title-box">
            <h2 class="block-title">회원이 작성한 댓글</h2>
          </div>

          <AdminUserComment :memNo="memNo"></AdminUserComment>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>