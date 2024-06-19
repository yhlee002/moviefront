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
    getters: {
        listItems() {
            const list = Object.assign([], this.boardList);
            list.forEach(b => {
                b['subTitle'] = b.writerName;
            });

            return list;
        }
    },
    actions: {
        async getBoards(page, size, query) {
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
        async getBoard(id) {
            await axios.get(`/api/notice/${id}`)
                .then(response => response.data)
                .then(result => result.data)
                .then(data => {
                    this.currentBoard = data.board;
                    this.prevBoard = data.prevBoard;
                    this.nextBoard = data.nextBoard;
                });
        },
        async saveBoard(board) {
            return (await axios.post(`/api/notice`, board)
                .catch(e => {
                    console.error(e);
                })).data;
        },
        async updateBoard(board) {
            return (await axios.patch(`/api/notice`, board)
                .catch(e => {
                    console.error(e);
                })).data;
        },
        async deleteBoard(boardId) {
            return (await axios.delete(`/api/notice?boardId=${boardId}`)
                .catch(e => {
                    console.error(e);
                })).data;
        }
    }
})