<script setup>
import AdminUserBoard from "@/components/admin/user/sub/AdminUserBoardComponent.vue";

const props = defineProps(['memNo']);
</script>

<template>
  <div id="index_user_boards" class="wrapper-block">
    <div class="inner">
      <div class="inner-block">
        <div class="content">
          <div class="block-title-box">
            <h2 class="block-title">회원이 작성한 게시글</h2>
          </div>



          <AdminUserBoard :memNo="memNo"></AdminUserBoard>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>