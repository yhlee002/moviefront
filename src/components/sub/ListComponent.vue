<script setup>
const props = defineProps(['list', 'category', 'fieldShow', 'recommended']);

const fieldShow = props.fieldShow ?? true;
const recommended = props.recommended ?? false;
</script>

<template>
  <div class="list-item-field-box" v-if="fieldShow">
    <ul class="list-item-field-group">
      <li><p class="list-item-fields">제목</p></li>
      <li><p class="list-item-fields">작성자</p></li>
      <li><p class="list-item-fields">조회수</p></li>
    </ul>
  </div>
  <div :id="`list-item-${item.id}`" class="list-item-box" v-for="item in props.list" :key="item.id">
    <ul class="list-item-group">
      <li>
        <router-link :to="`/${category}/${item.id}`">
          <p class="list-item-title">{{ item.title }}</p>
          <p class="list-item-writer">{{ item.writerName }}</p>

          <div class="list-item-etc">
            <div class="list-icons">
              <img src="@/assets/images/icons/icons8-eye-48.png" alt="조회수"/>
              <p class="list-item-views">{{ item.views }}</p>
            </div>

            <div class="list-icons">
              <img src="@/assets/images/icons/icons8-comment-50.png" alt="댓글수"/>
              <p class="list-item-views">{{ item.commentSize }}</p>
            </div>

            <div class="list-icons" v-if="recommended">
              <img src="@/assets/images/icons/icons8-heart-30.png" alt="추천수"/>
              <p class="list-item-recommended">{{ item.recommended }}</p>
            </div>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.list-item-field-box, .list-item-box {
  font-size: 1rem;
}

.list-item-field-box > ul.list-item-field-group {
  display: flex;
  flex-direction: row;
}

/*
.list-item-field-box > ul.list-item-field-group > li:nth-child(1) > p.list-item-fields {
  width: 70%;
}

.list-item-field-box > ul.list-item-field-group > li:nth-child(2) > p.list-item-fields {
  width: 20%;
}

.list-item-field-box > ul.list-item-field-group > li:nth-child(3) > p.list-item-fields {
  width: 10%;
}*/

.list-item-box > ul.list-item-group > li > a > p.list-item-views:nth-child(3) {
  display: flex;
  justify-content: center;
}

.list-item-field-box > ul.list-item-field-group > li,
.list-item-box > ul.list-item-group > li {
  display: flex;
  height: 3rem;
  align-items: center;
  justify-content: center;
  border-bottom: 0.1rem solid #f2f2f2;
}

.list-item-box > ul.list-item-group > li > a {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  color: #000000;
}

.list-item-box > ul.list-item-group > li > a p.list-item-title {
  /*
  min-width: 22rem;
  max-width: 30rem;
   */
  width: 70%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-item-box > ul.list-item-group > li > a p.list-item-writer {
  /*
  min-width: 10rem;
  max-width: 14rem;
   */
  width: 20%;
}

.list-item-box > ul.list-item-group > li .list-item-etc {
  /*
min-width: 10rem;
max-width: 14rem;
   */
  display: flex;
  width: 10%;
}

.list-icons {
  display: flex;
  flex-direction: row;
  width: fit-content;
}

.list-icons img {
  width: 1rem;
  height: 1rem;
  margin-right: 0.2rem
}

.list-icons p {
  margin-right: 0.4rem;
}
</style>