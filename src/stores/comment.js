import {defineStore} from "pinia";
import axios from "axios";

export const useCommentStore = defineStore('comment', {
    state: () => {
        return {
            comments: [],
            currentPage: 1,
            totalPages: 1
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
            await axios.get('/api/comments/imp', {
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
                    }
                })
                .catch(error => {
                    console.error(error);
                })
        },
        async getCommentsByBoard(boardId, page, size) {
            await axios.get('/api/comments/imp', {
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
                    }
                })
                .catch(error => {
                    console.error(error);
                })
        },
        async saveComment(boardId, writerId, content) {
            return (await axios.post('/api/comment/imp', {
                    boardId: boardId,
                    writerId: writerId,
                    content: content
                })
                    .catch(e => console.error(e))
            ).data;
        },
        async updateComment(commentId, content) {
            return (await axios.patch('/api/comment/imp', {
                    content: content
                })
                    .catch(e => console.error(e))
            ).data;
        },
        async deleteComment(commentId) {
            return (await axios.delete(`/api/comment/imp?commentId=${commentId}`)
                    .catch(e => console.error(e))
            ).data;
        }
    }
})