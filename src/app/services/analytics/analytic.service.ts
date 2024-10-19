import { Injectable } from "@angular/core";
import { FirebaseAnalytics } from "@capacitor-community/firebase-analytics";
import { Capacitor } from '@capacitor/core';
// import config from '../../../../capacitor.config'; // import the config file

@Injectable({
  providedIn: "root",
})
export class AnalyticService {
  analyticsEnabled = true;

  constructor() {
    this.initializeFirebase();
  }

  initializeFirebase() {
    const platform = Capacitor.getPlatform();

    let firebaseConfig;

    if (platform === 'android') {
      firebaseConfig = {
        apiKey: 'AIzaSyC7chiGR2njMcJ7PiaMe35RbNTBme4eETQ',
        authDomain: '',
        projectId: 'courier-control-591a7',
        storageBucket: 'courier-control-591a7.appspot.com',
        messagingSenderId: '',
        appId: '1:87562420495:android:7cb66e673199f1a4a5be7a',
        measurementId: '',
      };
    } else if (platform === 'ios') {
      firebaseConfig = {
        apiKey: 'AIzaSyDgPcLIYcyTeevP1XTr5dPhe07_F70-uqc',
        authDomain: '',
        projectId: 'courier-control-591a7',
        storageBucket: 'courier-control-591a7.appspot.com',
        messagingSenderId: '87562420495',
        appId: '1:87562420495:ios:d92a645635f76da8a5be7a',
        measurementId: '',
      };
    } else if (platform === 'web') {
      firebaseConfig = {
        apiKey: '',
        authDomain: '',
        projectId: 'courier-control-591a7',
        storageBucket: 'courier-control-591a7.appspot.com',
        messagingSenderId: '',
        appId: '1:87562420495:ios:d92a645635f76da8a5be7a',
        measurementId: '',
      };
    } else {
      console.error('Unknown platform, unable to configure Firebase');
      return;
    }

    FirebaseAnalytics.initializeFirebase(firebaseConfig).then(() => {
      console.log(`Firebase initialized for ${platform}`);
    }).catch(err => {
      console.error('Error initializing Firebase:', err);
    });
  }

  async log(options: { name: string; params: object }, callback?: () => void) {
    try {
      FirebaseAnalytics.logEvent(options).then(callback);
    } catch (error) {
      console.error("Error logging event:", error);
    }
  }

  async setUserID(userId: any, callback?: () => void): Promise<void> {
    try {
      await FirebaseAnalytics.setUserId(userId).then(callback);
    } catch (error) {
      console.error("Error setting user ID:", error);
    }
  }

  async setUserProperty(options : {name:string,value:string},callback?:() => void){
    try {
      FirebaseAnalytics.setUserProperty(options).then(callback);
    } catch (error) {
      console.error("Error setting user property:", error);
    }
  }
}
