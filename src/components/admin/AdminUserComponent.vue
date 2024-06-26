<script setup>
import {useUserStore} from "@/stores/user";
import {useRouter} from "vue-router";
import Swal from 'sweetalert2';
import {ref} from "vue";

const userStore = useUserStore();
await userStore.getUsers(1, 15, null);

const currentMember = ref({
  memNo: '',
  identifier: '',
  name: '',
  provider: '',
  profileImage: '',
  certification: '',
  role: ''
});

const editMode = ref(false);

function changeEditMode() {
  editMode.value = !editMode.value;
}

const modalShow = ref(false);

function changeModalShow() {
  modalShow.value = !modalShow.value;
}

function showModal(memNo) {
  if (currentMember.value.memNo !== memNo) {
    if (!modalShow.value) changeModalShow();

    const user = userStore.users.find(u => u.memNo === memNo);
    currentMember.value = user;
  } else {
    changeModalShow();
  }
}

function modifyUserInfo() {
  if (!editMode.value) editMode.value = true;
}

function deleteUserInfo() {
  Swal.fire({
    text: '회원 정보를 삭제하시겠습니까?',
    icon: 'question',
    confirmButtonText: '확인',
    cancelButtonText: '취소',
    showCancelButton: true,
  }).then(async result => {
    if (result.isConfirmed) {
      const result = await userStore.deleteUser();
      if (!result.data) {
        Swal.fire({
          text: '삭제에 실패하였습니다.',
          icon: 'error'
        });
      }
    }
  })
}

function deleteMultiUserInfo() {
  Swal.fire({
    text: '회원 정보를 삭제하시겠습니까?',
    icon: 'question',
    confirmButtonText: '확인',
    cancelButtonText: '취소',
    showCancelButton: true,
  }).then(async result => {
    if (result.isConfirmed) {
      const checkboxs = document.querySelectorAll('.user-list-checkbox > input[type=checkbox]:checked');
      const list = [];
      checkboxs.forEach(box => list.push(box.value));

      const result = await userStore.deleteUsers(list);
      if (!result.data) {
        Swal.fire({
          text: '삭제에 실패하였습니다.',
          icon: 'error'
        });
      }
    }
  })
}

function changeUserRole() {
  const user = currentMember.value;

  const currentRole = user.role.replace('ROLE_', '');
  const afterRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
  Swal.fire({
    text: `회원 권한을 변경하시겠습니까? (${currentRole} -> ${afterRole})`,
    icon: 'question',
    confirmButtonText: '확인',
    cancelButtonText: '취소',
  }).then(async result => {
    if (result.isConfirmed) {
      const response = await userStore.updateMemberRole(memNo, role);
      if (!response.data) {
        Swal.fire({
          text: '회원 권한 변경에 실패했습니다.',
          icon: 'error',
        });
      } else {
        // 회원 정보 목록 다시 조회
        await userStore.getUsers(1, 15, null);
      }
    }
  })
}

function changeMultiUserRole() {
  Swal.fire({
    text: '선택한 회원들의 권한을 변경하시겠습니까?',
    icon: 'question',
    input: 'select',
    inputOptions:  {
      admin: '관리자',
      user: '일반회원'
    },
    inputPlaceholder: '일괄적으로 적용할 권한을 선택하세요.',
    confirmButtonText: '확인',
    cancelButtonText: '취소',
    showCancelButton: true,
  }).then(async result => {
    if (result.isConfirmed) {
      const response = await userStore.updateMemberRole(memNo, role);
      if (!response.data) {
        Swal.fire({
          text: '회원 권한 변경에 실패했습니다.',
          icon: 'error',
        });
      } else {
        // 회원 정보 목록 다시 조회
        await userStore.getUsers(1, 15, null);
      }
    }
  })
}

</script>

<template>
  <div id="index_notice" class="wrapper-block">
    <div class="inner">
      <div class="inner-block">
        <div class="content">
          <div class="block-title-box">
            <h2 class="block-title">회원 관리</h2>
          </div>

          <table id="userList">
            <thead>
            <tr>
              <th style="width: 3rem;"></th>
              <th>식별번호(No)</th>
              <th>아이디(Identifier)</th>
              <th>이름(Nickname)</th>
              <th>권한(Role)</th>
              <th>인증 여부(Certification)</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="member in userStore.users" :key="`admin_user_${member.memNo}`" @click="showModal(member.memNo)">
              <td class="user-list-checkbox"><input type="checkbox"
                                                    :value="member.memNo">
              </td>
              <td>{{ member.memNo }}</td>
              <td>{{ member.identifier }}</td>
              <td>{{ member.name }}</td>
              <td>{{ member.role }}</td>
              <td>{{ member.certification }}</td>
            </tr>
            </tbody>
          </table>

          <div class="button-box" style="align-self: end;">
<!--            <button class="button-default" type="button" @click="modifyUserInfo()">수정</button>-->
            <button class="button-default" type="button" @click="changeMultiUserRole()">권한 변경</button>
            <button class="button-default" type="button" @click="deleteMultiUserInfo()">삭제</button>
          </div>

          <div id="userDetailModal" v-show="modalShow">
            <div class="block-title-box">
              <h3 class="block-title">상세 회원 정보</h3>
            </div>

            <table id="userDetailTable">
              <tr>
                <td rowspan="3" style="width: 6rem; height: 8rem; overflow: hidden;">
                  <img style="width: 6rem; height: 6rem;" :src="currentMember.profileImage"/>
                </td>
                <td class="table-column-cell" style="width: 6rem;">식별번호</td>
                <td style="width: 8rem;">{{ currentMember.memNo }}</td>
                <td class="table-column-cell" style="width: 4rem;">아이디</td>
                <td colspan="3" style="width: 12rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ currentMember.identifier }}</td>
                <td class="table-column-cell" style="width: 7rem">소셜 로그인</td>
                <td colspan="2">{{ currentMember.provider }}</td>

              </tr>
              <tr>
                <td class="table-column-cell" style="width: 5rem;">이름</td>
                <td>{{ currentMember.name }}</td>
                <td class="table-column-cell" style="width: 4rem;">권한</td>
                <td style="width: 4rem;">{{ currentMember.role.substring('ROLE_'.length) }}</td>
                <td class="table-column-cell" style="width: 5rem;">인증 여부</td>
                <td>{{ currentMember.certification }}</td>
                <td class="table-column-cell" style="width: 4rem;">연락처</td>
                <td colspan="2">{{ currentMember.phone }}</td>
              </tr>
              <tr>
                <td class="table-column-cell">작성한 글 수</td>
                <td></td>
                <td class="table-column-cell" colspan="2">작성한 댓글 수</td>
                <td></td>
                <td class="table-column-cell">회원가입일자</td>
                <td colspan="2">{{currentMember.regDate}}</td>

              </tr>
            </table>

            <div class="button-box" style="align-self: end;">
              <button class="button-default" type="button" @click="modifyUserInfo()">수정</button>
              <button class="button-default" type="button" @click="showLoginLog()">로그인 기록</button>
              <button class="button-default" type="button" @click="changeUserRole()">권한 변경</button>
              <button class="button-default" type="button" @click="deleteUserInfo()">삭제</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#userList {
  min-width: 30rem;
}

#userList > tbody > tr {
  cursor: pointer;
}

#userList th, #userList td {
  text-align: left;
}

#userList .user-list-checkbox {
  display: flex;
  justify-content: center;
  align-content: center;
}

#userDetailModal {
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 1rem;
  border: 1px solid #b3b3b3;
  box-shadow: 1px 1px 3px #cacaca;
}

#userDetailTable {
  margin: 2rem 0;
  width: 100%;
  min-width: 300px;
  border: 1px solid #f2f2f2;
}

#userDetailTable .table-column-cell {
  background-color: #f2f2f2;
}
</style>