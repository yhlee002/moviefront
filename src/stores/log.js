import {defineStore} from 'pinia'
import axios from 'axios';
import Swal from 'sweetalert2';


export const useLogStore = defineStore('log', {
    state: () => {
        return {
            totalPages: 1,
            currentPage: 1,
            logs: [],
            totalElements: 0,
        }
    },
    getters: {},
    actions: {
        async getLoginLogs(memNo) {
            await axios.get(`/api/loginlogs?memNo=${memNo}`)
                .then(response => response.data)
                .then(result => {
                    const data = result.data;
                    this.logs = data.loginLogList;
                    this.totalPages = data.totalPageCnt;
                    this.totalElements = data.totalElementCnt;
                })
                .catch(error => {
                    console.error(error);
                })
        }
    }
})