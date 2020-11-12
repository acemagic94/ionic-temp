import { Injectable } from '@angular/core'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { Platform } from '@ionic/angular'
import { timer } from 'rxjs'
import { Scene } from '../shared/scene'

@Injectable()
export class SplashScene extends Scene {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen
  ) {
    super({
      key: 'Splash',
      pack: {
        files: [
          { type: 'scenePlugin', key: 'SpineWebGLPlugin', url: 'assets/plugin/SpineWebGLPlugin.js', sceneKey: 'spine' },
          { type: 'rexWebFont', key: 'webfont', config: { custom: { families: ['Sniglet-Regular', 'BMJUA', 'godoMaum'] } } }
        ]
      }
    })
  }

  preload() {
    this.load.pack('pack', 'assets/json/pack.json')
  }

  preCreate(data) {
    // this.audio.play('logo')
    this.splashScreen.hide()

    const splash = this.add.image(this.groundBounds.centerX, this.groundBounds.centerY, 'ui.loading.splash')
    this.backgroundContainer.add(splash)

    timer(1000).subscribe(() => {
      this.transition('Mainmenu')
    })
  }

}
