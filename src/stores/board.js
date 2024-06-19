import {defineStore} from 'pinia'
import axios from 'axios';

export const useBoardStore = defineStore('board', {
    state: () => {
        return {
            totalPages: 1,
            currentPage: 1,
            boardList: [],
            currentBoard: {},
            prevBoard: {},
            nextBoard: {},
            top5Boards: []
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
        async getBoards(page, size, condition, query) {
            await axios.get(`/api/imps`, {
                params: {
                    page: page - 1,
                    size: size,
                    condition: condition,
                    query: query
                }
            })
                .then(response => response.data)
                .then(result => result.data)
                .then(data => {
                    this.boardList = data.boardImpList;
                    this.totalPages = data.totalPageCnt;
                });
        },
        async getBoard(id) {
            await axios.get(`/api/imp/${id}`)
                .then(response => response.data)
                .then(result => result.data)
                .then(data => {
                    this.currentBoard = data.board;
                    this.prevBoard = data.prevBoard;
                    this.nextBoard = data.nextBoard;
                });
        },
        async saveBoard(board) {
            return (await axios.post(`/api/imp`, board)
                .catch(e => {
                    console.error(e);
                    return e.response;
                }));
        },
        async updateBoard(board) {
            return (await axios.patch(`/api/imp`, board)
                .catch(e => {
                    console.error(e);
                    return e.response;
                }));
        },
        async deleteBoard(boardId) {
            return (await axios.delete(`/api/imp?boardId=${boardId}`)
                .catch(e => {
                    console.error(e);
                    return e.response;
                }));
        }
    }
})