<script setup>
import {useModalStore} from "@/stores/modal.js";
import {useNoticeStore} from "@/stores/notice.js";
import {useBoardStore} from "@/stores/board.js";
import {ref} from "vue";
import {useUserStore} from "@/stores/user.js";
import Swal from 'sweetalert2';
import {useRouter} from "vue-router";
import {useMovieStore} from "@/stores/movie.js";

const router = useRouter();

const userStore = useUserStore();
const boardStore = useBoardStore();
const noticeStore = useNoticeStore();
const movieStore = useMovieStore();
const modalStore = useModalStore();

const props = defineProps(['id', 'category']);

const category = props.category;
const store = category === 'notices' ? noticeStore : category === 'boards' ? boardStore : null;

const board = ref({
  id: '',
  title: '',
  content: '',
  writerId: userStore.user.memNo
});

function updateBoard(value) {
  board.value = value
}

function updateBoardContent(value) {
  board.value.content = value;
}

if (props.id) {
  await store.getBoard(props.id);
  updateBoard(Object.assign({}, store.currentBoard));
}

function openSelectMovieModal() {
  // modalStore.openModal('', );
}

function checkParams(board) {
  if (!board.title) {
    Swal.fire({
      text: '제목을 입력해주세요.',
      icon: 'warning'
    })
    return false;
  } else if (!board.content) {
    Swal.fire({
      text: '내용을 입력해주세요.',
      icon: 'warning'
    })
    return false;
  }
  return true;
}

async function submit() {
  if (!checkParams(board.value)) return;

  const content = document.getElementById('boardContent').innerHTML;
  updateBoardContent(content);

  const result = props.id ? await store.updateBoard(board.value) : await store.saveBoard(board.value);
  if (result.data.count > 0) {
    router.push(`/${category}/${props.id}`);
  } else {
    Swal.fire({
      text: '오류가 발생했습니다.',
      icon: 'error'
    })
  }
}

async function getMovies(query) {
  const result = await movieStore.searchMovie(query); // id, title, poster_path
}

function formatText(command) {
  document.execCommand(command, false, null);
}

function changeFontSize(action) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const span = document.createElement('span');
  span.style.fontSize = action === 'increase' ? 'larger' : 'smaller';
  range.surroundContents(span);
}

// function changeFontSize2() {
//   const selection = window.getSelection();
//   if (!selection.rangeCount) return;
//
//   const value = window.event.target.value;
//   const range = selection.getRangeAt(0);
//   const text = range.toString();
//
//   let container;
//   if (value.indexOf('제목') !== -1) {
//     if (value === '제목1') {
//       container = document.createElement('h2');
//       // container.style.fontSize = '24px';
//     } else if (value === '제목2') {
//       container = document.createElement('h3');
//     } else if (value === '제목3') {
//       container = document.createElement('h4');
//     }
//   } else {
//     container = document.createElement('span');
//
//     if (value === '본문1') {
//       container.style.fontSize = '18px';
//     } else if (value === '본문2') {
//       container.style.fontSize = '16px';
//     } else if (value === '본문3') {
//       container.style.fontSize = '14px';
//     }
//   }
//
//   range.surroundContents(container);
// }
</script>

<template>
  <div id="index_editor" class="wrapper-block">
    <div class="inner">
      <div class="inner-block">
        <div class="content">
          <div class="block-title-box">
            <h2 class="block-title" v-if="category === 'notices'">공지사항</h2>
            <h2 class="block-title" v-if="category === 'boards'">감상 후기</h2>
          </div>

          <!-- Board -->
          <div class="board-box">
            <p class="input-title">제목</p>
            <div class="board-title-box">
              <input id="boardTitle" type="text" v-model="board.title" placeholder="제목을 입력해주세요.">
            </div>

            <div v-if="category === 'boards'">
              <p style="margin-bottom: 0.4rem;">영화</p>
              <div>
<!--                <input type="text" @click="openSelectMovieModal()" readonly>-->
                <select>
<!--                  <option v-model="movie."-->
                </select>
              </div>
            </div>

            <p class="input-title">내용</p>
            <div class="board-editor-box">

              <div class="board-option-box">
                <button type="button" @click="formatText('bold')"><b>a</b></button><!-- font-weight: bold -->
                <button type="button" @click="formatText('italic')"><span style="font-style: italic">a</span></button>
                <button type="button" @click="formatText('underline')"><span style="text-decoration: underline">a</span></button>
                <button type="button" @click="changeFontSize('increase')" style="font-size: larger">F</button>
                <button type="button" @click="changeFontSize('decrease')" style="font-size: smaller">F</button>
<!--                <select @change="changeFontSize2()">-->
<!--                  <option v-for="size in ['제목1', '제목2', '제목3', '본문1', '본문2', '본문3']" :value="size" :key="size" :selected="size === '본문2'">{{size}}</option>-->
<!--                </select>-->
<!--                <button type="button" id="addImgBtn" value="image"></button>-->
              </div>

              <div id="boardContent" contenteditable="true" v-html="board.content"></div>
            </div>
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
  min-width: 12rem;
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
  height: 2.4rem;
  padding: 0.2rem 0;
  background: #f2f2f2;
  border-radius: 2px 2px 0 0;
  border-bottom: 0.1rem solid #000000;
}

.board-box > .board-editor-box > .board-option-box > button {
  width: 1.6rem;
  height: 2rem;
  margin-right: 0.5rem;
  background-color: transparent;
  border: transparent;
  box-shadow: none;
}

.input-title {
  margin-bottom: 0.4rem;
}

#boardTitle {
  height: 2rem;
  padding: 0 0.5rem;
  margin-bottom: 1rem;
  width: calc(100% - 1rem);
  max-width: 20rem;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid #000000;
  outline-style: none;
  font-size: 1rem;
}

#boardContent {
  height: 24rem;
  width: calc(100% - 1rem);
  padding: 0.5rem;
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