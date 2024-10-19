import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from './../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DbService } from 'src/app/services/db.service';
import { BackgroundService } from 'src/app/services/background.service';
import { AlertController } from '@ionic/angular';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { AnalyticService } from 'src/app/services/analytics/analytic.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  subscriptions: Subscription[] = [];

  constructor(private notification: PushNotificationService,private alertCtrl: AlertController, private backgroundService: BackgroundService, private db: DbService, private formBuilder: FormBuilder, private api: ApiService, private router: Router,private analyticservice: AnalyticService) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],

    })
  }


  ngOnInit() {

  }
  login() {
    this.subscriptions.push(this.api.getUserDetail(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: (v) => {
        let data = {"userDeatils":"User Data found" }
        this.analyticservice.log({name: 'login_user_details',params:data});
        this.success(v);
      },
      error: (e) => {
        this.error(e.error.message)
        let data = {"userDeatils":"User Data not found" }
        this.analyticservice.log({name: 'login_user_details',params:data});
      }
    }))
  }
  async success(d: any) {
   await this.notification.initPush();
    let a = btoa(`${this.loginForm.value.email}:${this.loginForm.value.password}`);
    await localStorage.setItem("auth", JSON.stringify(d));
    await localStorage.setItem("chunk", a);
    const authData:any = JSON.parse(localStorage.getItem("auth") || '[]')
    console.log('authData: ', authData);
    this.analyticservice.log({name: 'login_localstorage_add_event',params:authData});

    this.analyticservice.setUserID(authData.email, () => {});
    this.analyticservice.setUserProperty({ name: 'login_email', value: authData.email });
    this.analyticservice.setUserProperty({ name: 'login_role', value: authData.role });
    if (authData) {
      const data = await this.db.getCollectionData();
      this.backgroundService.apiCall(data);
    }
    setTimeout(async () => {
      await this.router.navigateByUrl('/tabs/tab3');
      let data ={};
      data= { "tab_change":"tab change login to tabs/tab3" } 
      this.analyticservice.log({name: 'login_tab_sucessfully_change',params:data});
    }, 800);

  }
  errors: string = "";
  async error(e: any) {
    this.errors = e;
    // alert(this.errors)
    const prompt = await this.alertCtrl.create({
      header: 'Error',
      cssClass: 'alertControl',
      message: this.errors,
      mode: 'ios'
    })
    await prompt.present();

  }
}
