<script setup>
import {useModalStore} from "@/stores/modal.js";
import {computed, defineAsyncComponent} from "vue";

const props = defineProps(['datas']);
const modalStore = useModalStore();

const datas = props.datas === undefined ? modalStore.datas : props.datas;
const view = '';

const loadComponent = computed(() => {
  return defineAsyncComponent(() => import(`@/components/modal/${modalStore.name}.vue`));
});

</script>

<template>
  <transition
      name="modal"
      appear
      enter="opacity: 0; transition: opacity 0.4s ease"
      enter-to="transition: opacity 0.4s ease"
      leave="transition: opacity 0.4s ease"
      leave-to="opacity: 0; transition: opacity 0.4s ease"
  >
    <div class="modal">
      <section class="modal">
        <div class="modal__window">
          <div class="modal__content">
            <slot name="content">
              <component :is="loadComponent"></component>
            </slot>
          </div>
        </div>
        <div class="modal__overlay" @click.self="modalStore.close()"></div>
      </section>
    </div>
  </transition>
</template>

<style scoped>
.modal {
  position: absolute;
  display: flex;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  justify-content: center;
  align-items: center;
  z-index: 1001;
}
.modal__window {
  position: absolute;
  display: flex;
  flex-direction: column;
  /* overflow: hidden; */
  z-index: 15;
  background-color: #ffffff;
  border-radius: 6px;
  border: 1px solid #cbcbcb;
  box-shadow: 1px 1px 1px #cbcbcb;
}

div.modal__window div.modal__content {
  width: 100%;
  height: 100%;
}

.modal__footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.modal__overlay {
  position: absolute;
  width: 100%;
  height: 100%;

  background-color: black;
  opacity: 0.8;
}

/* 상황에 따라 transition 변경가능 enter,leave class는 상단 문서 참고 */
modal-enter,
modal-leave-to {
  opacity: 0;
  transition: opacity 0.4s ease;
}

modal-enter-to,
modal-leave {
  transition: opacity 0.4s ease;
}
</style>