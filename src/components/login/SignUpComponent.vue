<script setup>

import {mapStores, storeToRefs} from 'pinia';
import {useUserStore} from '@/stores/user.js';
import {useMessageStore} from "@/stores/message.js";
import Swal from "sweetalert2";
import {useModalStore} from "@/stores/modal.js";
import {ref} from "vue";
import {useRouter} from "vue-router";
import emitter from '@/eventBus/emitter';
import Logo from "@/components/fragment/LogoComponent.vue";

const router = useRouter();
const params = router.currentRoute.value.query;

const modalStore = useModalStore();
const userStore = useUserStore();
const messageStore = useMessageStore();
mapStores(messageStore);

const provider = ref('none');
const identifier = ref('');
const password = ref('');
const password2 = ref('');
const name = ref('');
const phone = ref('');


if (params.type === 'oauth') {
  Swal.fire({
    text: '회원가입을 위해 추가 정보를 입력해주세요.',
    icon: 'info'
  })

  const result = await userStore.getOauthUserInfoFromSession();
  const sessionUser = result.data;

  identifier.value = sessionUser.identifier + "@socialuser.com";
  name.value = sessionUser.name;
  provider.value = sessionUser.provider;
}

let emailCk = false;
let emailDupCk = false;
let nameCk = false;
let pwdCk = false;

// password check 관련 flags
let pwdCk_pwdBlank = false;
let pwdCk_pwdReg = false;
let pwdCk_pwdConfBlank = false;
let pwdCk_auth = false;

const resetMessage = function () {
  messageStore.updateEmailMsg('');
  messageStore.updateNameMsg('');
  messageStore.updatePwdMsg('');
  messageStore.updatePwdConfMsg('');
}

const signUp = async function () {
  const form = document.getElementById('form-signup');

  const identifier = form.identifier.value;
  const name = form.name.value;
  const password = form.password.value;
  const phone = form.phone.value;
  const provider = form.provider.value;

  if (params.type === 'oauth') {
    if (!nameCk) {
      form.name.focus();
      return;
    } else if (!phone) {
      Swal.fire({
        text: '연락처는 비어있을 수 없습니다.',
        icon: 'warning'
      })
      return;
    }

    const signUpdata = {
      identifier: identifier,
      name: name,
      phone: phone,
      provider: provider
    }
    const result = await userStore.signUp(signUpdata);

    if (result) {
      router.push('/');
      // spinner
    }
  } else {
    if (!emailCk) {
      form.identifier.focus();
      return;
    } else if (!emailDupCk) {
      Swal.fire({
        text: '이메일 중복 검사를 수행해주세요.',
        icon: 'warning'
      })
      return;
    } else if (!nameCk) {
      form.name.focus();
      return;
    } else if (!pwdCk) {
      form.password.focus();
      return;
    } else if (!phone) {
      Swal.fire({
        text: '연락처는 비어있을 수 없습니다.',
        icon: 'warning'
      })
      return;
    }

    const signUpdata = {
      identifier: identifier,
      name: name,
      password: password,
      phone: phone,
      provider: provider
    }
    const result = await userStore.signUp(signUpdata);

    if (result) {
      router.push('/');
      // spinner
      Swal.fire({
        text: '회원가입을 축하합니다. 이메일 인증을 완료해주세요.',
        icon: 'success'
      })
    }
  }
}

// 이메일 - 유효성 검사
async function checkIdentifier() {
  const email = document.querySelector('#form-signup #identifier').value;
  if (email === "" || email.length === 0) {
    messageStore.updateEmailMsg("이메일을 입력해주세요.");
  } else {
    // 이메일 형식 검사
    let emailCheck = RegExp(/^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/);
    if (emailCheck.test(email)) {
      emailCk = true;
      messageStore.updateEmailMsg("");
    } else {
      emailCk = false;
      messageStore.updateEmailMsg("올바른 이메일 형식이 아닙니다.");
    }
  }
}

// 이메일 - 중복 검사
async function validateIdentifierDuplication() {
  const email = identifier.value;

  const validated = await userStore.validateIdentifierWithProvider(email, 'none');

  if (validated.count === 0) {
    emailDupCk = true;
    Swal.fire({
      text: '사용 가능한 이메일입니다.',
      icon: 'info'
    })
  } else {
    emailDupCk = false;
    Swal.fire({
      text: '이미 가입된 이메일입니다.',
      icon: 'info'
    })
  }
}

// 이름 - 유효성 + 중복 검사
async function checkName() {
  const name = document.querySelector('#form-signup input[name=name]').value;

  if (!name) {
    nameCk = false;
    messageStore.updateNameMsg("유저명을 입력해주세요.");
  } else {
    // 이름 형식 검사 - 한글, 영문(대,소), 숫자 가능, 띄워쓰기 가능
    let nameReg = RegExp(/^[가-힣|a-z|A-Z|0-9|\S]+$/); // \S : non space <-> \s(space)
    let nameReg2 = RegExp(/[`~!@#$%^&*|'";:\/?]/gi);

    if (nameReg.test(name) && !nameReg2.test(name)) {
      nameCk = false;
      if (name.length < 2 || name.length > 11) {
        messageStore.updateNameMsg('닉네임은 2-11자여야합니다.');

      } else {
        const validated = await userStore.validateName(encodeURIComponent(name));
        if (validated.count === 0) {
          nameCk = true;
          messageStore.updateNameMsg("사용가능한 회원명입니다.");
        } else messageStore.updateNameMsg("이미 존재하는 회원명입니다.");
      }
    } else {
      messageStore.updateNameMsg("회원명은 한글, 영문(대소문자), 숫자만 가능하며, 띄워쓰기는 불가능합니다.");
    }
  }
  return nameCk;
}

// 비밀번호 - 유효성 + 일치 여부 검사
function checkPassword() {
  if (params.type === 'oauth') return;

  const pwd = document.querySelector('#form-signup #password').value;

  // (1) pwd 빈값 검사
  if (pwd === "" || pwd.length === 0) {
    pwdCk_pwdBlank = false;
    messageStore.updatePwdMsg("비밀번호를 입력해주세요.");
  } else {
    pwdCk_pwdBlank = true;

    // (2) pwd 정규식 검사
    let pwdReg = RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/);
    if (pwdReg.test(pwd)) {
      pwdCk_pwdReg = true;
      // 사용 가능한 비밀번호일때 경고 메세지 숨김
      messageStore.updatePwdMsg('');
    } else {
      pwdCk_pwdReg = false;
      messageStore.updatePwdMsg("비밀번호는 최소 8자리에 숫자, 문자, 특수문자 각각 1개 이상을 포함해야합니다.");
    }
  }
}

function checkPasswordConfirm() {
  if (params.type === 'oauth') return;

  const pwd = document.querySelector('#form-signup #password').value;
  const pwdConf = document.querySelector('#form-signup #passwordConf').value;

  if (pwdCk_pwdBlank) {
    if (pwdConf === "" || pwdConf.length === 0) {
      messageStore.updatePwdConfMsg("비밀번호를 한번 더 입력해주세요.")
    } else {
      pwdCk_pwdConfBlank = true;

      // (4)pwd값과 pwdCk의 값 일치 검사
      if (pwdCk_pwdBlank && pwd === pwdConf) { // pwdCk_pwdConfBlank는 이미 true
        pwdCk_auth = true;
        messageStore.updatePwdConfMsg('');

      } else {
        messageStore.updatePwdConfMsg("비밀번호가 일치하지 않습니다.");
      }
    }
  } else {
    messageStore.updatePwdConfMsg("비밀번호를 먼저 입력해주세요.");
  }

  if (pwdCk_pwdBlank && pwdCk_pwdConfBlank && pwdCk_pwdReg && pwdCk_auth) {
    pwdCk = true;
  }
}

function showSecret(elemId) {
  const input = document.getElementById(elemId);
  input.type = 'text';
}

function hideSecret(elemId) {
  const input = document.getElementById(elemId);
  input.type = 'password';
}

emitter.on('phone-validation', param => {
  if (!param.target === 'sign-up') return;
  if (param.result) {
    phone.value = param.data.phone;
  }
});
</script>

<template>
  <div id="index_signup" class="wrapper-block">
    <div class="inner">
      <div class="inner-block">
        <div class="content">
          <div class="greeting-message">
            <Logo></Logo>
            <span>에 오신 것을 환영합니다.</span>
          </div>

          <div class="form-box align-center">
            <form id="form-signup" action="/member" method="post">
              <input name="type" id="type" value="o" hidden="hidden">
<!--              <input type="text" name="_csrf" value="" hidden="hidden">-->
              <input name="provider" v-model="provider" hidden="hidden">
              <div class="form-group">
                <label for="identifier">이메일</label>
                <input id="identifier" v-model="identifier" @blur="checkIdentifier()" type="email" name="identifier" :readonly="params.type === 'oauth'">
                <button id="emailValidationBnt" @click="validateIdentifierDuplication()" type="button"
                        class="button-default" v-if="params.type !== 'oauth'">중복 검사
                </button>
              </div>
              <div class="form-message-box">
                <div style="width: 7.9rem"></div>
                <small id="emailMessage" style="color: #911919"
                       v-show="messageStore.emailMsg !== ''">{{ messageStore.emailMsg }}</small>
              </div>

              <div class="form-group">
                <label for="name">이름</label>
                <input id="name" v-model="name" @blur="checkName()" type="text" name="name">
              </div>
              <div class="form-message-box">
                <div style="width: 7.9rem"></div>
                <small id="nameMessage" :style="nameCk ? {color: '#ffffff'} : {color: '#911919'}"
                       v-show="messageStore.nameMsg !==''">{{ messageStore.nameMsg }}</small>
              </div>

              <div class="form-group">
                <label for="password">비밀번호</label>
                <input id="password" v-model="password" @blur="checkPassword()" type="password" name="password" :readonly="params.type === 'oauth'">
                <img class="show-secret-button" @click="showSecret('password')" @mouseleave="hideSecret('password')" src="@/assets/images/icons/icons8-eye-48.png" style="margin-left: 1.3rem">
              </div>
              <div class="form-message-box">
                <div style="width: 7.9rem"></div>
                <small id="pwdMessage" :style="pwdCk ? {color: '#ffffff'} : {color: '#911919'}"
                       v-show="messageStore.pwdMsg !== ''">{{ messageStore.pwdMsg }}</small>
              </div>

              <div class="form-group">
                <label for="passwordConf">비밀번호 재확인</label>
                <input id="passwordConf" v-model="password2" @blur="checkPasswordConfirm()" type="password" name="passwordConf" :readonly="params.type === 'oauth'">
                <img class="show-secret-button" @click="showSecret('passwordConf')" @mouseleave="hideSecret('passwordConf')" src="@/assets/images/icons/icons8-eye-48.png" style="margin-left: 1.3rem">
              </div>
              <div class="form-message-box">
                <div style="width: 7.9rem"></div>
                <small id="pwdConfMessage" style="color: #911919"
                       v-show="messageStore.pwdConfMsg !== ''">{{ messageStore.pwdConfMsg }}</small>
              </div>

              <div class="form-group">
                <label for="phone">휴대전화 번호</label>
                <input id="phone" v-model="phone" type="tel" name="phone" readonly>
                <button id="phoneValidationBnt" @click="modalStore.openModal('ValidatePhone');" type="button"
                        class="button-default">인증하기
                </button>
              </div>

              <div class="form-message-box">
                <small id="phoneComment">당사는 귀하의 연락처를 외부와 공유하지 않으며, 이메일 또는 패스워드 찾기, 고객지원
                  등의 목적만을 위해 연락처를 수집합니다.</small>
              </div>

              <ul class="button-box">
                <input v-if="params.type !== 'oauth'" class="button-large" @click="resetMessage()" type="reset" name="signup-form-reset" value="초기화">
                <button class="button-large submit" type="button" name="submit"
                        @click="signUp()">확인
                </button>
              </ul>
            </form>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.show-secret-button {
  cursor: pointer;
  width: 1.2rem;
  height: 1.2rem;
}
</style>