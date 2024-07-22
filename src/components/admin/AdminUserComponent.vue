<script setup>
import '@/assets/css/admin/user.css';

import {useUserStore} from "@/stores/user.js";
import Swal from 'sweetalert2';
import {computed, ref, watch} from "vue";
import SortingComponent from "@/components/icon/SortingComponent.vue";
import PagenationComponent from "@/components/sub/PagenationComponent.vue";
import AdminUserDetailComponent from "@/components/admin/AdminUserDetailComponent.vue";
import Pagenation from "@/components/sub/PagenationComponent.vue";
const props = defineProps(['page'])
const userStore = useUserStore();

const page = computed(() => {
  const nanable = Number(props.page || "1");
  return isNaN(nanable) ? 1 : nanable;
});
const updateCnt = ref(0);
const list = ref([]);
const currentMember = ref({
  memNo: '',
  identifier: '',
  name: '',
  provider: '',
  profileImage: '',
  certification: '',
  role: ''
});
const searchOption = ref({
  role: 'ALL',
  certification: 'ALL',
  provider: 'ALL',
}); // condition: 'identifier'
const sorting = ref({
  memNo: {
    enabled: false,
    type: 'desc' // 'asc'
  },
  identifier: {
    enabled: false,
    type: 'desc'
  },
  provider: {
    enabled: false,
    type: 'desc'
  },
  name: {
    enabled: false,
    type: 'desc'
  },
  role: {
    enabled: false,
    type: 'desc'
  },
  certification: {
    enabled: false,
    type: 'desc'
  },
  regDate: {
    enabled: true,
    type: 'desc'
  },
});
const searchCondition = ref('identifier');
const keyword = ref('');
const modalShow = ref(false);

list.value = await getUserList(searchOption.value, searchCondition.value, keyword.value);

function updateList(value) {
  list.value = value;
}

async function getUserList(options, searchType, keyword) {
  let list = [];
  const result = await userStore.findUserByKeyword(page.value, 10, options, searchType, keyword);
  if (result.data?.memberList) {
    list = result.data.memberList;
  }

  return list;
}

watch(searchOption, async (newVal, oldVal) => {
  changeModalShow(false);

  const list = await getUserList(newVal, searchCondition.value, keyword.value);
  const columns = getSortingColumns(sorting.value);

  sortingResult(columns, list);
}, {deep: true});

watch(searchCondition, async (newVal, oldVal) => {
  if (!keyword.value) return;

  changeModalShow(false);

  const list = await getUserList(newVal, searchCondition.value, keyword.value);
  const columns = getSortingColumns(sorting.value);

  sortingResult(columns, list);
})

function changeSortingType(name) {
  const current = sorting.value[name];
  if (!current.enabled) {
    current.enabled = true;
  } else if (current.type === 'desc') {
    current.type = 'asc';
  } else if (current.type === 'asc') {
    current.enabled = false;
    current.type = 'desc';
  }
}

watch(sorting, (newVal, oldVal) => {
  const columns = getSortingColumns(newVal);
  sortingResult(columns, list.value);
}, {deep: true});

function getSortingColumns(sortingObj) {
  const columns = {};
  for (let key in sortingObj) {
    if (sortingObj[key].enabled) {
      columns[key] = sortingObj[key].type;
    }
  }
  return columns;
}

function sortingResult(columns, list) {
  if (Object.keys(columns).length === 0) {
    updateList(list);
  } else {
    multiSort(list, columns);
    updateList(list);
  }
}

function multiSort(data, columns) {
  const comparer = (a, b) => {
    return compareMultiple(a, b, Object.entries(columns))
  }

  const compareMultiple = (a, b, columnsEntries) => {
    let index = -1;
    const length = columnsEntries.length;

    let result;
    while (++index < length) {
      const [column, order] = columnsEntries[index]
      if (column === 'memNo') {
        result = stringToNumberAscending(a[column], b[column]);
      } else if (column === 'regDate') {
        result = dateTimeAscending(a[column], b[column]);
      } else {
        result = ascending(a[column], b[column]);
      }
      return result *= (order === 'desc' ? -1 : 1);
    }
    // result;
  }

  const ascending = (prev, next) => {
    return prev > next ? 1 : prev < next ? -1 : 0;
  }

  const stringToNumberAscending = (prev, next) => {
    return parseInt(prev) > parseInt(next) ? 1 : parseInt(prev) < parseInt(next) ? -1 : 0;
  }

  const dateTimeAscending = (prev, next) => {
    prev = prev.replaceAll(' ', '').replaceAll(':', '').replaceAll('-', '');
    next = next.replaceAll(' ', '').replaceAll(':', '').replaceAll('-', '');

    return parseInt(prev) > parseInt(next) ? 1 : parseInt(prev) < parseInt(next) ? -1 : 0;
  }

  const descending = (prev, next) => {
    return prev > next ? -1 : prev < next ? 1 : 0;
  }

  data.sort(comparer);
}

function enterEvent() {
  if (window.event.keyCode === 13) {
    search(searchCondition.value, keyword.value);
  }
}

async function search(searchCondition, keyword) {
  const list = await getUserList(searchOption.value, searchCondition, keyword);
  const columns = getSortingColumns(searchOption.value);

  sortingResult(columns, list);
}

function changeModalShow(value) {
  if (value !== null && value !== undefined) modalShow.value = value;
  else modalShow.value = !modalShow.value;
}

function showUserDetail(memNo) {
  if (currentMember.value.memNo !== memNo) {
    if (!modalShow.value) changeModalShow();

    const user = list.value.find(u => u.memNo === memNo);
    currentMember.value = user;
    updateCnt.value += 1;
  } else {
    changeModalShow();
  }
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
      changeModalShow();

      const checkboxs = document.querySelectorAll('.user-list-checkbox > input[type=checkbox]:checked');
      const list = [];
      checkboxs.forEach(box => list.push(box.value));

      const result = await userStore.deleteUsers(list);
      if (!result.data) {
        Swal.fire({
          text: '삭제에 실패하였습니다.',
          icon: 'error'
        });
      } else {
        list.value = await getUserList(searchOption.value, searchCondition.value, keyword.value);
      }
    }
  })
}

function changeMultiUserRole() {
  const inputs = document.querySelectorAll('.user-list-checkbox input[type=checkbox]:checked');
  let memNoList = [];
  for (let input of inputs) {
    memNoList.push(input.value);
  }

  if (memNoList.length === 0) {
    Swal.fire({
      text: '선택된 회원이 없습니다.',
      icon: 'warning',
    });

    return false;
  }

  Swal.fire({
    text: '선택한 회원들의 권한을 변경하시겠습니까?',
    icon: 'question',
    input: 'select',
    inputOptions: {
      ROLE_ADMIN: '관리자',
      ROLE_USER: '일반회원'
    },
    inputPlaceholder: '적용할 권한을 선택하세요.',
    confirmButtonText: '확인',
    cancelButtonText: '취소',
    showCancelButton: true,
  }).then(async result => {
    if (result.isConfirmed) {
      changeModalShow();

      const role = result.value;
      const response = await userStore.updateMultiMemberRole(memNoList, role);
      if (!response.data) {
        Swal.fire({
          text: '회원 권한 변경에 실패했습니다.',
          icon: 'error',
        });
      } else {
        // 회원 정보 목록 다시 조회
        await getUserList(searchOption.value, searchCondition.value, keyword.value);

        Swal.fire({
          text: '권한 변경에 성공했습니다.',
          icon: 'success'
        })

        for (let user of response.data) {
          const m = list.value.find(item => item.memNo === user.memNo);
          const idx = list.value.indexOf(m);
          list.value[idx] = user;
        }
      }
    }
  })
}

function providerDesc(provider) {
  return provider === 'naver' ? '네이버' :
      provider === 'kakao' ? '카카오' :
          provider === 'none' ? '없음' : '';
}

function roleDesc(role) {
  return role === 'ROLE_ADMIN' ? '관리자' :
      role === 'ROLE_USER' ? '일반회원' : '';
}

function certificationDesc(certification) {
  return certification === 'Y' ? '인증됨' :
      certification === 'N' ? '인증안됨' : '';
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

          <div class="search-options">
            <h3>검색</h3>
            <div class="search-options-main-box">
              <div class="search-options-group">
                <div class="search-options-box">
                  <p class="search-options-title">권한</p>
                  <select id="searchUserRole" v-model="searchOption.role">
                    <option value="ALL">전체</option>
                    <option value="ROLE_ADMIN">관리자</option>
                    <option value="ROLE_USER">일반회원</option>
                  </select>
                </div>

                <div class="search-options-box">
                  <p class="search-options-title">인증여부</p>
                  <select id="searchUserCertification" v-model="searchOption.certification">
                    <option value="ALL">전체</option>
                    <option value="Y">인증됨</option>
                    <option value="N">인증안됨</option>
                  </select>
                </div>

                <div class="search-options-box">
                  <p class="search-options-title">소셜 로그인</p>
                  <select id="searchUserSocialLoginProvider" v-model="searchOption.provider">
                    <option value="ALL">전체</option>
                    <option value="none">없음</option>
                    <option value="naver">네이버</option>
                    <option value="kakao">카카오</option>
                  </select>
                </div>
              </div>

              <div class="search-options-group">
                <div class="search-options-box">
                  <p class="search-options-title">검색 조건</p>
                  <select id="searchUserOption" v-model="searchCondition">
                    <option value="identifier">아이디</option>
                    <option value="name">이름</option>
                    <option value="phone">휴대전화</option>
                  </select>
                  <input id="searchMemberInput" v-model="keyword" @keydown="enterEvent" placeholder="검색"/>
                </div>
              </div>
            </div>
          </div>

          <div class="search-results">
            <h3>목록 조회</h3>
            <table id="userList">
              <thead>
              <tr>
                <th style="width: 3rem;"></th>
                <th @click="changeSortingType('memNo')">식별번호
                  <SortingComponent type='number' :enabled="sorting.memNo.enabled"
                                    :value="sorting.memNo.type"></SortingComponent>
                </th>
                <th @click="changeSortingType('identifier')">아이디
                  <SortingComponent type='text' :enabled="sorting.identifier.enabled"
                                    :value="sorting.identifier.type"></SortingComponent>
                </th>
                <th @click="changeSortingType('provider')">소셜 로그인
                  <SortingComponent type='text' :enabled="sorting.provider.enabled"
                                    :value="sorting.provider.type"></SortingComponent>
                </th>
                <th @click="changeSortingType('name')">이름
                  <SortingComponent type='text' :enabled="sorting.name.enabled"
                                    :value="sorting.name.type"></SortingComponent>
                </th>
                <th @click="changeSortingType('role')">권한
                  <SortingComponent type='text' :enabled="sorting.role.enabled"
                                    :value="sorting.role.type"></SortingComponent>
                </th>
                <th @click="changeSortingType('certification')">인증 여부
                  <SortingComponent type='text' :enabled="sorting.certification.enabled"
                                    :value="sorting.certification.type"></SortingComponent>
                </th>
                <th @click="changeSortingType('regDate')">가입일자
                  <SortingComponent type='number' :enabled="sorting.regDate.enabled"
                                    :value="sorting.regDate.type"></SortingComponent>
                </th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="member in list" :key="`admin_user_${member.memNo}`" @click="showUserDetail(member.memNo)">
                <td class="user-list-checkbox" style="border-collapse: collapse;">
                  <input type="checkbox" :value="member.memNo">
                </td>
                <td>{{ member.memNo }}</td>
                <td>{{ member.identifier }}</td>
                <td>{{ providerDesc(member.provider) }}</td>
                <td>{{ member.name }}</td>
                <td>{{ roleDesc(member.role) }}</td>
                <td>{{ certificationDesc(member.certification) }}</td>
                <td>{{ member.regDate.slice(0, 10).replaceAll('-', '.') }}</td>
              </tr>
              <tr v-if="list.length === 0">
                <td colspan="8" style="text-align: center;">조건에 해당하는 회원이 존재하지 않습니다.</td>
              </tr>
              </tbody>
            </table>
          </div>

          <div class="button-box" style="align-self: end;">
            <button class="button-default" type="button" @click="changeMultiUserRole()">권한 변경</button>
            <button class="button-default" type="button" @click="deleteMultiUserInfo()">삭제</button>
          </div>

          <PagenationComponent category="admin/users" :pages="userStore.totalPages"
                               :page="userStore.currentPage"></PagenationComponent>

          <div id="userDetailModal" v-show="modalShow">
            <AdminUserDetailComponent v-if="currentMember.memNo" :memNo="currentMember.memNo"
                                      :key="updateCnt"></AdminUserDetailComponent>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>