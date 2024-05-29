<script setup>
import UserCard from "@/components/sub/UserCardComponent.vue";

const props = defineProps(['comment']);

const comment = props.comment;


</script>

<template>
  <div class="comment-item-box">
    <!-- Writer & RegDate -->
    <div style="width: 10rem; margin-right: 1rem; border-right: 0.1rem solid #f2f2f2;">
      <UserCard :member="comment.writer"></UserCard>
    </div>

    <div style="height: 100%;"></div>

    <!-- Comment Content -->
    <div class="comment-item-content">
      <p>{{ comment.content }}</p>
    </div>

    <!-- Comment Options -->
    <div class="comment-option-box">
      <button class="button-modify-minimalize" type="button"></button>
      <button class="button-delete-minimalize" type="button"></button>
      <button class="button-report-minimalize" type="button"></button>
    </div>
  </div>
</template>

<style scoped>
.comment-item-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.comment-item-content {
  width: 100%;
}

.comment-option-box {
  display: flex;
  width: fit-content;
}

.comment-option-box > button {
  width: 2rem;
  height: 2rem;
  margin-left: 0.2rem;
}
</style>