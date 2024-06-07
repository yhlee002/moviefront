import {defineStore} from "pinia";
import axios from "axios";

export const useMovieCommentStore = defineStore('movieComment', {
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
        async getCommentImpsByBoard(boardId, page) {
            await axios.get('/api/comments/movie', {
                params: {
                    movieCd: movieCd,
                    page: page - 1
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        const result = response.data;
                        const data = result.data;
                        this.comments = data.commentsList;
                        this.totalPages = data.totalPageCnt;
                    }
                })
                .catch(error => {
                    console.error(error);
                })
        },
        async updateCommentImp(movieCd, writerId, content) {
            return (await axios.post('/api/comment/movie', {
                    movieCd: movieCd,
                    writerId: writerId,
                    content: content
                })
                    .catch(e => console.error(e))
            ).data;
        },
        async deleteCommentImp(commentId) {
            return (await axios.delete(`/api/comment/movie?commentId=${commentId}`)
                    .catch(e => console.error(e))
            ).data;
        }
    }
})