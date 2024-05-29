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
        async getCommentsByBoard(boardId, page) {
            await axios.get('/api/comments/imp', {
                params: {
                    boardId: boardId,
                    page: page - 1
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
        }
    }
})