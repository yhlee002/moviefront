<script setup>
import {inject, ref} from "vue";
import {useUserStore} from "@/stores/user.js";
import {useModalStore} from "@/stores/modal";
import VueSimpleAlert from "vue3-simple-alert";

// const emitter = inject('emitter');

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

  if (result.status) {
    modalStore.result = true;

    emitter.emit('phone-validation', {result: true, phone: phone});
    modalStore.close();
  } else {
    if (result.message === 'expired') {
      VueSimpleAlert.alert("인증 시간이 만료되었습니다. 다시 전송해주세요.");
      updateSendStatus(false);

      return;
    } else if (result.message === 'not matched') {
      VueSimpleAlert.alert("인증번호가 일치하지 않습니다. 다시 확인해주세요.");
    }
  }
}

async function sendMessage() {
  const phone = document.getElementById('phoneInput').value;
  const input = document.getElementById('certKeyInput');
  const reSendMsg = document.getElementById('reSendMsg');

  if (!checkPhoneRegExp(phone)) return;

  if (!await checkPhoneDuplication(phone)) return;

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
  <div class="validate-phone-modal">
    <div class="modal-title">
      Movie Site 휴대번호 인증
    </div>
    <div class="modal-content">
      <div class="modal-content-main">
        <input type="tel" id="phoneInput" name="validate-phone" placeholder="휴대전화 번호를 '-'없이 입력해주세요." autofocus :readonly="sendStatus">
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
            전송하기</button>
          <button id="okBtn" type="button" @click="validateCertKey()" :disabled="!sendStatus">확인</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.validate-phone-modal {
  width: 24rem;
  height: 14rem
}

.validate-phone-modal input {
  height: 1.2rem;
  padding: 0 0.2rem;
  font-size: 0.9rem;
  text-align: center;
}

.validate-phone-modal .modal-title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 2rem;
  /* border-bottom: 0.1rem solid #cccccc; */
  background-color: #333333;
  color: #dfdfdf;
}

.validate-phone-modal .modal-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100% - 2rem);
}

.validate-phone-modal .modal-content .modal-content-main {
  display: flex;
  flex-direction: column;
  width: 16em;
  font-size: 0.9rem;
}

.validate-phone-modal .modal-content .modal-content-main p {
  margin-right: 0.5rem;
  font-size: 0.9rem;
}

.validate-phone-modal .modal-content .modal-content-main .validate-box {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  justify-content: end;
}

.validate-phone-modal .modal-content .modal-content-main .validate-box .validate-code-box {
  display: flex;
  justify-content: center;
  align-items: center;
}

.validate-phone-modal .modal-content .modal-content-main .validate-box .validate-time-box {
  display: flex;
  justify-content: end;
  width: 100%;
  margin-top: 0.2rem;
}

.validate-phone-modal .modal-content .modal-content-main .validate-box .validate-time-box small {
  color: #8f1010;
}

.validate-phone-modal .modal-content .modal-content-main .modal-button-box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 1rem
}

.validate-phone-modal .modal-content .modal-content-main .modal-button-box button {
  height: 2rem;
  padding: 0 1rem;
  font-size: 0.9rem;
}

#sendCertMsgBtn {
  margin-right: 1rem;
}

/*
#okBtn {

}
 */
</style>