"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[1952],{1952:(F,p,a)=>{a.r(p),a.d(p,{SettingModule:()=>E});var u=a(177),g=a(6565),c=a(467),m=a(8972),h=a(1831),f=a(5083),n=a(6276),_=a(7157),s=a(5933),C=a(310),P=a(5761),M=a(385),d=a(4341);function O(e,l){1&e&&(n.j41(0,"h1"),n.EFF(1,"Settings"),n.k0s())}function v(e,l){if(1&e){const t=n.RV6();n.j41(0,"h1",13),n.bIt("click",function(){n.eBV(t);const i=n.XpG();return n.Njj(i.openAppSetting())}),n.EFF(1,"Settings Update"),n.k0s()}}function j(e,l){if(1&e){const t=n.RV6();n.j41(0,"ion-row",8)(1,"ion-col",9),n.nrm(2,"ion-icon",14),n.k0s(),n.j41(3,"ion-col",15)(4,"h5"),n.EFF(5,"Notifications"),n.k0s()(),n.j41(6,"ion-col",16)(7,"ion-toggle",17),n.bIt("ngModelChange",function(i){n.eBV(t);const r=n.XpG();return n.Njj(r.notificationEnabled=i)})("ionChange",function(){n.eBV(t);const i=n.XpG();return n.Njj(i.notificationStatus())}),n.k0s()()()}if(2&e){const t=n.XpG();n.R7$(7),n.Y8G("ngModel",t.notificationEnabled)}}function y(e,l){if(1&e){const t=n.RV6();n.j41(0,"ion-row",8)(1,"ion-col",9),n.nrm(2,"ion-icon",18),n.k0s(),n.j41(3,"ion-col",19)(4,"h5"),n.EFF(5,"Location"),n.k0s()(),n.j41(6,"ion-col",20)(7,"ion-icon",21),n.bIt("click",function(){n.eBV(t);const i=n.XpG();return n.Njj(i.location())}),n.k0s()()()}}function x(e,l){if(1&e){const t=n.RV6();n.j41(0,"ion-row",8)(1,"ion-col",9),n.nrm(2,"ion-icon",22),n.k0s(),n.j41(3,"ion-col",15)(4,"h5"),n.EFF(5,"Camera"),n.k0s()(),n.j41(6,"ion-col",9)(7,"ion-toggle",17),n.bIt("ngModelChange",function(i){n.eBV(t);const r=n.XpG();return n.Njj(r.cameraPermission=i)})("ionChange",function(){n.eBV(t);const i=n.XpG();return n.Njj(i.toggleCameraPermission())}),n.k0s()()()}if(2&e){const t=n.XpG();n.R7$(7),n.Y8G("ngModel",t.cameraPermission)}}const b=[{path:"",component:(()=>{class e{constructor(t,o,i,r){this.platform=t,this.api=o,this.routes=i,this.analyticservice=r,this.logData=[],this.cameraPermission=!1,this.notificationEnabled=!1,this.headerObject={title:"info@mrmccouriers.com",sub_titile:"Premium Driver Account"},this.logData=this.api.getLoginData(),this.headerObject.main_title="WELCOME, <br>"+this.logData.firstName+"!",this.headerObject.title=this.logData.email?this.logData.email:this.logData.firstName}ngOnInit(){}notificationStatus(){const t=this.api.getLoginData();0==this.notificationEnabled?(this.notificationEnabled=!0,this.api.sendStatus({d_name:t.firstName+" "+t.lastName,email:t.email,status:this.notificationEnabled}).subscribe(i=>{}),this.analyticservice.log({name:"notifcation_status",params:{status:"true"}})):(this.notificationEnabled=!1,this.api.sendStatus({d_name:t.firstName+" "+t.lastName,email:t.email,status:this.notificationEnabled}).subscribe(i=>{}),this.analyticservice.log({name:"notifcation_status",params:{status:"false"}}))}logout(){var t=this;return(0,c.A)(function*(){yield localStorage.removeItem("auth"),t.analyticservice.log({name:"logout_localstorage_data_remove",params:{remove_authData:"Localstorage auth data remove"}}),yield localStorage.removeItem("chunk"),t.analyticservice.log({name:"logout_chunk_localstorage_data_remove",params:{remove_chunk:"Localstorage chunk data remove"}}),yield localStorage.clear(),t.routes.navigate(["/login"]),t.analyticservice.log({name:"logout_tab_change",params:{tab_change:"tab change tabs/setting to login"}})})()}openAppSetting(){return(0,c.A)(function*(){yield m.a.openUrl({url:"app-settings:"})})()}location(){return(0,c.A)(function*(){"android"==f.Ii.getPlatform()?yield m.a.openUrl({url:"com.android.settings"}):yield m.a.openUrl({url:"com.apple.preferences"})})()}toggleCameraPermission(){this.cameraPermission?(console.log("camere permission on",this.cameraPermission),this.requestCameraPermissions(),this.analyticservice.log({name:"camera_permission_status",params:{status:"true"}})):(console.log("camere permission off",this.cameraPermission),this.revokeCameraPermissions(),this.analyticservice.log({name:"camera_permission_status",params:{status:"false"}}))}requestCameraPermissions(){var t=this;return(0,c.A)(function*(){try{const o=yield h.i7.requestPermissions({permissions:["camera"]});t.cameraPermission="granted"===o.camera}catch(o){console.error("Error requesting camera permissions:",o)}})()}revokeCameraPermissions(){var t=this;return(0,c.A)(function*(){try{const o=yield h.i7.requestPermissions({permissions:["camera"]});t.cameraPermission="denied"===o.camera}catch(o){console.error("Error revoking camera permissions:",o)}})()}static{this.\u0275fac=function(o){return new(o||e)(n.rXU(_.OD),n.rXU(C.G),n.rXU(g.Ix),n.rXU(P.L))}}static{this.\u0275cmp=n.VBU({type:e,selectors:[["app-setting"]],decls:17,vars:7,consts:[[1,"ion-padding",3,"fullscreen"],[3,"headerObj"],[1,"setting"],["size","12",1,"ion-text-center"],[4,"ngIf"],[3,"click",4,"ngIf"],[1,"setting-section"],["class","mt-21",4,"ngIf"],[1,"mt-21"],["size","2",1,"icon"],["name","log-out-outline",1,"logout"],["size","10",1,"setting-details"],[1,"custom-text-color",3,"click"],[3,"click"],["name","notifications",1,"icon-notification"],["size","8",1,"setting-details"],["size","2",1,"icon-always"],[3,"ngModel","ngModelChange","ionChange"],["name","person",1,"location"],["size","7",1,"setting-details"],["size","3",1,"icon-always"],["name","arrow-forward",1,"arrow-forward",3,"click"],["name","camera",1,"camera"]],template:function(o,i){1&o&&(n.j41(0,"ion-content",0),n.nrm(1,"app-header",1),n.j41(2,"ion-grid")(3,"ion-row",2)(4,"ion-col",3),n.DNE(5,O,2,0,"h1",4),n.DNE(6,v,2,0,"h1",5),n.k0s()(),n.j41(7,"div",6),n.DNE(8,j,8,1,"ion-row",7),n.DNE(9,y,8,0,"ion-row",7),n.DNE(10,x,8,1,"ion-row",7),n.j41(11,"ion-row",8)(12,"ion-col",9),n.nrm(13,"ion-icon",10),n.k0s(),n.j41(14,"ion-col",11)(15,"h5",12),n.bIt("click",function(){return i.logout()}),n.EFF(16,"Logout"),n.k0s()()()()()()),2&o&&(n.Y8G("fullscreen",!0),n.R7$(1),n.Y8G("headerObj",i.headerObject),n.R7$(4),n.Y8G("ngIf",i.platform.is("android")),n.R7$(1),n.Y8G("ngIf",!i.platform.is("android")),n.R7$(2),n.Y8G("ngIf",i.platform.is("android")),n.R7$(1),n.Y8G("ngIf",i.platform.is("android")),n.R7$(1),n.Y8G("ngIf",i.platform.is("android")))},dependencies:[u.bT,M.l,s.hU,s.W9,s.lO,s.iq,s.ln,s.BY,s.hB,d.BC,d.vS],styles:["ion-content[_ngcontent-%COMP%]   .setting[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{color:var(--ion-text-green);font-weight:400;font-size:23.33pt}ion-content[_ngcontent-%COMP%]   ion-grid[_ngcontent-%COMP%]{margin-top:-30px}ion-content[_ngcontent-%COMP%]   .setting-section[_ngcontent-%COMP%]   .icon-notification[_ngcontent-%COMP%]{background:#FF4F00;padding:9px;border-radius:10px}ion-content[_ngcontent-%COMP%]   .setting-section[_ngcontent-%COMP%]   .integrations[_ngcontent-%COMP%]{background:#4D15F8;padding:9px;border-radius:10px}ion-content[_ngcontent-%COMP%]   .setting-section[_ngcontent-%COMP%]   .location[_ngcontent-%COMP%]{background:#FFB53A;padding:9px;border-radius:10px}ion-content[_ngcontent-%COMP%]   .setting-section[_ngcontent-%COMP%]   .photo[_ngcontent-%COMP%]{background:#72C071;padding:9px;border-radius:10px}ion-content[_ngcontent-%COMP%]   .setting-section[_ngcontent-%COMP%]   .camera[_ngcontent-%COMP%]{background:#DBDBDB;color:#000;padding:9px;border-radius:10px}ion-content[_ngcontent-%COMP%]   .setting-section[_ngcontent-%COMP%]   .logout[_ngcontent-%COMP%]{background:var(--ion-text-green);color:#f6f4f4;padding:9px;border-radius:10px}ion-content[_ngcontent-%COMP%]   .setting-section[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:10.67pt;color:var(--ion-font-gray-dark)}ion-content[_ngcontent-%COMP%]   .setting-section[_ngcontent-%COMP%]   h5[_ngcontent-%COMP%]{font-size:16pt;color:var(--ion-text-color);margin:0;padding:0}ion-content[_ngcontent-%COMP%]   .setting-section[_ngcontent-%COMP%]   .custom-text-color[_ngcontent-%COMP%]{color:var(--ion-text-green)}ion-content[_ngcontent-%COMP%]   .setting-section[_ngcontent-%COMP%]   .setting-details[_ngcontent-%COMP%]{align-self:center}ion-content[_ngcontent-%COMP%]   .setting-section[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center}ion-content[_ngcontent-%COMP%]   .setting-section[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%]   .person[_ngcontent-%COMP%]{background:#157EF8;padding:9px;border-radius:10px}ion-content[_ngcontent-%COMP%]   .setting-section[_ngcontent-%COMP%]   .arrow-forward[_ngcontent-%COMP%]{color:var(--ion-gray-icon-color)}ion-content[_ngcontent-%COMP%]   .setting-section[_ngcontent-%COMP%]   ion-toggle[_ngcontent-%COMP%]{--handle-background: var(--ion-text-green);--handle-background-checked: var(--ion-text-color);--track-background-checked: var(--ion-text-color)}ion-content[_ngcontent-%COMP%]   .mt-21[_ngcontent-%COMP%]{margin-top:21pt}ion-content[_ngcontent-%COMP%]   .icon-always[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:flex-end}ion-content[_ngcontent-%COMP%]   .icon-always[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{margin-right:5px}"]})}}return e})()}];let k=(()=>{class e{static{this.\u0275fac=function(o){return new(o||e)}}static{this.\u0275mod=n.$C({type:e})}static{this.\u0275inj=n.G2t({imports:[g.iI.forChild(b),g.iI]})}}return e})();var S=a(6164);let E=(()=>{class e{static{this.\u0275fac=function(o){return new(o||e)}}static{this.\u0275mod=n.$C({type:e})}static{this.\u0275inj=n.G2t({imports:[u.MD,k,S.G,s.bv,d.YN]})}}return e})()}}]);