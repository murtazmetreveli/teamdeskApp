import { Plugins, Capacitor } from "@capacitor/core";
import { ChangeDetectorRef, Component, NgZone, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  UntypedFormControl,
  UntypedFormGroup,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
// import { DialogService } from '@app/core';
import {
  Barcode,
  BarcodeFormat,
  BarcodeScanner,
  LensFacing,
} from "@capacitor-mlkit/barcode-scanning";
import { FilePicker } from "@capawesome/capacitor-file-picker";
import {
  AlertController,
  ModalController,
  LoadingController,
  NavController,
  Platform,
} from "@ionic/angular";
import { BarcodeScanningModalComponent } from "./barcode-scanning-modal.component";
import { Location } from "@angular/common";
import { Storage } from "@ionic/storage-angular";
import { Geolocation, GeolocationOptions } from "@capacitor/geolocation";
import { AppLauncher, AppLauncherPlugin } from "@capacitor/app-launcher";
import { DbService } from "src/app/services/db.service";
import { Subscription, throwError } from "rxjs";
import { AnalyticService } from "src/app/services/analytics/analytic.service";

@Component({
  selector: "app-barcode-scanning",
  templateUrl: "./barcode-scanning.page.html",
  styleUrls: ["./barcode-scanning.page.scss"],
})
export class BarcodeScanningPage implements OnInit {
  headerData: any = [];
  collectionDetails: any = [
    { name: "Samples Collected" },
    { name: "Box Empty" },
    { name: "Samples Not In Bag" },
    { name: "Other Issue" },
  ];
  public readonly barcodeFormat = BarcodeFormat;
  public readonly lensFacing = LensFacing;
  dropOff: boolean = false;
  public formGroup = new FormGroup({
    formats: new FormControl([]),
    lensFacing: new FormControl(LensFacing.Back),
    googleBarcodeScannerModuleInstallState: new FormControl(0),
    googleBarcodeScannerModuleInstallProgress: new FormControl(0),
  });
  public barcodes: Barcode[] = [];
  public isSupported = false;
  public isPermissionGranted = false;
  isAlertErrorOpen = false;
  isLocationPopup = false;
  scanerLoader: any;
  beginRoute: any;
  scanIsInProgress = false;
  isModalOpen = false;
  private dataScanSubscription: Subscription;
  private dataInsertSubscription: Subscription;
  constructor(
    private alertController: AlertController,
    private router: Router,
    private readonly dialogService: ModalController,
    private readonly ngZone: NgZone,
    private route: ActivatedRoute,
    private location: Location,
    private storage: Storage,
    private db: DbService,
    private ref: ChangeDetectorRef,
    private geo: Geolocation,
    private loadingController: LoadingController,
    private analyticservice: AnalyticService,
    private Platform: Platform, private navCtrl: NavController,
  ) {
    this.headerData = {
      title: "SCAN COLLECTION CODE",
      button_text: "Route Complete",
      serach: false,
    };
    this.beginRoute = localStorage.getItem("begin_route");
    this.dataScanSubscription = this.db.dataScan.subscribe(async (res) => {
      if (res) {
        console.log("dataScan result:", res);
        if (this.beginRoute == "true" && !this.scanIsInProgress) {
          await this.scan();
        } else {
          this.router.navigateByUrl("/tabs/tab3");
        }
      }
    })
    this.dataInsertSubscription = this.db.dataInsertStatus.subscribe((res) => {
      if (res) {
        console.log("dataInsertStatus", res);
        if (this.beginRoute == "true") {
          this.scan();
        } else {
          this.router.navigateByUrl("/tabs/tab3");
        }
      }
    })

  }
  setOpenError(isOpen: boolean) {
    this.isAlertErrorOpen = isOpen;
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
  public async ngOnInit() { }
  async ionViewWillEnter() {
    this.beginRoute = localStorage.getItem("begin_route");
    console.log("--------", this.beginRoute);
    if (Capacitor.getPlatform() === "ios") {
      await BarcodeScanner.isSupported().then((result) => {
        this.isSupported = result.supported;
      });
      if (this.beginRoute == "true") {
        console.log("Starting from QR Code Scan");
        setTimeout(async () => {
          this.scanerLoader = await this.loadingController.create({
            cssClass: "spinner",
            mode: "md",
          });
          this.scan();
        }, 500);
      } else {
        this.router.navigateByUrl("/tabs/tab3");
      }
    } else {
      this.checkPermissionsAndScan();
    }
  }
  async checkPermissionsAndScan() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
    BarcodeScanner.checkPermissions().then((result) => {
      this.isPermissionGranted = result.camera === "granted";
    });
    BarcodeScanner.removeAllListeners().then(() => {
      BarcodeScanner.addListener(
        "googleBarcodeScannerModuleInstallProgress",
        (event) => {
          this.ngZone.run(() => {
            const { state, progress } = event;
            this.formGroup.patchValue({
              googleBarcodeScannerModuleInstallState: state,
              googleBarcodeScannerModuleInstallProgress: progress,
            });
          });
        }
      );
    });
    if (this.beginRoute == "true") {
      this.scanerLoader = await this.loadingController.create({
        cssClass: "spinner",
        mode: "md",
      });
      await this.scan();
      await this.installGoogleBarcodeScannerModule();
    } else {
      this.router.navigateByUrl("/tabs/tab3");
    }
  }
  public async startScan(): Promise<void> {
    const formats = this.formGroup.get("formats")?.value || [];
    const lensFacing = LensFacing.Back;
    const element = await this.dialogService.create({
      component: BarcodeScanningModalComponent,
      cssClass: "barcode-scanning-modal",
      showBackdrop: false,
      componentProps: {
        formats: formats,
        lensFacing: lensFacing,
      },
    });
    element.onDidDismiss().then((result) => {
      const barcode: Barcode | undefined = result.data?.barcode;
      if (barcode) {
        this.barcodes = [barcode];
      }
    });
  }
  ngOnDestroy() {
    this.scanIsInProgress = false;
    if (this.dataScanSubscription) {
      this.dataScanSubscription.unsubscribe();
    }
    if (this.dataInsertSubscription) {
      this.dataInsertSubscription.unsubscribe();
    }
  }

  ionViewWillLeave() {
    this.scanIsInProgress = false;
    if (this.dataScanSubscription) {
      this.dataScanSubscription.unsubscribe();
    }
    if (this.dataInsertSubscription) {
      this.dataInsertSubscription.unsubscribe();
    }
  }
  async printCurrentPosition() {
    try {
      await Geolocation.getCurrentPosition({
        timeout: 1000,
      })
        .then(async (coordinates) => {
          const lat = coordinates.coords.latitude;
          const lng = coordinates.coords.longitude;
          var locationInfo = JSON.parse(
            (await this.storage.get("outbox")) || "[]"
          );
          if (!(locationInfo instanceof Array)) locationInfo = [locationInfo]; // if not, create one
          locationInfo[0].Location = `${lat}, ${lng}`;
          await this.storage.set("outbox", JSON.stringify(locationInfo));
          this.isModalOpen = true;
          this.ref.detectChanges();
          console.log('isModalOpen', this.isModalOpen)

        })
        .catch(async (error) => {
          this.scanerLoader.dismiss();
          setTimeout(async () => {
            let string = "";
            if (Capacitor.getPlatform() === "ios") {
              string = "( setting > privacy & Security > Location Services)";
            } else {
              string = "( setting > Location )";
            }

            const alert = await this.alertController.create({
              header: "Enable Location Services",
              message: `Please enable location services in your device settings to use this feature. ${string}`,
              cssClass: "alertControl",
              mode: "ios",
              buttons: [
                {
                  text: "Cancel",
                  role: "cancel",
                  handler: () => { },
                },
                {
                  text: "Go to Settings",
                  handler: async () => {
                    if (Capacitor.getPlatform() === "ios") {
                      await AppLauncher.openUrl({ url: "app-settings:" });
                    } else if (Capacitor.getPlatform() === "android") {
                      await AppLauncher.openUrl({
                        url: "com.android.settings",
                      });
                    } else {
                      console.log("Web!");
                    }
                  },
                },
              ],
            });
            await alert.present();
          }, 1000);
        });
    } catch (error) {
      this.scanerLoader.dismiss();
      if (Capacitor.getPlatform() != "ios") {
        const alert = await this.alertController.create({
          header: "Enable Location Services",
          message:
            "Please enable location services in your device settings to use this feature.",
          cssClass: "alertControl",
          mode: "ios",
          buttons: [
            {
              text: "Cancel",
              role: "cancel",
              handler: () => { },
            },
            {
              text: "Go to Settings",
              handler: async () => {
                if (Capacitor.getPlatform() === "ios") {
                  // await AppLauncher.openUrl({ url: 'com.apple.preferences' });
                } else if (Capacitor.getPlatform() === "android") {
                  await AppLauncher.openUrl({ url: "com.android.settings" });
                } else {
                  console.log("Web!");
                }
                // You can instruct users to manually enable location services here
              },
            },
          ],
        });
        await alert.present();
      }
    }
  }

  public async readBarcodeFromImage(): Promise<void> {
    const { files } = await FilePicker.pickImages({ multiple: false });
    const path = files[0]?.path;
    if (!path) {
      return;
    }
    const formats = this.formGroup.get("formats")?.value || [];
    const { barcodes } = await BarcodeScanner.readBarcodesFromImage({
      path,
      formats,
    });
    this.barcodes = barcodes;
  }
  async scan() {
    this.scanIsInProgress = true;
    await this.scanerLoader.present();
    try {
      this.scanerLoader?.dismiss();
      const { barcodes } = await BarcodeScanner.scan();
      console.log('barcodes------', barcodes)
      this.ref.detectChanges();
      this.barcodes = barcodes;
      if (this.barcodes) {
        let practiceId = {
          practiceId: this.barcodes[0].displayValue,
        };
        await this.storage.set("outbox", JSON.stringify(practiceId));
        // if(this.Platform.is('android')){
        this.analyticservice.log({ name: 'scan_data_store_outbox', params: practiceId });
        // }
        await this.printCurrentPosition();
        this.scanIsInProgress = false;
      }
    } catch (error) {
      console.error("Error scanning barcodes:", error);
      this.scanerLoader?.dismiss();
      this.scanIsInProgress = false;
    } finally {
      this.scanIsInProgress = false;
    }
  }

  public async openSettings(): Promise<void> {
    await BarcodeScanner.openSettings();
  }

  public async installGoogleBarcodeScannerModule(): Promise<void> {
    await BarcodeScanner.installGoogleBarcodeScannerModule();
  }

  public async requestPermissions(): Promise<void> {
    await BarcodeScanner.requestPermissions();
  }

  objCheck(data: any) {
    if (Object.keys(data)) {
      return true;
    } else {
      return false;
    }
  }
  async collectionClick(data: any) {
    var StatusInfo = JSON.parse((await this.storage.get("outbox")) || "[]");
    if (!(StatusInfo instanceof Array)) StatusInfo = [StatusInfo]; // if not, create one
    StatusInfo[0].Status = data.name;
    await this.storage.set("outbox", JSON.stringify(StatusInfo));
    if (data) {
      this.dialogService.dismiss();
      await this.setOpen(false);

      this.scanIsInProgress = false;
      if (this.dataScanSubscription) {
        this.dataScanSubscription.unsubscribe();
      }
    }

    if (this.Platform.is('ios')) {
      this.navCtrl.navigateRoot(['upload-images']);
    } else {
      await this.router.navigateByUrl("upload-images");
    }
  }
}
