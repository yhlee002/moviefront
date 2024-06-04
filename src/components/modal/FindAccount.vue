<script setup>

import ModalTitle from "@/components/modal/ModalTitle.vue";
import {ref} from "vue";
import ValidationPhoneBody from "@/components/modal/sub/ValidationPhoneBody.vue";
import VueSimpleAlert from "vue3-simple-alert";
import {useUserStore} from "@/stores/user";
import emitter from '@/eventBus/emitter';
import {useModalStore} from "@/stores/modal";
import ResetPassword from "@/components/modal/sub/ResetPasswordBody.vue";

const userStore = useUserStore();
const modalStore = useModalStore();

let findType = ref('NONE'); // 찾는 데이터의 타입 [EMAIL|PWD]
let findPwdType = ref('EMAIL'); // 비밀번호 찾기시 사용하고자하는 수단 [EMAIL|PHONE]
let certificationStatus = ref(false); // 인증 여부(결과)
let foundData =  ref(''); // 찾는 데이터 결과

function updateFindType(type) {
  findType.value = type;
}

function updateFindPwdType(type) {
  findPwdType.value = type;
}

function updateCertificationStatus (value) {
  certificationStatus.value = value;
}

function updateFoundData(value) {
  foundData.value = value;
}

function close() {
  modalStore.close();
  resetRefs();
}

function resetRefs() {
  updateFindType('NONE');
  updateFindPwdType('EMAIL');
  updateCertificationStatus(false);
  updateFoundData('');
}

async function sendCertificationEmail() {
  const email = document.getElementById('findPwdByEmail').value;

  let emailCheck = RegExp(/^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/);
  if (emailCheck.test(email)) {
    // TODO. spinner
    const result = await userStore.sendCertificationMail(email, 'FINDPASSWORD');
    // TODO. spinner
    if (result.data.status) {
      VueSimpleAlert.alert("인증 링크를 담은 메일을 전송했습니다. 인증은 10분간 유효합니다.");
      modalStore.close();
    } else {
      VueSimpleAlert.alert("인증 메일을 전송에 실패했습니다. 다시 시도해주세요.");
    }
  } else {
    VueSimpleAlert.alert("올바른 이메일 형식이 아닙니다.");
  }
}

emitter.on('phone-validation', async param => {
  if (param.target !== 'find-account') return;
  if (param.result) {
    updateCertificationStatus(true);
    const result = await userStore.validatePhone(param.data.phone);
    const userData = result.data;
    // Email 찾기시
    if (findType.value === 'EMAIL') {
      updateFoundData(userData.identifier);
    } else {
      // Password 찾기시: 비밀번호 변경 페이지 제공
      modalStore.setData({memNo: userData.memNo});
    }

  }
});
</script>

<template>
  <div class="find-account-modal basic-modal">
    <ModalTitle value="계정 찾기"></ModalTitle>

    <div class="modal-content">
      <div class="modal-content-main">

        <div v-show="findType === 'NONE'" style="margin: 2rem 0 0 0;">
          <div class="find_account_data_type_box">
            <div class="find_account_data_type" @click="updateFindType('EMAIL')">
              <p>이메일 찾기</p>
            </div>

            <div class="find_account_data_type" @click="updateFindType('PASSWORD')">
              <p>비밀번호 찾기</p>
            </div>
          </div>

          <div class="modal-button-box">
            <button type="button" @click="close()">확인</button>
          </div>
        </div>

        <div v-show="findType !== 'NONE'">
          <div style="display: flex; flex-direction: column">
            <small @click="updateFindType('NONE')" class="modal-back-button">👈 뒤로 가기</small>
            <div id="emailFindBox" v-if="findType === 'EMAIL'">
              <h4>이메일 찾기</h4>
              <div v-if="!certificationStatus" class="find-account-tab-content">
                <small>💌 선택하신 연락처로 인증번호를 전송해드리겠습니다.</small>
                <ValidationPhoneBody mode="UPDATE"></ValidationPhoneBody>
              </div>
              <div v-if="certificationStatus" class="find-account-tab-content">
                <!-- 이메일 조회 화면 -->
                <div>
                  <small>💌 찾으신 이메일 주소는 다음과 같습니다.</small>
                  <input type="text" :value="foundData" readonly style="width: 14rem">
                </div>
                <div class="modal-button-box">
                  <button type="button" @click="close()">확인</button>
                </div>

              </div>

            </div>

            <div v-show="findType === 'PASSWORD'">
              <h4>비밀번호 찾기</h4>
              <ul class="find_account_tab">
                <li class="find_account_tab_item" :class="findPwdType === 'EMAIL' ? 'selected' : ''"
                    @click="updateFindPwdType('EMAIL')">이메일로 찾기
                </li>
                <li class="find_account_tab_item" :class="findPwdType === 'PHONE' ? 'selected' : ''"
                    @click="updateFindPwdType('PHONE')">휴대 전화 번호로 찾기
                </li>
              </ul>
              <div class="find-account-tab-content">
                <small v-if="!certificationStatus">💌 선택하신 연락처로 인증번호 또는 인증메일을 전송해드리겠습니다.</small>

                <div v-if="findPwdType === 'EMAIL' && !certificationStatus">
                  <input id="findPwdByEmail" type="text" placeholder="이메일 주소를 입력해주세요.">

                  <div class="modal-button-box">
                    <button type="button" @click="sendCertificationEmail()">전송하기</button>
                  </div>
                </div>

                <div v-if="findPwdType === 'PHONE' && !certificationStatus">
                  <ValidationPhoneBody mode="UPDATE"></ValidationPhoneBody>
                </div>

                <div v-if="certificationStatus">
                  <ResetPassword></ResetPassword>
                </div>


              </div>

            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.find-account-modal {
  height: 24rem;
}

.find-account-modal h4 {
  margin: 1rem 0;
}

.find-account-modal .find_account_data_type_box {
  display: flex;
  border: 0.1rem #000000 solid;
}

.find-account-modal .find_account_data_type_box .find_account_data_type {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 11rem;
  width: 7rem;
  cursor: pointer;
}

.find-account-modal .find_account_data_type_box .find_account_data_type:hover {
  background-color: #f2f2f2;
}

.find-account-modal .find_account_data_type_box .find_account_data_type:first-child {
  border-right: 0.1rem #000000 solid;
}

.find-account-modal ul.find_account_tab {
  display: flex;
  margin-left: 0.4rem;
}

.find-account-modal ul.find_account_tab > .find_account_tab_item {
  /*border-bottom: 0.1rem solid #000000;*/
  padding: 0.2rem 0.4rem;
  cursor: pointer;
}

.find-account-modal ul.find_account_tab > .find_account_tab_item:last-child {
  border-left: none;
}

.find-account-modal ul.find_account_tab > .find_account_tab_item.selected {
  background-color: #f2f2f2;
  /*border-bottom: none;*/
}

.find-account-modal div.find-account-tab-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 11.5rem;
  padding: 1rem;
  background-color: #f2f2f2;
  border-radius: 0 0 6px 6px;
}

.find-account-modal div.find-account-tab-content small,
#emailFindBox small {
  display: flex;
  text-align: center;
  width: 14rem;
}

#findPwdByEmail,
#findPwdByPhone {
  width: 14rem;
}

</style>