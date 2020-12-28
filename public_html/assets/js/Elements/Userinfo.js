import { Cookie } from "../Utils/Cookie.js";
export class Userinfo {
    constructor(app) {
        var _a;
        this.nameCookie = 'name';
        this.app = app;
        this.app.yourName = (_a = Cookie.getCookie(this.nameCookie)) !== null && _a !== void 0 ? _a : null;
        this.initialElements();
    }
    initialElements() {
        var _a;
        let cla = this;
        this.userinfoVueObject = new Vue({
            el: '#userinfo',
            data: {
                name: (_a = Cookie.getCookie(cla.nameCookie)) !== null && _a !== void 0 ? _a : null
            },
            methods: {
                changeUserinfo: function () {
                    cla.app.sendMessageToAllPartners({ type: Userinfo.userinfoMessageType, message: { name: this.name } });
                    Cookie.setCookie(cla.nameCookie, this.name);
                    cla.app.yourName = this.name;
                }
            }
        });
    }
}
Userinfo.userinfoMessageType = 'userinfo';
//# sourceMappingURL=Userinfo.js.map