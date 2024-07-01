import {defineStore} from 'pinia'
import axios from 'axios';

export const useMovieStore = defineStore('movie', {
    state: () => {
        return {
            boxOfficeType: "D", // D or W
            dailyBoxOfficeList: [],
            weeklyBoxOfficeList: [],
            movies: [],
            currentMovie: {
                movie: {},
                nation: null,
                genres: [],
                directors: [],
                filePath: null
            },
            configurations: {
                images: {
                    tmdbImageUrl: 'https://image.tmdb.org/t/p',
                    tmdbSecureImageUrl: 'https://image.tmdb.org/t/p/',
                    backdropSizes: [],
                    logoSizes: [],
                    posterSizes: [],
                    profileSizes: [],
                    stillSizes: [],
                    changeKeys: []
                }
            },
        }
    },
    getters: {},
    actions: {
        changeBoxOfficeType(type) {
            this.boxOfficeType = type;
        },
        async getDailyBoxOffice() {
            const response = await axios.get(`/api/movie/boxoffice/daily`);
            const data = response.data;
            this.dailyBoxOfficeList = data.data;
        },
        async getWeeklyBoxOffice() {
            const response = await axios.get(`/api/movie/boxoffice/weekly`);
            if (response.status === 200) {
                const data = response.data;
                this.weeklyBoxOfficeList = data.data;
            }
        },
        async searchMovie(query) {
            const q = encodeURIComponent(query);
            const response = await axios.get(`/api/movie/search?query=${q}&includeAdult=true&page=1`);
            if (response.status === 200) {
                const data = response.data;
                this.movies = data.data;
            }
        },
        async getMovie(movieId) {
            const response = await axios.get(`/api/movie/t/${movieId}`);
            const data = response.data;
            this.currentMovie = data.data;
        },
        async getConfigurations() {
            await axios.get('/api/movie/t/configuration')
                .then(response => {
                    if (response.status === 200) {
                        const result = response.data;
                        const data = result.data;
                        this.configurations.images.tmdbImageUrl = data.base_url;
                        this.configurations.images.tmdbSecureImageUrl = data.secure_base_url;
                        this.configurations.images.backdropSizes = data.backdrop_sizes;
                        this.configurations.images.logoSizes = data.logo_sizes;
                        this.configurations.images.posterSizes = data.poster_sizes;
                        this.configurations.images.profileSizes = data.profile_sizes;
                        this.configurations.images.stillSizes = data.still_sizes;
                        this.configurations.images.changeKeys = data.changeKeys;
                    }
                })
                .catch(e => console.error(e));
        }
    }
})