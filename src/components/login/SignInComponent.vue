<script setup>
import {storeToRefs} from "pinia";
import {useRouter} from "vue-router";
import {useMessageStore} from "@/stores/message.js";
import {useUserStore} from "@/stores/user.js";
import {useModalStore} from "@/stores/modal.js";
import VueSimpleAlert from "vue3-simple-alert";
import Logo from "@/components/fragment/LogoComponent.vue";

const router = useRouter();
const userStore = useUserStore();
const modalStore = useModalStore();
const messageStore = useMessageStore();
const {oauthMsg} = storeToRefs(messageStore);

// cert 정보 넘어왔는지 확인
const params = router.currentRoute.value.query; // sign-in?cert=mail&memNo=[]&certKey=[]

if (params.cert === 'mail') {
  const memNo = params.memNo;
  const certKey = params.certKey;

  const result = await userStore.validateCertificationMail(memNo, certKey);
  if (result.data.status || result.data.status === 200) {
    if (result.data.message === 'SIGNUP') {
      router.push("/sign-in");
    } else if (result.data.message === 'FINDPASSWORD') {
      modalStore.setData({memNo: memNo});
      modalStore.openModal('ResetPassword');
    }
  }
}


const enterSubmit = function () {
  if (window.event.keyCode === 13) submitForm();
}
const submitForm = async function () {
  const loginData = {
    identifier: document.getElementById('f-s-identifier').value,
    password: document.getElementById('f-s-password').value
  }

  if (!checkParams(loginData)) {
    return;
  }

  const result0 = await userStore.loginCheck(loginData);
  if (result0 === "didn't matching" || result0 === "not user") {
    VueSimpleAlert.alert("이메일 또는 비밀번호를 확인해주세요.", "로그인", "info");
    return false;
  } else if (result0 === "not certified") {
    VueSimpleAlert.confirm(
        "이메일 인증이 필요한 계정입니다. 이메일 재전송을 원하십니까?", "로그인", "info")
        .then(async result => {
          if (result) {
            const sendResult = await userStore.sendCertificationMail(loginData.identifier, 'SIGNUP');
            const status = sendResult.data.status;
            if (status) {
              VueSimpleAlert.alert("메일 전송에 성공했습니다. 인증은 10분간 유효합니다.");
            } else {
              VueSimpleAlert.alert("메일 전송에 실패했습니다.");
            }
          }
        })
        .finally();
    return false;
  } else {
    await userStore.login(loginData);
    if (userStore.user.memNo) {
      router.push("/");
    }
  }
}

const checkParams = function (loginData) {
  let checked = false;

  let reg = RegExp(/^[A-Za-z0-9_.-]+@[A-Za-z0-9-]+\.[A-Za-z0-9-]+/);
  if (!loginData.identifier) {
    VueSimpleAlert.alert("이메일을 입력해주세요.", "로그인", "info");
    return checked;
  } else if (!reg.test(loginData.identifier)) {
    VueSimpleAlert.alert("이메일 양식에 맞지 않습니다.", "로그인", "info");
    return checked;
  }

  if (!loginData.password) {
    VueSimpleAlert.alert("비밀번호를 입력해주세요.", "로그인", "info");
  } else {
    checked = true;
  }
  return checked;
}

function showSecret(elemId) {
  const input = document.getElementById(elemId);
  input.type = 'text';
}

function hideSecret(elemId) {
  const input = document.getElementById(elemId);
  input.type = 'password';
}
</script>

<template>
  <div id="index_signin" class="wrapper-block">
    <div class="inner">
      <div class="inner-block">
        <div class="content">
          <div class="greeting-message">
            <Logo></Logo>
            <span>에 오신 것을 환영합니다.</span>
          </div>

          <input id="message-oauth" hidden="hidden" v-if="oauthMsg !== null"
                 :value="oauthMsg">
          <div class="form-box align-center">
            <form id="form-signin" action="/api/sign-in" method="post">
              <!--              <input type="text" name="_csrf" value="" hidden="hidden">-->
              <div class="form-group">
                <label for="identifier">이메일</label>
                <input id="f-s-identifier" type="text" name="identifier" @keydown="enterSubmit()" required>
              </div>
              <!-- password-->
              <div class="form-group">
                <label for="password">비밀번호</label>
                <input id="f-s-password" type="password" name="password" @keydown="enterSubmit()" required>
                <img @click="showSecret('f-s-password')" @mouseleave="hideSecret('f-s-password')"
                     src="@/assets/images/icons/icons8-eye-48.png"
                     style="cursor: pointer; width: 1.2rem; height: 1.2rem;">
              </div>
              <!-- remember me checkbox -->
              <div class="form-group">
                <div id="rememberme-box">
                  <input id="rememberme" type="checkbox" name="remember-me">

                  <label for="rememberme">로그인 정보 기억하기</label>
                </div>
              </div>

              <div class="form-group" style="flex-direction: row; justify-content: center;">
                <!--              <a onclick="window.open('/findaccount', '회원 정보 찾기', 'height=500px, width=650px, scrollbars=no');">이메일 또는 비밀번호가 기억나지 않습니다.</a>-->
                <a style="cursor: pointer" @click="modalStore.openModal('FindAccount')">
                  이메일 또는 비밀번호가 기억나지 않습니다.</a>
                <div
                    style="border-right: #f2f2f2 solid 0.1em; height: 0.8rem; margin-left: 0.4rem; margin-right: 0.4rem"></div>
                <a href="/sign-up">회원가입</a>
              </div>

              <!-- submit button -->
              <ul class="button-box">
                <button class="button button-large submit" type="button" @click="submitForm()">로그인</button>
              </ul>

              <!-- 네이버, 카카오, 구글 로그인 api 버튼 -->
              <ul class="button-box">
                <button id="naverSignInBtn" class="oauthBtn" type="button"
                        @click="userStore.socialLogin('naver')"></button>
                <button id="kakaoSignInBtn" class="oauthBtn" type="button"
                        @click="userStore.socialLogin('kakao')"></button>
              </ul>
            </form>
          </div>

        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
#form-signin .form-group:nth-child(1),
#form-signin .form-group:nth-child(2) {
  margin-bottom: 0.9rem;
}

.oauthBtn {
  border-radius: 1.5em;
  border: none;
  width: 2.6rem;
  height: 2.6rem;
  margin-bottom: 2em;
}

#naverSignInBtn {
  background: url("@/assets/images/naver-xs.png") no-repeat;
  background-size: 100% 100%;
}

#kakaoSignInBtn {
  background: url("@/assets/images/kakao-xs.png") no-repeat;
  background-size: 100% 100%;
}
</style>