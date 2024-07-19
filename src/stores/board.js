import {defineStore} from 'pinia'
import axios from 'axios';

export const useBoardStore = defineStore('board', {
    state: () => {
        return {
            totalPages: 1,
            currentPage: 1,
            boardList: [],
            totalElements: 0,
            currentBoard: {},
            prevBoard: {},
            nextBoard: {},
            weeklyRecommendedTop5Boards: [],
            weeklyViewTop5Boards: []
        }
    },
    getters: {
        listItems() {
            const list = this.boardList.slice();
            list.forEach(b => {
                b['subTitle'] = b.writerName;
            });
            return list;
        },
        mostPopularBoards() {
            const list = this.weeklyRecommendedTop5Boards.slice();
            // list.forEach(b => {
            //     b['subTitle'] = b.writerName;
            // });
            return list;
        },
        mostSeenBoards() {
            const list = this.weeklyViewTop5Boards.slice();
            // list.forEach(b => {
            //     b['subTitle'] = b.writerName;
            // });
            return list;
        }
    },
    actions: {
        async getBoards(page, size, query, condition, orderBy) {
            await axios.get(`/api/imps`, {
                params: {
                    page: page - 1,
                    size: size,
                    query: query,
                    condition: condition,
                    orderby: orderBy
                }
            })
                .then(response => response.data)
                .then(result => result.data)
                .then(data => {
                    this.boardList = data.boardImpList;
                    this.totalPages = data.totalPageCnt;
                    this.totalElements = data.totalElementCnt;
                    this.currentPage = data.currentPage + 1;
                });
        },
        async getBoardsByMemNo(memNo, page, size) {
            await axios.get(`/api/imps/members`, {
                params: {
                    memNo: memNo,
                    page: page - 1,
                    size: size,
                }
            })
                .then(response => response.data)
                .then(result => result.data)
                .then(data => {
                    this.boardList = data.boardImpList;
                    this.totalPages = data.totalPageCnt;
                    this.totalElements = data.totalElementCnt;
                    this.currentPage = data.currentPage + 1;
                });
        },
        async getBoard(id) {
            await axios.get(`/api/imps/${id}`)
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
                    orderby: 'recommended',
                    datelimit: true
                }
            })
                .then(response => response.data)
                .then(result => {
                    const data = result.data;
                    this.weeklyRecommendedTop5Boards = data.boardImpList;
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
                    orderby: 'views',
                    datelimit: true
                }
            })
                .then(response => response.data)
                .then(result => {
                    const data = result.data;
                    this.weeklyViewTop5Boards = data.boardImpList;
                })
                .catch(e => {
                    console.error(e);
                });
        },
        async getRecommendedBoardByUser(memNo, page, size) {
            return (await axios.get(`/api/imps/recommended`, {
                params: {
                    page: page - 1,
                    size: size,
                    memNo: memNo
                }
            })
                .catch(e => {
                    console.error(e);
                    return e.response;
                }));
        },
        async isRecommendedByUser(boardId, memNo) {
            return (await axios.get(`/api/imps/recommended/exists?boardId=${boardId}&memNo=${memNo}`)
                .catch(e => {
                    console.error(e);
                    return e.response;
                }));
        },
        async getBoardrecommendedCount(boardId) {
            return (await axios.get(`/api/imps/recommended/count?boardId=${boardId}`)
                .catch(e => {
                    console.error(e);
                    return e.response;
                }));
        },
        async saveBoard(board) {
            return (await axios.post(`/api/imps`, board)
                .catch(e => {
                    console.error(e);
                    return e.response;
                }));
        },
        async updateBoard(board) {
            return (await axios.patch(`/api/imps`, board)
                .catch(e => {
                    console.error(e);
                    return e.response;
                }));
        },
        async updateBoardViews(boardId) {
            return (await axios.patch('/api/imps/views', {
                id: boardId
            })
                .catch(e => {
                    console.error(e);
                    return e.response;
                }));
        },
        async updateBoardRecommended(boardId, memNo, value) {
            return (await axios.patch('/api/imps/recommended', {
                boardId: boardId,
                memNo: memNo,
                value: value
            })
                .catch(e => {
                    console.error(e);
                    return e.response;
                }));
        },
        async deleteBoard(boardId) {
            return (await axios.delete(`/api/imps/flag?boardId=${boardId}`)
                .catch(e => {
                    console.error(e);
                    return e.response;
                }));
        },
        async deleteBoards(boardIds) {
            return (await axios.post(`/api/imps/flag/batch-delete`, {
                ids: boardIds
            })).data;
        },
        // 영구 삭제
        async deleteBoardPermanently(commentId) {
            return (await axios.delete(`/api/imps?commentId=${commentId}`)
                    .catch(e => console.error(e))
            ).data;
        },
        async deleteBoardsPermanently(commentIds) {
            return (await axios.post(`/api/imps/batch-delete`, {
                ids: commentIds
            })).data;
        }
    }
})