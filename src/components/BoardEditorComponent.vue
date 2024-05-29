<script setup>
import {useModalStore} from "@/stores/modal.js";

const modalStroe = useModalStore();

function openSelectMovieModal() {
  // modalStroe.openModal('', );
}
</script>

<template>
  <div id="index_boarditem" class="wrapper-block">
    <div class="inner">
      <div class="inner-block">
        <div class="content">
          <div class="block-title-box">
            <h2 class="block-title">감상 후기</h2>
          </div>

          <!-- Board -->
          <div class="board-box">
            <p>제목</p>
            <div class="board-title-box">
              <input id="boardTitle" type="text" v-model="board.title" placeholder="제목을 입력해주세요.">
            </div>

            <p>영화</p>
            <div>
              <input type="text" @click="openSelectMovieModal()" readonly>
            </div>

            <p>내용</p>
            <div class="board-editor-box">

              <div class="board-option-box">
                <button type="button" value="bold"><b>a</b></button><!-- font-weight: bold -->
                <button type="button" value="italic"><span style="font-style: italic">a</span></button>
                <!-- font-style: italic -->
                <button type="button" value="underline"><span style="text-decoration: underline">a</span></button>
                <!-- text-decoration: underline; -->
                <button type="button" value="image">
                  <img src="@/assets/images/icons/icons8-image-50.png" alt="이미지 불러오기"/>
                </button>
              </div>

              <div class="board-content-box">
                <input id="boardContent" type="text" v-model="board.content" placeholder="내용을 입력해주세요.">
              </div>
            </div>
            <!--            <div class="board-regdt-box">-->
            <!--              <input id="boardRegDt" type="date" v-model="board.regDate" readonly/>-->
            <!--            </div>-->
            <div class="button-box">
              <button class="button-large submit" type="button">확인</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  /*justify-content: center;*/
  margin-bottom: 2rem;
}

.board-box > .board-editor-box {
  display: flex;
  flex-direction: column;
  border: 0.1rem solid #000000;
  border-radius: 1rem;
}

.board-box > .board-editor-box > .board-option-box {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 2rem;
  background: #f2f2f2;
  border-radius: 1rem 1rem 0 0;
  border-bottom: 0.1rem solid #000000;
}

#boardTitle, #boardContent {
  padding: 0 1rem;
}

#boardTitle {
  height: 2rem;
}

#boardContent {
  height: 30rem;
  border: none;
  outline: none;
}
</style>