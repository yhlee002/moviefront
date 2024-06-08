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
        getComments() {
            return this.comments;
        }
    },
    actions: {
        async getCommentImpsByBoard(boardId, page, size) {
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
        async saveCommentImp(boardId, writerId, content) {
            return (await axios.post('/api/comment/imp', {
                    boardId: boardId,
                    writerId: writerId,
                    content: content
                })
                    .catch(e => console.error(e))
            ).data;
        },
        async updateCommentImp(commentId, content) {
            return (await axios.patch('/api/comment/imp', {
                    content: content
                })
                    .catch(e => console.error(e))
            ).data;
        },
        async deleteCommentImp(commentId) {
            return (await axios.delete(`/api/comment/imp?commentId=${commentId}`)
                    .catch(e => console.error(e))
            ).data;
        }
    }
})