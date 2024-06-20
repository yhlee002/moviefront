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
            weeklyRecommendedTop5Boards: [],
            weeklyViewTop5Boards: []
        }
    },
    getters: {
        listItems() {
            const list = Object.assign([], this.boardList);
            list.forEach(b => {
                b['subTitle'] = b.writerName;
            });
            return list;
        },
        mostPopularBoards() {
            const list = Object.assign([], this.weeklyRecommendedTop5Boards);
            list.forEach(b => {
                b['subTitle'] = b.writerName;
            });
        },
        mostSeenBoards() {
            const list = Object.assign([], this.weeklyViewTop5Boards);
            list.forEach(b => {
                b['subTitle'] = b.writerName;
            });
        }
    },
    actions: {
        async getBoards(page, size, query, condition) {
            await axios.get(`/api/imps`, {
                params: {
                    page: page - 1,
                    size: size,
                    query: query,
                    condition: condition
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
        async getWeeklyRecommendedTopBoards(size) {
            await axios.get(`/api/imps`, {
                params: {
                    page: 0,
                    size: size,
                    condition: 'recommended'
                }
            })
                .then(response => response.data)
                .then(result => {
                    this.weeklyRecommendedTop5Boards = result.data;
                })
                .catch(e => {
                    console.error(e);
                });
        },
        async getWeeklyViewTopBoards(size) {
            await axios.get(`/api/imps`, {
                params: {
                    page: 0,
                    size: size,
                    condition: 'views'
                }
            })
                .then(response => response.data)
                .then(result => {
                    this.weeklyViewTop5Boards = result.data;
                })
                .catch(e => {
                    console.error(e);
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
        async updateBoardViews(boardId) {
            return (await axios.patch('/api/imp/view', {
                id: boardId
            })
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