import { defineStore } from 'pinia'
import axios from 'axios';

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            user: {
                id: null,
                identifier: null,
                name: null,
                phone: null,
                profileImage: null,
                role: "Anonymous",
                regDate: null
            },
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
        async getUserData() {
            const result = (await axios.get('/user')).data;
            this.user = result.data;
            // this.addUserDataSession(this.user);

            // const redirectUrl = result.redirectUrl;
            // if (redirectUrl) window.location.href = redirectUrl;
        },
        // addUserDataSession(user) {
        //     sessionstorage.setItem("id", user.memNo);
        //     sessionstorage.setItem("name", user.name);
        //     sessionstorage.setItem("role", user.role);
        // }
    }
})