import { App } from "../app.js";
import { Cookie } from "../Utils/Cookie.js";

declare var Vue: any;

export class Controls{

    app: App;
    controlsVueObject: any; 

    readonly microphoneCookie: string = 'microphoneOn';
    readonly cameraCookie: string = 'cameraOn';

    constructor(app: App){
        this.app = app;
        this.initialElements();
        this.setSidebarClickRemove();
    }

    initialElements(){
        let cla = this;
        this.controlsVueObject = new Vue({
            el: '#controls',
            data: {
                microphoneOn: Cookie.getCookie(cla.microphoneCookie) == 'false' ? false : true,
                cameraOn: Cookie.getCookie(cla.cameraCookie) == 'false' ? false : true,
                hangouted: false,
                screenOn: false,
                optionOn: false 
            },
            methods: {
                toogleMicrophone: function () {
                    this.microphoneOn = !this.microphoneOn;
                    Cookie.setCookie(cla.microphoneCookie, this.microphoneOn);
                    cla.toogleStreamMicrophone(false);
                    cla.app.sendMessageToAllPartners(cla.app.userinfo.getUserInfo());
                },
                toogleCamera: function () {
                    this.cameraOn = !this.cameraOn;
                    Cookie.setCookie(cla.cameraCookie, this.cameraOn);
                    cla.toogleStreamCamera();
                    cla.app.sendMessageToAllPartners(cla.app.userinfo.getUserInfo());
                },hangOut: function () {
                    if(!this.hangouted){
                        cla.hangOut();
                        this.hangouted = true;
                    } else{
                        location.hash = cla.app.room;
                        location.reload();
                    }                    
                }, toogleScreen: function(){
                    if(cla.app.screen.onScreenMode()){
                        cla.app.screen.stopScreen();
                    }else{
                        cla.app.screen.startScreen();
                    }
                }, toogleOption: function(){
                    this.optionOn = !this.optionOn;
                    cla.toogleOption(); 
                }
            }
        });

        //tabs
        $('#sidebar .tabs .tabs-header > *:first').addClass('active');
        $('#sidebar .tabs .tabs-content > *:first').addClass('active');
            
        $('#sidebar .tabs .tabs-header > *').on('click', function(){
            var t = $(this).attr('tab');
            cla.activateSidebarTab(t);
        });

    }

    activateSidebarTab(type: string){
        $('#sidebar .tabs .tabs-header > *').removeClass('active');           
        $('#sidebar .tabs .tabs-header > [tab=' + type + '] ').addClass('active');

        $('#sidebar .tabs .tabs-content > *').removeClass('active');  
        $('#sidebar .tabs .tabs-content > #tab-'+ type ).addClass('active');
    }

    initialiseStream(){
        this.toogleStreamMicrophone(false);
        this.toogleStreamCamera(false); 
    }

    toogleStreamMicrophone(changeCamera: boolean = true)
    {
        if(this.app.localStream != undefined){
            this.app.localStream.getAudioTracks()[0].enabled = this.controlsVueObject.microphoneOn;
            if(changeCamera && this.controlsVueObject.microphoneOn){
                this.app.initialCamera();  
            }
        }
        this.app.yourVideoElement.videoVueObject.muted = !this.controlsVueObject.microphoneOn;
        this.app.partnerListElement.partnerListElementVueObject.muted = !this.controlsVueObject.microphoneOn;
    }

    toogleStreamCamera(changeCamera: boolean = true)
    {
        if(!this.app.localStream != undefined){
            this.app.localStream.getVideoTracks()[0].enabled = this.controlsVueObject.cameraOn;
            if(changeCamera && this.controlsVueObject.cameraOn){
                this.app.initialCamera();
            }
        }
        this.app.yourVideoElement.videoVueObject.cameraOff = !this.controlsVueObject.cameraOn;
        this.app.partnerListElement.partnerListElementVueObject.cameraOff = !this.controlsVueObject.cameraOn;
    }

    toogleOption(){
        this.app.sidebarToogle(this.controlsVueObject.optionOn);
    }

    setSidebarClickRemove(){
        var cla = this;
        $("#clickbackground").on("click", function(){
            if(cla.controlsVueObject.optionOn){
                cla.controlsVueObject.toogleOption();
            }
        });
    }

    hangOut(){
        this.app.hangOut();
    }
}