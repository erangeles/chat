import { App } from "../app.js";
import { Cookie } from "../Utils/Cookie.js";

declare var Vue: any;

export class Userinfo{

    static readonly userinfoMessageType: string = 'userinfo';
    
    readonly nameCookie: string = 'name';
    
    app: App;
    userinfoVueObject: any; 


    constructor(app: App){
        this.app = app;
        this.app.yourName = Cookie.getCookie(this.nameCookie) ?? null;
        this.initialElements();
    }

    initialElements(){
        let cla = this;
        this.userinfoVueObject = new Vue({
            el: '#userinfo',
            data: {
                name: Cookie.getCookie(cla.nameCookie) ?? null
            },
            methods: {
                changeUserinfo: function(){
                    cla.app.sendMessageToAllPartners({type: Userinfo.userinfoMessageType, message: {name: this.name}}); 
                    Cookie.setCookie(cla.nameCookie, this.name);
                    cla.app.yourName = this.name;
                }
            }
        });

    }
}