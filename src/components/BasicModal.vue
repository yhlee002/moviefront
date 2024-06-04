<script setup>
import '@/assets/css/modal.css'

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
  <!--  <transition-->
  <!--      name="modal"-->
  <!--      appear-->
  <!--      enter="opacity: 0; transition: opacity 0.4s ease"-->
  <!--      enter-to="transition: opacity 0.4s ease"-->
  <!--      leave="transition: opacity 0.4s ease"-->
  <!--      leave-to="opacity: 0; transition: opacity 0.4s ease"-->
  <!--  >-->
  <Transition name="modal">
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
  </Transition>
</template>

<style scoped>
/* Transition */
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s ease;
}

</style>