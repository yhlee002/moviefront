<script setup>
import '@/assets/css/admin/user.css';
import {ref, watch} from "vue";
import Swal from "sweetalert2";
import {useUserStore} from "@/stores/user.js";
import {useRouter} from "vue-router";
import AdminUserLoginLogsComponent from "@/components/admin/AdminUserLoginLogsComponent.vue";
import AdminUserBoardComponent from "@/components/admin/AdminUserBoardComponent.vue";
import AdminUserCommentComponent from "@/components/admin/AdminUserCommentComponent.vue";
import AdminUserNoticeComponent from "@/components/admin/AdminUserNoticeComponent.vue";
import {useBoardStore} from "@/stores/board";
import {useCommentStore} from "@/stores/comment";
import UserImageComponent from "@/components/icon/UserImageComponent.vue";

const router = useRouter();
let id = ref(router.currentRoute.value.params.id);

const props = defineProps(['memNo']);
const userStore = useUserStore();
if (!id.value) {
  id.value = props.memNo;
}
const response = await userStore.getUser(id.value);
const member = ref(response.data);
const memberOrigin = response.data;

const boardStore = useBoardStore();
const commentStore = useCommentStore();
await boardStore.getBoardsByMemNo(id.value, 1, 15);
await commentStore.getCommentsByMember(id.value, 1, 15);
const boardCnt = boardStore.totalElements;
const commentCnt = commentStore.totalElements;

watch(() => id, async (newVal, oldVal) => {
  const response = await userStore.getUser(newVal);
  member.value = response.data;
})


const editMode = ref(false);

function changeEditMode() {
  editMode.value = !editMode.value;
}

function changeUserRole() {
  const currentRole = member.value.role.replace('ROLE_', '');
  const afterRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
  Swal.fire({
    text: `회원 권한을 변경하시겠습니까? (${currentRole} -> ${afterRole})`,
    icon: 'question',
    confirmButtonText: '확인',
    cancelButtonText: '취소',
    showCancelButton: true
  }).then(async result => {
    if (result.isConfirmed) {
      const response = await userStore.updateMemberRole(member.value.memNo, afterRole);
      if (!response.data) {
        Swal.fire({
          text: '회원 권한 변경에 실패했습니다.',
          icon: 'error',
        });
      } else {
        // 회원 정보 다시 조회
        const res = await userStore.getUser(id.value);
        member.value = res.data;

        // AdminUserComponent 정보 변경 적용 안됨

        Swal.fire({
          text: '권한 변경에 성공했습니다.',
          icon: 'success'
        });
      }
    }
  })
}

function deleteUserInfo() {
  Swal.fire({
    text: '회원 정보를 삭제하시겠습니까?',
    icon: 'question',
    confirmButtonText: '확인',
    cancelButtonText: '취소',
    showCancelButton: true
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

function activeTab(idx) {
  const lis = document.querySelectorAll('#userDetailTabIdxs li.user-detail-tab-index');
  const contents = document.querySelectorAll('#userDetailTabContents div.user-detail-tab');
  const activeContent = document.querySelector('#userDetailTab' + idx);

  for (let i = 0; i < lis.length; i++) {
    lis[i].classList.remove('active');
    contents[i].classList.remove('active');
  }

  lis[idx].classList.add('active');

  activeContent.classList.add('active');
}

function modifyModeOn() {
  if (!editMode.value) editMode.value = true;
}

function modifyUserInfo() {
  if (!checkParams()) {
    Swal.fire({
      text: '변경사항이 없습니다',
      icon: 'warning'
    })

    changeEditMode()
    return;
  }

  Swal.fire({
    text: '변경사항을 저장하시겠습니까?',
    icon: 'question',
    confirmButtonText: '확인',
    cancelButtonText: '취소',
    showCancelButton: true
  }).then(async result => {
    if (result.isConfirmed) {
      const result = await userStore.updateUser(member.value);

      if (result.data) {
        Swal.fire({
          text: '성공적으로 수정하였습니다.',
          icon: 'success'
        })

        const res = await userStore.getUser(id.value);
        member.value = res.data;

        editMode.value = false;
      }
    }
  })
  function checkParams() {
    if (memberOrigin.name !== member.value.name) return true;
    if (memberOrigin.phone !== member.value.phone) return true;
    if (memberOrigin.certification !== member.value.certification) return true;

    return false;
  }
}

</script>

<template>
  <div class="block-title-box">
    <h3 class="block-title">상세 회원 정보</h3>
  </div>

  <table id="userDetailTable">
    <tr>
      <td rowspan="3" style="width: 6rem; height: 8rem; overflow: hidden;">
        <UserImageComponent :profileImage="member.profileImage" :role="member.role"
        width="6rem" height="6rem"></UserImageComponent>
      </td>
      <td class="table-column-cell" style="width: 6rem;">식별번호</td>
      <td style="width: 8rem;">{{ member.memNo }}</td>
      <td class="table-column-cell" style="width: 4rem;">아이디</td>
      <td colspan="3" style="width: 12rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        {{ member.identifier }}
      </td>
      <td class="table-column-cell" style="width: 7rem">소셜 로그인</td>
      <td colspan="2">{{ member.provider }}</td>

    </tr>
    <tr>
      <td class="table-column-cell" style="width: 5rem;">이름</td>
      <td v-if="!editMode">{{ member.name }}</td>
      <td v-if="editMode"><input type="text" v-model="member.name"/></td>
      <td class="table-column-cell" style="width: 4rem;">권한</td>
      <td style="width: 4rem;">{{ member.role.substring('ROLE_'.length) }}</td>
      <td class="table-column-cell" style="width: 5rem;">인증 여부</td>
      <td v-if="!editMode">{{ member.certification }}</td>
      <td v-if="editMode">
        <select v-model="member.certification">
          <option value="Y">Y</option>
          <option value="N">N</option>
        </select>
      </td>
      <td class="table-column-cell" style="width: 4rem;">연락처</td>
      <td v-if="!editMode" colspan="2">{{member.phone}}</td>
      <td v-if="editMode" colspan="2">
        <input type="text" v-model="member.phone"/>
      </td>
    </tr>
    <tr>
      <td class="table-column-cell">작성한 글 수</td>
      <td>{{boardCnt}}</td>
      <td class="table-column-cell" colspan="2">작성한 댓글 수</td>
      <td>{{commentCnt}}</td>
      <td class="table-column-cell">회원가입일자</td>
      <td colspan="2">{{ member.regDate }}</td>

    </tr>
  </table>

  <div class="button-box" style="align-self: end;">
    <button v-if="!editMode" class="button-default" type="button" @click="modifyModeOn()">수정</button>
    <button v-if="editMode" class="button-default" type="button" @click="modifyUserInfo()">완료</button>
    <button class="button-default" type="button" @click="changeUserRole()">권한 변경</button>
    <button class="button-default" type="button" @click="deleteUserInfo()">삭제</button>
  </div>

  <div id="userDetailDatas">
    <ul id="userDetailTabIdxs">
      <li class="user-detail-tab-index" @click="activeTab(0)">작성한 공지</li>
      <li class="user-detail-tab-index active" @click="activeTab(1)">작성한 글</li>
      <li class="user-detail-tab-index" @click="activeTab(2)">작성한 댓글</li>
      <li class="user-detail-tab-index" @click="activeTab(3)">로그인 기록</li>
    </ul>

    <div id="userDetailTabContents">
      <div id="userDetailTab0" class="user-detail-tab">
        <AdminUserNoticeComponent :memNo="id"></AdminUserNoticeComponent>
      </div>

      <div id="userDetailTab1" class="user-detail-tab active">
        <!-- 작성한 글 -->
        <AdminUserBoardComponent :memNo="id"></AdminUserBoardComponent>
      </div>

      <div id="userDetailTab2" class="user-detail-tab">
        <!-- 작성한 댓글 -->
        <AdminUserCommentComponent :memNo="id"></AdminUserCommentComponent>
      </div>

      <div id="userDetailTab3" class="user-detail-tab">
        <!-- 로그인 기록 -->
        <AdminUserLoginLogsComponent :memNo="id"></AdminUserLoginLogsComponent>
      </div>
    </div>
  </div>

</template>

<style scoped>
#userDetailTable {
  margin: 1rem 0;
  width: 100%;
  min-width: 300px;
  border: 1px solid #f2f2f2;
}

#userDetailTable input[readonly] {
  background-color: transparent;
  border: none;
  outline: none;
}

#userDetailTable .table-column-cell {
  background-color: #f2f2f2;
}

#userDetailTabIdxs {
  display: flex;
  flex-direction: row;
}

#userDetailTabIdxs li.user-detail-tab-index {
  height: 2rem;
  padding: 0 1rem;
  cursor: pointer;
}

#userDetailTabIdxs li.user-detail-tab-index:hover {
  border-bottom: 0.3rem solid #ce111d;
}

#userDetailTabIdxs li.user-detail-tab-index.active {
  border-bottom: 0.3rem solid #ce111d;
}

#userDetailTabContents {
  padding: 1rem 2rem;
}

#userDetailTabContents .user-detail-tab {
  display: none;
  width: 100%;
}

#userDetailTabContents .user-detail-tab.active {
  display: flex;
}
</style>