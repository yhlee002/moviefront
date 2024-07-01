import {defineStore} from "pinia";
import axios from "axios";

export const useMovieCommentStore = defineStore('movieComment', {
    state: () => {
        return {
            comments: [],
            currentPage: 1,
            totalPages: 1,
            totalItemCnt: 0
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
            await axios.get('/api/comments/movies', {
                params: {
                    page: page - 1,
                    size: size
                }
            })
                .then(response => response.data)
                .then(result => result.data)
                .then(data => {
                    this.comments = data.commentMovsList;
                    this.totalPages = data.totalPageCnt;
                    this.totalItemCnt = data.totalElementCnt;
                    this.currentPage = data.currentPage;

                })
                .catch(error => {
                    console.error(error);
                })
        },
        async getCommentsByMovie(movieCd, page, size) {
            await axios.get('/api/comments/movies', {
                params: {
                    movieCd: movieCd,
                    page: page - 1,
                    size: size
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        const result = response.data;
                        const data = result.data;
                        this.comments = data.commentMovsList;
                        this.totalPages = data.totalPageCnt;
                        this.totalItemCnt = data.totalElementCnt;
                        this.currentPage = data.currentPage;
                    }
                })
                .catch(error => {
                    console.error(error);
                })
        },
        async saveComment(movieCd, writerId, content) {
            return (await axios.post('/api/comments/movies', {
                    movieCd: movieCd,
                    writerId: writerId,
                    content: content
                })
                    .catch(e => console.error(e))
            ).data;
        },
        async updateComment(movieCd, writerId, content) {
            return (await axios.patch('/api/comments/movies', {
                    movieCd: movieCd,
                    writerId: writerId,
                    content: content
                })
                    .catch(e => console.error(e))
            ).data;
        },
        async deleteComment(commentId) {
            return (await axios.delete(`/api/comments/movies?commentId=${commentId}`)
                    .catch(e => console.error(e))
            ).data;
        }
    }
})