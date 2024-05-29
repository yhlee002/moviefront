import {defineStore} from 'pinia';

export const useMessageStore = defineStore('message', {
    state() {
        return {
            signUpMsg: {
                emailMsg: '',
                oauthMsg: '',
                nameMsg: '',
                pwdMsg: '',
                pwdConfMsg: ''
            }
        }
    },
    getters: {

    },
    actions: {
        updateEmailMsg(msg) {
            this.emailMsg = msg;
        },
        updateNameMsg(msg) {
            this.nameMsg = msg;
        },
        updatePwdMsg(msg) {
            this.pwdMsg = msg;
        },
        updatePwdConfMsg(msg) {
            this.pwdConfMsg = msg;
        },
        updateOauthMsg(msg) {
            this.oauthMsg = msg;
        }
    }
})