import {defineStore} from 'pinia'
import axios from 'axios';
import VueSimpleAlert from "vue3-simple-alert";
import qs from 'qs';
// import AWS from 'aws-sdk-js/dist/aws-sdk';

const userDefault = {
    id: null,
    identifier: null,
    name: null,
    phone: null,
    profileImage: null,
    role: "Anonymous",
    regDate: null
}

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            user: userDefault,
            oauthLoginURL: {
                naver: '',
                kakao: ''
            }
        }
    },
    getters: {
        role() {
            return this.user.role;
        },
        phone() {
            return this.user.phone;
        },
        identifier() {
            return this.user.identifier;
        },
        profileImage() {
            return this.user.profileImage;
        },
        isAuthenticated() {
            if (this.user.role !== 'ROLE_USER' && this.user.role !== 'ROLE_ADMIN') return false;
            else return true;
        },
        isAdmin() {
            if (this.user.role === 'ROLE_ADMIN') return true;
            else false;
        },
        defaultUser() {
            return userDefault;
        }
    },
    actions: {
        clearState() {
            this.user = {
                id: null,
                identifier: null,
                name: null,
                phone: null,
                profileImage: null,
                role: "Anonymous",
                regDate: null
            };
        },
        async getUserData() { // get current user data
            const result = (await axios.get('/api/member/auth')).data;
            this.user = result.data;
            // this.addUserDataSession(this.user);

            // const redirectUrl = result.redirectUrl;
            // if (redirectUrl) window.location.href = redirectUrl;
        },
        // addUserDataSession(user) {
        //     sessionstorage.setItem("id", user.memNo);
        //     sessionstorage.setItem("name", user.name);
        //     sessionstorage.setItem("role", user.role);
        // },
        async getSocialLoginData() {
            const result = (await axios.get("/api/member/oauth2-url")).data;
            const data = result.data;
            this.oauthLoginURL.naver = data.naver;
            this.oauthLoginURL.kakao = data.kakao;
        },
        socialLogin(provider) {
            window.location.href = this.oauthLoginURL[provider];
        },
        async login(loginData) {
            return (await axios.post('/api/sign-in', qs.stringify(loginData), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
                // .then(response => {
                //     if (response.status === 'OK') {
                //         this.user = response.data;
                //         this.$router.push('/');
                //     } else {
                //         VueSimpleAlert.alert("이메일과 비밀번호를 확인해주세요.", "로그인", "info");
                //     }
                //
                // })
                .catch(e => {
                    console.error(e);
                    VueSimpleAlert.alert('로그인에 실패하였습니다. 입력된 정보를 확인해주세요.', '로그인', 'info');
                }));
        },
        async loginCheck(loginData) {
            return (await axios.post('/api/sign-in/check', loginData)).data.data;
        },
        async validateIdentifier(identifier) {
            return (await axios.get(`/api/member?identifier=${identifier}`)).data;
        },
        async validateName(name) {
            return (await axios.get(`/api/member?name=${name}`)).data;
        },
        async validatePhone(phone) {
            return (await axios.get(`/api/member?phone=${phone}`)).data;
        },
        async signUp(signUpData) {
            return await axios.post('/api/member', signUpData)
                .then(response => response.data)
                .then(result => {
                    if (result.count === 1) {
                        return true
                    } else {
                        VueSimpleAlert.alert("회원가입에 실패하였습니다.");
                        return false;
                    }
                })
                .catch(e => {
                    VueSimpleAlert.alert("회원가입에 실패하였습니다.");
                });
        },
        async sendCertificationMail(email) {
            return (await axios.post(`/api/cert-mail`, email)).data;
            // VueSimpleAlert.alert(`[임시] 인증번호는 ${data.key}입니다. 인증번호는 3분간 유효합니다.`);
        },
        async validateCertificationMail(memNo, certKey) {
            return (await axios.post(`/api/cert-mail/validation`, {
                memNo: memNo,
                certKey: certKey
            })).data;
        },
        async sendCertificationMessage(phone) {
            return await axios.post("/api/cert-message", {
                "phone": "+82" + phone
            })
                .then(response => response.data)
                .then(result => result.data)
                .then(data => {
                    if (data.status) {
                        VueSimpleAlert.alert(`[임시] 인증번호는 ${data.key}입니다. 인증번호는 3분간 유효합니다.`);
                    }
                })
        },
        async validateCertificationMessage(phone, certKey) {
            return (await axios.post("/api/cert-message/validation", {
                phone: "+82" + phone,
                certKey: certKey
            })).data;
        }
    }
})