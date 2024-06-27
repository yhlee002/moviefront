<script setup>
import {ref} from "vue";
import {useUserStore} from "@/stores/user.js";
import {useModalStore} from "@/stores/modal.js";
import VueSimpleAlert from "vue3-simple-alert";

import emitter from '@/eventBus/emitter.js';

const props = defineProps(['mode']);
const userStore = useUserStore();
const modalStore = useModalStore();

let sendStatus = ref(false);
let timer;
let min = ref(3);
let sec = ref(0);

function updateSendStatus(val) {
  sendStatus.value = val;
}

function updateMin(val) {
  min.value = val;
}

function updateSec(val) {
  sec.value = val;
}

async function validateCertKey() {
  const phone = document.getElementById('phoneInput').value;
  const key = document.getElementById('certKeyInput').value;

  if (!key) {
    VueSimpleAlert.alert("인증번호를 입력해주세요.");
    return;
  }

  const result = await userStore.validateCertificationMessage(phone, key);

  if (result.data.status) {
    if (props.mode === 'CREATE') {
      modalStore.result = true;

      emitter.emit('phone-validation', {target: 'sign-up', result: true, data: {phone: phone}});
      modalStore.close();
    } else { // 이메일 또는 비밀번호 찾기일 경우
      emitter.emit('phone-validation', {target: 'find-account', result: true, data: {phone: phone}});
    }
  } else {
    if (result.data.message === 'expired') {
      VueSimpleAlert.alert("인증 시간이 만료되었습니다. 다시 전송해주세요.");
      updateSendStatus(false);

      return;
    } else if (result.data.message === 'not matched') {
      VueSimpleAlert.alert("인증번호가 일치하지 않습니다. 다시 확인해주세요.");
    }
  }
}

async function sendMessage() {
  const phone = document.getElementById('phoneInput').value;
  const input = document.getElementById('certKeyInput');
  const reSendMsg = document.getElementById('reSendMsg');

  if (!checkPhoneRegExp(phone)) return;

  // 회원가입 시에만 중복검사 수행
  if (props.mode === 'CREATE') {
    if (!await checkPhoneDuplication(phone)) {
      VueSimpleAlert.alert("이미 가입된 번호입니다. 계정찾기를 해주세요.");
      return;
    }
  }

  await userStore.sendCertificationMessage(phone);
  updateSendStatus(true);
  // 한번이라도 전송하고나면 '다시 전송하기'로 변경되도록
  reSendMsg.style.display = 'inline';
  input.focus();
  startTimer();
}

// 전화번호(unique key) 존재 유무 확인
async function checkPhoneDuplication(phone) {
  const result = await userStore.validatePhone(phone);
  return result.count === 0;
}

function checkPhoneRegExp(phone) {
  const phoneRegExp = RegExp(/^(01[016789]{1})(\d{3,4})(\d{4})$/);

  if (!phone) {
    VueSimpleAlert.alert("휴대전화 번호를 입력해주세요.");
    return false;

  } else if (!phoneRegExp.test(phone)) {
    VueSimpleAlert.alert("휴대전화 번호 양식을 확인해주세요.");
    return false;

  } else return true;
}

function startTimer() {
  updateMin(3);
  updateSec(0);
  timer = setInterval(countDown, 1000);
}

function countDown() {
  if (sec.value !== 0) updateSec(sec.value - 1);
  else {
    if (min.value !== 0) {
      updateMin(min.value - 1);
      updateSec(59);
    } else clearTimer();
  }
}

function clearTimer() {
  clearInterval(timer);
  updateSendStatus(false);
}
</script>

<template>
  <input type="tel" id="phoneInput" name="validate-phone" placeholder="휴대전화 번호를 '-'없이 입력해주세요." autofocus
         :readonly="sendStatus">
  <div class="validate-box">
    <div class="validate-code-box">
      <p>인증번호</p>
      <input type="text" id="certKeyInput" name="validate-phone-code">
    </div>

    <div class="validate-time-box">
      <small>{{ `${min}:${String(sec).padStart(2, '0')}` }} / 3:00</small>
    </div>
  </div>

  <div class="modal-button-box">
    <button id="sendCertMsgBtn" type="button" @click="sendMessage()" :disabled="sendStatus">
      <span id="reSendMsg" style="display: none">다시 </span>
      전송하기
    </button>
    <button id="okBtn" type="button" @click="validateCertKey()" :disabled="!sendStatus">확인</button>
  </div>
</template>

<style scoped>
.validate-box {
  display: flex;
  flex-direction: column;
  justify-content: end;
}

.validate-box .validate-code-box {
  display: flex;
  justify-content: center;
  align-items: center;
}

.validate-box .validate-time-box {
  display: flex;
  justify-content: end;
  width: 100%;
  margin-top: 0.2rem;
}

.validate-box .validate-time-box small {
  color: #8f1010;
}

#phoneInput {
  width: 14rem;
}

#sendCertMsgBtn {
  margin-right: 1rem;
}
</style>