import { defineStore } from 'pinia'
import axios from 'axios';

export const useNoticeStore = defineStore('board', {
    state: () => {
        return {
            boardList: {},
            currentBoard: {},
            prevBoard: {},
            nextBoard: {}
        }
    },
    getters: {
    },
    actions: {
        async getBoardList() {
            const result = await axios.get(`/notices`).data;
            return result.boards;
        },
        async getBoard(id) {
            const result = await axios.get(`/notice/${id}`).data;
            return result.board;
        }
    }
})