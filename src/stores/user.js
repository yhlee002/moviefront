import {defineStore} from 'pinia'
import axios from 'axios';
import Swal from 'sweetalert2';

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
            profile: {
                identifier: null,
                provider: null,
                name: null,
                profileImageUrl: null
            },
            currentPage: 1
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
        async getUser() {
            await axios.get('/api/member/current')
                .then(response => response.data)
                .then(result => {
                    const data = result.data;
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
        /* getUsers
         * condition 객체 타입으로 한번에 한 쌍의 키(key), 값(value)만 존재. key에는 identifier|name|phone 가능(키워드 포함 검색)
         */
        async getUsers(page, size, condition) {
            let url = `/api/members?page=${page - 1}&size=${size}`;
            if (condition) {
                url += `&${condition.key}=${condition.value}`;
            }
            return (await axios.get(url)
                .then(response => response.data)
                .then(result => {
                    this.users = result.data;
                    this.currentPage
                })
                .catch(e => {
                    console.error(e);
                }));
        },
        async getSocialLoginUrl(provider) {
            return (await axios.get(`/api/member/oauth2-url?provider=${provider.toLowerCase()}`)).data;
        },
        async getToken(provider, code, state) {
            return (await axios.get(`/api/member/oauth2/${provider.toLowerCase()}?code=${code}&state=${state}`)).data;
        },
        async getOauthUserInfoFromSession() {
            return (await axios.get('/api/oauth2/userinfo')).data;
        },
        // async getSocialProfile(provider) {
        //     return (await axios.get(`/api/member/oauth2/profile/${provider}`)).data;
        // },
        // async getSocialProfileFromServer() {
        //     await axios.get(`/api/member/oauth2/profile-server`)
        //         .then(response => response.data)
        //         .then(result => {
        //             const data = result.data;
        //
        //             this.profile.identifier = data.id;
        //             this.profile.provider = data.provider;
        //             this.profile.name = data.name;
        //             this.profile.profileImageUrl = data.profileImageUrl;
        //         });
        // },
        // async removeSocialProfile() {
        //     await axios.delete('/api/member/oauth2/profile-server');
        //     this.resetProfile();
        // },
        resetProfile() {
            this.profile.id = null;
            this.profile.name = null;
            this.profile.profileImageUrl = null;
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

                    Swal.fire({
                        text: '로그인에 실패하였습니다. 입력된 정보를 확인해주세요.',
                        icon: 'error'
                    });
                }));
        },
        async loginCheck(loginData) {
            return (await axios.post('/api/sign-in/check', loginData)).data.data;
        },
        async validateIdentifier(identifier) {
            return (await axios.get(`/api/member?identifier=${identifier}`)).data;
        },
        async validateIdentifierWithProvider(identifier, provider) {
            return (await axios.get(`/api/member?identifier=${identifier}&provider=${provider}`)).data;
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
                        Swal.fire({
                            text: '회원가입에 실패하였습니다.',
                            icon: 'error'
                        })
                        return false;
                    }
                })
                .catch(e => {
                    Swal.fire({
                        text: '회원가입에 실패하였습니다.',
                        icon: 'error'
                    })
                });
        },
        async sendCertificationMail(identifier, reason) {
            return (await axios.post(`/api/cert-mail`, {
                identifier: identifier,
                reason: reason
            })).data;
        },
        async validateCertificationMail(memNo, certKey) {
            return (await axios.post(`/api/cert-mail/validation`, {
                memNo: memNo,
                certKey: certKey
            })
                .then(response => {
                    Swal.fire({
                        text: '이메일 인증에 성공하였습니다.',
                        icon: 'success'
                    })

                    return response.data;
                })
                .catch(e => {
                    if (e.response.data.status === 500 && e.response.data.message === "인증 정보가 존재하지 않습니다.") {
                        Swal.fire({
                            text: '만료된 인증입니다.',
                            icon: 'error'
                        })
                    } else {
                        Swal.fire({
                            text: '인증 진행중 오류가 발생했습니다.',
                            icon: 'error'
                        })
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
                        if (import.meta.env.VITE_APP_HOST === 'local') {
                            Swal.fire({
                                text: '[개발용] 인증번호는 ${data.key}입니다. 인증번호는 3분간 유효합니다.',
                                icon: 'info'
                            })
                        }
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
        },
        async deleteUser(memNo) {
            return (await axios.delete(`/api/member/${memNo}`)).data;
        },
        async deleteUsers(memNoList) {
            return (await axios.post(`/api/member/batch-delete`, {
                memNoList: memNoList
            })).data;
        },
        async updateMemberRole(memNo, role) {
            return (await axios.patch('/api/member/role', {
                memNo: memNo,
                role: role
            })).data;
        }
    }
}, {persist: true})