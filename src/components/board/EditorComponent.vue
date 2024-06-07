<script setup>
import {useModalStore} from "@/stores/modal.js";
import {useNoticeStore} from "@/stores/notice";
import {useBoardStore} from "@/stores/board";
import {ref} from "vue";
import {useUserStore} from "@/stores/user";
import VueSimpleAlert from "vue3-simple-alert";
import {useRouter} from "vue-router";

const router = useRouter();

const userStore = useUserStore();
const boardStore = useBoardStore();
const noticeStore = useNoticeStore();
const modalStore = useModalStore();

const props = defineProps(['id', 'category']);

const category = props.category;
const store = category === 'notice' ? noticeStore : category === 'board' ? boardStore : null;

const board = ref({
  title: '',
  content: '',
  writerId: userStore.user.memNo
});

function updateBoard(value) {
  board.value = value
}

if (props.id) {
  store.getBoard(props.id);
  updateBoard(Object.assign({}, store.currentBoard));
}

function openSelectMovieModal() {
  // modalStore.openModal('', );
}

function checkParams(board) {
  if (!board.title) {
    VueSimpleAlert.alert("제목을 입력해주세요.");
    return false;
  } else if (!board.content) {
    VueSimpleAlert.alert("내용을 입력해주세요.");
    return false;
  }
  return true;
}

async function submit() {
  if (!checkParams(board.value)) return;

  const result = await store.updateBoard(board.value);
  if (result.count > 0) {
    const id = result.data.id;
    router.push(`/${category}/${id}`);
  } else {
    VueSimpleAlert.alert("오류가 발생했습니다.");
  }
}
</script>

<template>
  <div id="index_editor" class="wrapper-block">
    <div class="inner">
      <div class="inner-block">
        <div class="content">
          <div class="block-title-box">
            <h2 class="block-title" v-if="category === 'notice'">공지사항</h2>
            <h2 class="block-title" v-if="category === 'board'">감상 후기</h2>
          </div>

          <!-- Board -->
          <div class="board-box">
            <p class="input-title">제목</p>
            <div class="board-title-box">
              <input id="boardTitle" type="text" v-model="board.title" placeholder="제목을 입력해주세요.">
            </div>

            <div v-if="category === 'board'">
              <p style="margin-bottom: 0.4rem;">영화</p>
              <div>
                <input type="text" @click="openSelectMovieModal()" readonly>
              </div>
            </div>

            <p class="input-title">내용</p>
            <div class="board-editor-box">

              <div class="board-option-box">
                <button type="button" value="bold"><b>a</b></button><!-- font-weight: bold -->
                <button type="button" value="italic"><span style="font-style: italic">a</span></button>
                <!-- font-style: italic -->
                <button type="button" value="underline"><span style="text-decoration: underline">a</span></button>
                <!-- text-decoration: underline; -->
                <button type="button" id="addImgBtn" value="image"></button>
              </div>

              <div class="board-content-box">
                <textarea id="boardContent" type="text" v-model="board.content" placeholder="내용을 입력해주세요."></textarea>
              </div>
            </div>
            <!--            <div class="board-regdt-box">-->
            <!--              <input id="boardRegDt" type="date" v-model="board.regDate" readonly/>-->
            <!--            </div>-->
            <div class="button-box">
              <button class="button-large submit" type="button" @click="submit">확인</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#index_editor {
  margin-top: 6rem;
}

.board-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 2rem auto;
}

#index_boarditem .button-box {
  display: flex;
  flex-direction: row;
  justify-content: end;
}

.board-box > .board-title-box,
.board-box > .board-editor-box > .board-content-box {
  display: flex;
  flex-direction: column;
}

.board-box > .board-editor-box {
  display: flex;
  flex-direction: column;
  border: 0.1rem solid #000000;
  border-radius: 2px;
}

.board-box > .board-editor-box > .board-option-box {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 2rem;
  background: #f2f2f2;
  border-radius: 2px 2px 0 0;
  border-bottom: 0.1rem solid #000000;
}

.board-box > .board-editor-box > .board-option-box > button {
  width: 1.6rem;
  margin-right: 0.2rem;
  border: transparent;
  box-shadow: none;
}

.input-title {
  margin-bottom: 0.4rem;
}

#boardTitle {
  padding: 0 1rem;
  height: 2rem;
  padding: 0 1rem;
  margin-bottom: 1rem;
  width: 100%;
  max-width: 20rem;
}

#boardContent {
  height: 24rem;
  border: none;
  outline: none;
  padding: 1rem;
  resize: none;
  width: 100%;
  max-width: 20rem;
}

#index_editor .button-box {
  display: flex;
  justify-content: end;
}

#addImgBtn {
  background-image: url("@/assets/images/icons/icons8-image-50.png");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}
</style>