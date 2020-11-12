// import * as HashTablePlugin from '../../assets/plugin/rexcsvtohashtableplugin.min.js'
// import * as ContainerLitePlugin from '../../assets/plugin/rexcontainerliteplugin.min.js'
import { Component } from '@angular/core'
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx'
import { AlertController, Platform } from '@ionic/angular'
import * as BBCodeTextPlugin from '../../assets/plugin/rexbbcodetextplugin.min.js'
import * as FadePlugin from '../../assets/plugin/rexfadeplugin.min.js'
import * as ShakePlugin from '../../assets/plugin/rexshakepositionplugin.min.js'
import * as TextTypingPlugin from '../../assets/plugin/rextexttypingplugin.min.js'
import * as UIPlugin from '../../assets/plugin/rexuiplugin.min.js'
import * as WebFontLoaderPlugin from '../../assets/plugin/rexwebfontloaderplugin.min.js'
import { MainmenuScene, SplashScene } from '../scenes'
import { Utils } from '../shared/utils'

@Component({
  selector: 'app-game',
  templateUrl: 'game.page.html',
  styleUrls: ['game.page.scss'],
  providers: [
    SplashScene, MainmenuScene
  ]
})
export class GamePage {

  gameConfig = {
    type: Phaser.WEBGL,
    scale: {
      width: 1440,
      height: 1920,
      mode: Phaser.Scale.ScaleModes.HEIGHT_CONTROLS_WIDTH,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: 'game'
    },
    transparent: true,
    dom: {
      createContainer: true
    },
    physics : {
      default: 'matter',
      matter: {
        debug: false,
        gravity: {
          y: 0.9
        }
      }
    },
    plugins: {
      global: [{
        key: 'rexBBCodeTextPlugin',
        plugin: BBCodeTextPlugin,
        start: true
      }, {
        key: 'rexShake',
        plugin: ShakePlugin,
        start: true
      }, {
        key: 'rexTextTyping',
        plugin: TextTypingPlugin,
        start: true
      }, {
        key: 'rexFade',
        plugin: FadePlugin,
        start: true
      // }, {
        // key: 'rexContainerLite',
        // plugin: ContainerLitePlugin,
        // start: true
      // }, {
        // key: 'rexHashTable',
        // plugin: HashTablePlugin,
        // start: true
      }, {
        key: 'WebFontLoader',
        plugin: WebFontLoaderPlugin,
        start: true
      }],
      scene: [{
        key: 'rexUI',
        plugin: UIPlugin,
        mapping: 'rexUI'
      }]
    }
  }

  canvasConfig = {
    type: Phaser.CANVAS,
    scale: {
      width: 1080,
      height: 1080,
      mode: Phaser.Scale.ScaleModes.HEIGHT_CONTROLS_WIDTH,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: 'canvas'
    },
    transparent: true,
    plugins: {
      global: [{
        key: 'rexBBCodeTextPlugin',
        plugin: BBCodeTextPlugin,
        start: true
      }, {
        key: 'WebFontLoader',
        plugin: WebFontLoaderPlugin,
        start: true
      }]
    }
  }

  constructor(
    private platform: Platform,
    private mobileAccessibility: MobileAccessibility,
    private alertController: AlertController,
    private splashScene: SplashScene,
    private mainmenuScene: MainmenuScene,
    ) { }

  public onGameReady(game: Phaser.Game): void {
    console.log('onGameReady')
    this.platform.ready()
      .then(() => {
        this.mobileAccessibility.usePreferredTextZoom(false)
      })
      .then(() => {
        const config = {
        }
        game.scene.add('Splash', this.splashScene.setup(config), true)
        game.scene.add('Mainmenu', this.mainmenuScene.setup(config))
        game.scale.on('resize', () => {
          for (const scene of game.scene.getScenes(true)) {
            // @ts-ignore
            if (typeof scene.resize === 'function') {
              const viewBounds = Utils.getViewBounds(game.scale)
              // @ts-ignore
              scene.resize(viewBounds)
            }
          }
        })
        this.platform.pause.subscribe(() => {
          console.log('pause')
          game.sound.pauseAll()
        })
        this.platform.resume.subscribe(() => {
          console.log('resume')
          game.sound.resumeAll()
        })
      })
      .catch(err => {
        this.alertController.create({
          header: 'Start Failed!',
          subHeader: 'Retry again with network connection.',
          message: err.toString(),
          buttons: [{
            text: 'Retry',
            handler: () => window.location.reload()
          }]
        })
          .then(alert => alert.present())
      })
  }
}
