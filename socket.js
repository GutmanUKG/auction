import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default {
    install: (app) => {
        app.config.globalProperties.$socket = socket;

        app.provide("socket", socket);

        app.mixin({
            mounted() {
                this.$socket = socket;
            },
            unmounted() {
                delete this.$socket;
            },
        });
    },
};
