import { defineStore } from 'pinia'
import axios from 'axios';

export const useMovieStore = defineStore('movie', {
    state: () => {
        return {
            dailyBoxOfficeList: [],
            weeklyBoxOfficeList: [],
            movieList: [],
            currentMovie: {
                movie: {},
                nation: null,
                genres: [],
                directors: [],
                filePath: null
            }
        }
    },
    getters: {

    },
    actions: {
        async getDailyBoxOffice() {
            const response = await axios.get(`/movie/boxoffice/daily`);
            this.dailyBoxOfficeList = response.data;
        },
        async getWeeklyBoxOffice() {
            const response = await axios.get(`/movie/boxoffice/weekly`);
            this.weeklyBoxOfficeList = response.data;
        },
        async getMovie(movieId) {
            const response = await axios.get(`/movie/${movieId}`);
            console.log(response);
            this.currentMovie = response.data;
        }
    }
})