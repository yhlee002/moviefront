<script setup>
import {useModalStore} from "@/stores/modal.js";
import {useUserStore} from "@/stores/user.js";
import {ref} from "vue";
import {useMessageStore} from "@/stores/message.js";
import {useRouter} from "vue-router";
import Swal from 'sweetalert2';

const router = useRouter();

const modalStore = useModalStore();
const userStore = useUserStore();
const messageStore = useMessageStore();

let pwdBlankStatus = ref(false);
let pwdRegExpStsatus = ref(false);

function updatePwdBlankStatus(value) {
  pwdBlankStatus.value = value;

  if (pwdBlankStatus.value) {
    messageStore.updatePwdMsg("");
  } else {
    messageStore.updatePwdMsg("비밀번호를 입력해주세요.");
  }
}

function updatePwdRegExpStsatus(value) {
  pwdRegExpStsatus.value = value;

  if (pwdRegExpStsatus.value) {
    messageStore.updatePwdMsg("");
  } else {
    messageStore.updatePwdMsg("비밀번호는 최소 8자리에 숫자, 문자, 특수문자 각각 1개 이상을 포함해야합니다.");
  }
}

function resetRefs() {
  updatePwdBlankStatus(false);
  updatePwdRegExpStsatus(false);
}

function showSecret(elemId) {
  const input = document.getElementById(elemId);
  input.type = 'text';
}

function hideSecret(elemId) {
  const input = document.getElementById(elemId);
  input.type = 'password';
}

function passwordCheck() {
  const pwd = document.getElementById('newPwdInput').value;
  checkRegExp(pwd);
  return true;
}

function passwordConfCheck() {
  const pwd = document.getElementById('newPwdInput').value;
  const pwd2 = document.getElementById('newPwdInput2').value;

  if (!pwd2) {
    messageStore.updatePwdConfMsg("확인을 위해 비밀번호를 한번 더 입력해주세요.");
    return false;
  } else if (pwd !== pwd2) {
    messageStore.updatePwdConfMsg("비밀번호가 일치하지 않습니다. 다시 입력해주세요.");
    return false;
  } else {
    messageStore.updatePwdConfMsg("");
    return true;
  }
}

function checkRegExp(pwd) {
  if (!pwd) {
    updatePwdBlankStatus(false);
    return false;
  } else {
    updatePwdBlankStatus(true);

    // (2) pwd 정규식 검사
    let pwdReg = RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/);
    if (pwdReg.test(pwd)) {
      updatePwdRegExpStsatus(true);
      return true;
    } else {
      updatePwdRegExpStsatus(false);
      return false;
    }
  }
}

async function submit() {
  if (!passwordCheck() || !passwordConfCheck()) return;

  const memNo = modalStore.data.memNo;
  const pwd = document.getElementById('newPwdInput').value;

  const result = await userStore.updatePassword(memNo, pwd);

  if (result.count > 0) {
    Swal.fire({
      text: '비밀번호 변경에 성공하였습니다. 다시 로그인해주세요.',
      icon: 'success'
    })
    router.push("/sign-in")
  } else {
    Swal.fire({
      text: '비밀번호 변경에 실패하였습니다. 다시 시도해주세요.',
      icon: 'error'
    })
  }
  modalStore.close();
  modalStore.setData = {};
  resetRefs();
}
</script>

<template>
  <div class="modal-content">
    <div class="modal-content-main">
      <div style="display: flex; flex-direction: column; justify-content: center;">
        <small>💌 비밀번호를 새로 설정해주세요.</small>
        <div class="reset-pwd-input-box" style="margin-top: 0.4rem;">
          <label for="newPwdInput">비밀번호</label>
          <input id="newPwdInput" type="password" @blur="passwordCheck">
          <img @click="showSecret('newPwdInput')" @mouseleave="hideSecret('newPwdInput')" src="@/assets/images/icons/icons8-eye-48.png">
        </div>
        <small class="message-small-error">{{messageStore.pwdMsg}}</small>

        <div class="reset-pwd-input-box">
          <label for="newPwdInput2">재확인</label>
          <input id="newPwdInput2" type="password" @blur="passwordConfCheck">
          <img @click="showSecret('newPwdInput2')" @mouseleave="hideSecret('newPwdInput2')" src="@/assets/images/icons/icons8-eye-48.png">
        </div>
      </div>
      <small class="message-small-error">{{messageStore.pwdConfMsg}}</small>

      <div class="modal-button-box">
        <button id="updatePwdBtn" type="button" @click="submit">변경하기</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reset-pwd-input-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reset-pwd-input-box label {
  width: 4rem;
}

.reset-pwd-input-box img {
  cursor: pointer;
  width: 1rem;
  height: 1rem;
  margin-left: 0.5rem;
}

.message-small-error {
  color: red;
  height: 0.8rem;
}

#newPwdInput, #newPwdInput2 {
  width: 8rem;
}
</style>