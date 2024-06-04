import {defineStore} from 'pinia';

const defaultOptions = {
    titleShow: true,
    title: '',
    name: '',
    width: 485,
    height: 452,
    details: {}
}
export const useModalStore = defineStore('modal', {
    state: () => ({
        modalOpen: false,
        name: '',
        options: {
            titleShow: true,
            title: '',
            name: '',
            width: 485,
            height: 452,
            details: {}
        },
        data: {},
        result: {}
    }),
    getters: {},
    actions: {
        open() {
            this.modalOpen = true;
        },
        close() {
            this.name = '';
            this.modalOpen = false;
        },
        setData(data) {
            this.data = data;
        },
        openModal(modalName, options) {
            if (!options) options = defaultOptions;
            this.name = modalName;
            this.modalOpen = true;
            this.options = options;
        },
        closeAndReturn() {
            this.name = '';
            this.modalOpen = false;
            return this.result;
        }
    }
}, {persist: true});