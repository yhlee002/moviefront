import {defineStore} from 'pinia'
import axios from 'axios';
import VueSimpleAlert from "vue3-simple-alert";
import qs from 'qs';
import {useRouter} from "vue-router";
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
            user: {},
            users: [],
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
        },
        listItems() {
            const users = Object.assign([], this.users);
            users.forEach(user => {
                user['title'] = user.identifier;
                user['subTitle'] = user.name;
            });

            return users;
        }
    },
    actions: {
        clearState() {
            this.user = userDefault;
        },
        clearSession() {
            // sessionStorage.removeItem('user');
        },
        async getUser() {
            await axios.get('/api/member/current')
                .then(response => response.data)
                .then(result => result.data)
                .then(data => {
                    if (data) { // !== null
                        this.user = data;
                    } else {
                        this.user = userDefault;
                    }
                })
                .catch(e => {
                    console.error(e);
                })
        },
        /**
         *
         * @param page
         * @param size
         * @param condition 객체 타입으로 한번에 한 쌍의 키(key), 값(value)만 존재. key에는 identifier|name|phone 가능(키워드 포함 검색)
         * @returns {Promise<axios.AxiosResponse<any>|void>}
         */
        async getUsers(page, size, condition) {
            let url = `/api/members?page=${page - 1}&size=${size}`;
            if (condition) {
                url += `&${condition.key}=${condition.value}`;
            }
            return (await axios.get(url, {
                // params: {
                //     page: page - 1,
                //     size: size
                // }
            })
                .then(response => response.data)
                .then(result => {
                    this.users = result.data;
                })
                .catch(e => {
                    console.error(e);
                }));
        },
        // addUserDataSession(user) {
        //     sessionstorage.setItem("id", user.memNo);
        //     sessionstorage.setItem("name", user.name);
        //     sessionstorage.setItem("role", user.role);
        // },
        // async getSocialLoginData() {
        //     const result = (await axios.get("/api/member/oauth2-url")).data;
        //     const data = result.data;
        //     this.oauthLoginURL.naver = data.naver;
        //     this.oauthLoginURL.kakao = data.kakao;
        // },
        async socialLogin(provider) {
            const result = (await axios.get("/api/member/oauth2-url")).data;
            const data = result.data;
            const router = useRouter();
            router.push(data[provider.toUpperCase()]);

            // this.oauthLoginURL.naver = data.naver;
            // this.oauthLoginURL.kakao = data.kakao;

            // window.location.href = this.oauthLoginURL[provider];
        },
        async login(loginData) {
            return (await axios.post('/api/sign-in', loginData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        this.user = response.data;
                        sessionStorage.setItem('user', response.data);
                    }

                })
                .catch(e => {
                    console.error(e);
                    VueSimpleAlert.alert('로그인에 실패하였습니다. 입력된 정보를 확인해주세요.', '로그인', 'info');
                }));
        },
        async loginCheck(loginData) {
            return (await axios.post('/api/sign-in/check', loginData)).data.data;
        },
        async logout() {
            await axios.post('/logout', {
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            })
                .then(response => {
                    this.clearState();
                    this.clearSession();
                })
                .catch(e => {
                    console.error(e);
                })
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
        async sendCertificationMail(identifier, reason) {
            return (await axios.post(`/api/cert-mail`, {
                identifier: identifier,
                reason: reason
            })).data;
            // VueSimpleAlert.alert(`[임시] 인증번호는 ${data.key}입니다. 인증번호는 3분간 유효합니다.`);
        },
        async validateCertificationMail(memNo, certKey) {
            return (await axios.post(`/api/cert-mail/validation`, {
                memNo: memNo,
                certKey: certKey
            })
                .then(response => {
                    VueSimpleAlert.alert("이메일 인증에 성공하였습니다.");
                    return response.data;
                })
                .catch(e => {
                    if (e.response.data.status === 500 && e.response.data.message === "인증 정보가 존재하지 않습니다.") {
                        VueSimpleAlert.alert("만료된 인증입니다.");
                    } else {
                        VueSimpleAlert.alert("인증 진행중 오류가 발생했습니다.");
                    }

                    return e.response;
                }));
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
        },
        async updatePassword(memNo, password) {
            return (await axios.patch('/api/member/password', {
                memNo: memNo,
                password: password
            })).data;
        }
    }
}, {persist: true})