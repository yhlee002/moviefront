import {defineStore} from 'pinia'
import axios from 'axios';

export const useNoticeStore = defineStore('notice', {
    state: () => {
        return {
            totalPages: 1,
            currentPage: 1,
            boardList: [],
            currentBoard: {},
            prevBoard: {},
            nextBoard: {}
        }
    },
    getters: {},
    actions: {
        async getNotices(page, size, query) {
            await axios.get(`/api/notices`, {
                params: {
                    page: page - 1,
                    size: size,
                    query: query
                }
            })
                .then(response => response.data)
                .then(result => result.data)
                .then(data => {
                    this.boardList = data.boardNoticeList;
                    this.totalPages = data.totalPageCnt;
                });
        },
        async getNotice(id) {
            await axios.get(`/api/notice/${id}`)
                .then(response => response.data)
                .then(result => result.data)
                .then(data => {
                    this.currentBoard = data.board;
                    this.prevBoard = data.prevBoard;
                    this.nextBoard = data.nextBoard;
                });
        }
    }
})