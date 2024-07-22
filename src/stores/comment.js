import {defineStore} from "pinia";
import axios from "axios";

export const useCommentStore = defineStore('comment', {
    state: () => {
        return {
            comments: [],
            currentPage: 1,
            totalPages: 1,
            totalElements: 0
        }
    },
    getters: {
        listItems() {
            const list = Object.assign([], this.comments);
            list.forEach(c => {
                c['title'] = c.content;
                c['subTitle'] = c.writerName;
            });

            return list;
        }
    },
    actions: {
        async getComments(page, size) {
            await axios.get('/api/comments/imps', {
                params: {
                    page: page - 1,
                    size: size
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        const result = response.data;
                        const data = result.data;
                        this.comments = data.commentImpsList;
                        this.totalPages = data.totalPageCnt;
                        this.totalElements = data.totalElementCnt;
                        this.currentPage = data.currentPage + 1;
                    }
                })
                .catch(error => {
                    console.error(error);
                })
        },
        async getCommentsByBoard(boardId, page, size) {
            await axios.get('/api/comments/imps', {
                params: {
                    boardId: boardId,
                    page: page - 1,
                    size: size
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        const result = response.data;
                        const data = result.data;
                        this.comments = data.commentImpsList;
                        this.totalPages = data.totalPageCnt;
                        this.totalElements = data.totalElementCnt;
                        this.currentPage = data.currentPage + 1;
                    }
                })
                .catch(error => {
                    console.error(error);
                })
        },
        async getCommentsByMember(memNo, page, size) {
            await axios.get('/api/comments/imps/members', {
                params: {
                    memNo: memNo,
                    page: page - 1,
                    size: size
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        const result = response.data;
                        const data = result.data;
                        this.comments = data.commentImpsList;
                        this.totalPages = data.totalPageCnt;
                        this.totalElements = data.totalElementCnt;
                        this.currentPage = data.currentPage + 1;
                    }
                })
                .catch(error => {
                    console.error(error);
                })
        },
        async saveComment(boardId, writerId, content) {
            return (await axios.post('/api/comments/imps', {
                    boardId: boardId,
                    writerId: writerId,
                    content: content
                })
                    .catch(e => console.error(e))
            ).data;
        },
        async updateComment(commentId, content) {
            return (await axios.patch('/api/comments/imps', {
                    content: content
                })
                    .catch(e => console.error(e))
            ).data;
        },
        async deleteComment(commentId) {
            return (await axios.delete(`/api/comments/imps?id=${commentId}`)
                    .catch(e => console.error(e))
            ).data;
        },
        async deleteComments(commentIds) {
            return (await axios.post(`/api/comments/batch-delete`, {
                ids: commentIds
            })).data;
        }
    }
})