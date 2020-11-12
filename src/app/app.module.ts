import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { RouteReuseStrategy } from '@angular/router'
import { AngularFireModule } from '@angular/fire'
import { AngularFireAuthModule } from '@angular/fire/auth'
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { environment } from '../environments/environment'
import { IonicModule, IonicRouteStrategy } from '@ionic/angular'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'
import { Keyboard } from '@ionic-native/keyboard/ngx'
// import { GooglePlayGamesServices } from '@ionic-native/google-play-games-services/ngx'
// import { CameraPreview } from '@ionic-native/camera-preview/ngx'
import { AppVersion } from '@ionic-native/app-version/ngx'
import { File } from '@ionic-native/file/ngx'
import { IonicStorageModule } from '@ionic/storage'
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx'

import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    IonicStorageModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    // GooglePlayGamesServices,
    // CameraPreview,
    AppVersion,
    File,
    MobileAccessibility,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
