import { Component, ViewChild } from "@angular/core";
import { register } from "swiper/element/bundle";
import { Network } from "@capacitor/network";
import { ApiService } from "./services/api.service";
import { BackgroundService } from "./services/background.service";
import { Router } from "@angular/router";
import { Storage } from "@ionic/storage-angular";
import { Platform } from "@ionic/angular";
import { DbService } from "./services/db.service";
import { StatusBar } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { PushNotificationService } from "./services/push-notification.service";
import { App } from "@capacitor/app";
import { BackgroundTask } from "@capawesome/capacitor-background-task";
import { Capacitor } from '@capacitor/core'; // Import Capacitor

// StatusBar.setOverlaysWebView({ overlay: false });
// Register Swiper elements
register();

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  attachMentName: any;
  attachMent: any;
  details: string = "";
  practiceId!: any;
  image: any;
  location: any;
  authData: any;
  isConnectFunctionRunning = false;
  taskId: any;
  stopInterval: any;

  constructor(
    private notification: PushNotificationService,
    private backgroundService: BackgroundService,
    private db: DbService,
    private platform: Platform,
    private router: Router,
    private api: ApiService,
    private storage: Storage
  ) {
    this.initializeApp();
    this.notification.initPush();

    App.addListener("appStateChange", async ({ isActive }) => {
      try {
        if (isActive) {
          if (this.taskId) {
            BackgroundTask.finish({ taskId: this.taskId });
            clearInterval(this.stopInterval);
          }
          return;
        }
        this.taskId = await BackgroundTask.beforeExit(async () => {
          let networkStatusChanged = false;
          this.stopInterval = setInterval(async () => {
            try {
              if (!networkStatusChanged) {
                const statusNet = await Network.getStatus();
                if (statusNet.connected) {
                  networkStatusChanged = true;
                  const authData = JSON.parse(
                    localStorage.getItem("auth") || "[]"
                  );
                  if (authData && Object.keys(authData).length > 0) {
                    const data: any = await this.db.getCollectionData();
                    const dropData: any = await this.db.getDropOffData();
                    if (data.rows.length > 0) {
                      this.backgroundService.apiCall(data);
                    }
                    if (dropData.rows.length > 0) {
                      this.backgroundService.apiDropOffCall(dropData);
                    }
                  }
                }
                setTimeout(() => {
                  networkStatusChanged = false;
                }, 1000);
              }
            } catch (error) {
              console.error("Error in network status check:", error);
            }
          }, 10000);
        });
      } catch (error) {
        console.error("Error in appStateChange listener:", error);
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isNativePlatform()) {
        // Only set StatusBar and SplashScreen on native platforms
        StatusBar.setOverlaysWebView({ overlay: false });
        SplashScreen.hide();
      }
    });
  }

  async ngOnInit() {
    if (this.platform.is("ios") || this.platform.is("android")) {
      try {
        await this.storage.create();
        this.platform.ready().then(async () => {
          this.init();
          let networkStatusChanged = false;
          Network.addListener("networkStatusChange", async (status) => {
            try {
              if (!networkStatusChanged) {
                networkStatusChanged = true;
                const statusNet = await Network.getStatus();
                if (statusNet.connected) {
                  const authData = JSON.parse(
                    localStorage.getItem("auth") || "[]"
                  );
                  if (authData && Object.keys(authData).length > 0) {
                    const data: any = await this.db.getCollectionData();
                    if (data.rows.length > 0) {
                      this.backgroundService.apiCall(data);
                    }
                    const dropData: any = await this.db.getDropOffData();
                    if (dropData.rows.length > 0) {
                      this.backgroundService.apiDropOffCall(dropData);
                    }
                  }
                }
                setTimeout(() => {
                  networkStatusChanged = false;
                }, 1000);
              }
            } catch (error) {
              console.error("Error in network status change listener:", error);
            }
          });
        });
      } catch (error) {
        console.error("Error in ngOnInit:", error);
      }
    }
  }

  async init() {
    try {
      await SplashScreen.show({
        showDuration: 2500,
        autoHide: true,
      });
    } catch (error) {
      console.error("Error in initializing SplashScreen:", error);
    }
  }
}
