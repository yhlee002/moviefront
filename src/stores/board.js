import { defineStore } from 'pinia'
import axios from 'axios';

export const useBoardStore = defineStore('board', {
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
            const result = await axios.get(`/imps`).data;
            return result.board;
        },
        async getBoard(id) {
            const result = await axios.get(`/imp/${id}`).data;
            return result.board;
        }
    }
})