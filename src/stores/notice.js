import {defineStore} from 'pinia'
import axios from 'axios';

export const useNoticeStore = defineStore('notice', {
    state: () => {
        return {
            totalPages: 1,
            currentPage: 1,
            boardList: [],
            totalElements: 0,
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
        async getBoards(page, size, query, condition, orderby) {
            await axios.get(`/api/notices`, {
                params: {
                    page: page - 1,
                    size: size,
                    query: query,
                    condition: condition,
                    orderby: orderby
                }
            })
                .then(response => response.data)
                .then(result => result.data)
                .then(data => {
                    this.boardList = data.boardNoticeList;
                    this.totalPages = data.totalPageCnt;
                    this.totalElements = data.totalElementCnt;
                    this.currentPage = data.currentPage + 1;
                });
        },
        async getBoard(id) {
            await axios.get(`/api/notices/${id}`)
                .then(response => response.data)
                .then(result => result.data)
                .then(data => {
                    this.currentBoard = data.board;
                    this.prevBoard = data.prevBoard;
                    this.nextBoard = data.nextBoard;
                });
        },
        async getBoardsByMemNo(memNo, page, size) {
            await axios.get(`/api/notices/members`, {
                params: {
                    memNo: memNo,
                    page: page - 1,
                    size: size,
                }
            })
                .then(response => response.data)
                .then(result => result.data)
                .then(data => {
                    this.boardList = data.boardNoticeList;
                    this.totalPages = data.totalPageCnt;
                    this.totalElements = data.totalElementCnt;
                    this.currentPage = data.currentPage + 1;
                });
        },
        async saveBoard(board) {
            return (await axios.post(`/api/notices`, board)
                .catch(e => {
                    console.error(e);
                })).data;
        },
        async updateBoard(board) {
            return (await axios.patch(`/api/notices`, board)
                .catch(e => {
                    console.error(e);
                })).data;
        },
        async updateBoardViews(boardId) {
            return (await axios.patch('/api/notices/views', {
                id: boardId
            })
                .catch(e => {
                    console.error(e);
                    return e.response;
                }));
        },
        async deleteBoard(commentId) {
            return (await axios.delete(`/api/notices?commentId=${commentId}`)
                    .catch(e => console.error(e))
            ).data;
        },
        async deleteBoards(commentIds) {
            return (await axios.post(`/api/notices/batch-delete`, {
                ids: commentIds
            })).data;
        }
    }
})