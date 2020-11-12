import { Scene } from '../shared/scene'

export abstract class Element extends Phaser.GameObjects.Container {

  private _scene: Scene = null
  public get scene() {
    return this._scene
  }
  private _ready = false
  public activeTween: Phaser.Tweens.Tween = null
  public pointerDowned = false
  public displayContainer: Phaser.GameObjects.Container = null
  public zone?: Phaser.GameObjects.Zone = null
  public click?: (Element) => void = null
  protected _width = 0
  protected _height = 0
  protected _roundWidth = 0
  private graphicsShadow: Phaser.GameObjects.Graphics = null
  private graphicsFrame: Phaser.GameObjects.Graphics = null
  private graphicsFrameOuter: Phaser.GameObjects.Graphics = null
  private graphicsBackground: Phaser.GameObjects.Graphics = null
  public disable = false
  public tween = false

  constructor(scene: Scene, config: any) {
    super(scene)

    this._scene = scene
    this._ready = false
    const x = config.x || 0
    const y = config.y || 0
    this._width = config.width || (config.radius * 2) || this._width
    this._height = config.height || (config.radius * 2) || this._height
    this._roundWidth = config.roundWidth || config.radius || this._roundWidth
    const noBackground = config.noBackground || false
    const backgroundColor = config.backgroundColor || 0xffffff
    const backgroundColorClick = config.backgroundColorClick || 0xf8d0c9
    const backgroundColorOver = config.backgroundColorOver || 0xf7caf4
    const backgroundAlpha = config.backgroundAlpha || 1.0
    const frameWidth = config.frameWidth || 0
    const frameColor = config.frameColor || 0x000000
    const frameColorDisabled = config.frameColorDisabled || 0x6f6f6f
    const frameAlpha = config.frameAlpha || 1.0
    const frameOuterWidth = config.frameOuterWidth || 0
    const frameOuterColor = config.frameOuterColor || 0x000000
    const frameOuterAlpha = config.frameOuterAlpha || 1.0
    const shadowOffsetX = config.shadowOffsetX || 0
    const shadowOffsetY = config.shadowOffsetY || 0
    const shadowColor = config.shadowColor || 0x000000
    const shadowAlpha = config.shadowAlpha || 1.0
    this.disable = config.disable || false
    this.click = config.click || null
    this.tween = config.tween || true

    this.setPosition(x, y)

    this.displayContainer = scene.add.container(0, 0)
    this.displayContainer.setAlpha(this.disable ? 0.5 : 1.0)

    if (shadowOffsetX !== 0 || shadowOffsetY !== 0) {
      this.graphicsShadow = scene.add.graphics().setScrollFactor(0, 0)
      this.graphicsShadow.fillStyle(shadowColor, shadowAlpha)
      this.graphicsShadow.fillRoundedRect(-this._width / 2 - frameWidth + shadowOffsetX, -this._height / 2 - frameWidth + shadowOffsetY, this._width + frameWidth * 2, this._height + frameWidth * 2, this._roundWidth + frameWidth)
      this.graphicsShadow.setVisible(!this.disable)
      this.displayContainer.add(this.graphicsShadow)
    }

    if (frameOuterWidth > 0) {
      this.graphicsFrameOuter = scene.add.graphics().setScrollFactor(0, 0)
      this.graphicsFrameOuter.fillStyle(frameOuterColor, frameOuterAlpha)
      this.graphicsFrameOuter.fillRoundedRect(-this._width / 2 - frameWidth - frameOuterWidth, -this._height / 2 - frameWidth - frameOuterWidth, this._width + frameWidth * 2 + frameOuterWidth * 2, this._height + frameWidth * 2 + frameOuterWidth * 2, this._roundWidth + frameWidth + frameOuterWidth)
      this.graphicsFrameOuter.setVisible(!this.disable)
      this.displayContainer.add(this.graphicsFrameOuter)
    }

    if (frameWidth > 0) {
      this.graphicsFrame = scene.add.graphics().setScrollFactor(0, 0)
      this.graphicsFrame.fillStyle(frameColor, frameAlpha)
      this.graphicsFrame.fillRoundedRect(-this._width / 2 - frameWidth, -this._height / 2 - frameWidth, this._width + frameWidth * 2, this._height + frameWidth * 2, this._roundWidth + frameWidth)
      // if (frameOuterWidth>0) this.graphicsFrame.setStrokeStyle(frameOuterWidth, frameOuterColor, frameOuterAlpha)
      this.graphicsFrame.setVisible(!this.disable)
      this.displayContainer.add(this.graphicsFrame)
    }

    if (!noBackground) {
      this.graphicsBackground = scene.add.graphics().setScrollFactor(0, 0)
      this.graphicsBackground.fillStyle(backgroundColor, backgroundAlpha)
      this.graphicsBackground.fillRoundedRect(-this._width / 2, -this._height / 2, this._width, this._height, this._roundWidth)
      this.displayContainer.add(this.graphicsBackground)
    }

  }

  start(config) {
    this.add(this.displayContainer)
    this.scene.add.existing(this)

    const delay = config.delay || 0
    const disableStartEffect = config.disableStartEffect || false
    if (!disableStartEffect) {
      this.displayContainer.setScale(0)
      this.activeTween = this.scene.tweens.add({
        targets: this.displayContainer,
        delay,
        duration: 100,
        ease: 'Back.easeOut',
        scaleX: 1,
        scaleY: 1,
        onComplete: () => {
          this.activeTween = null
          this._ready = true
        }
      })
    } else {
      this._ready = true
    }
  }

  destroy() {
    this.scene.removeElement(this)
    this._ready = false
    if (this.activeTween) {
      this.scene.tweens.remove(this.activeTween)
      this.activeTween = null
    }
    super.destroy()
  }


  setBackgroundcolor(color) {
    this.displayContainer.remove(this.graphicsBackground)
    this.graphicsBackground.fillStyle(color, 1)
    this.graphicsBackground.fillRoundedRect(-this._width / 2, -this._height / 2, this._width, this._height, this._roundWidth)
    this.displayContainer.add(this.graphicsBackground)
  }

  setReady(ready) {
    this._ready = ready
  }

  update(time, delta) {
  }

  pointerover(pointer) {
    if (!this._ready || this.disable) {
      return
    }
    if (this.activeTween) {
      this.scene.tweens.remove(this.activeTween)
      this.activeTween = null
    }
    this.activeTween = this.scene.tweens.add({
      targets: this.displayContainer,
      duration: 50,
      ease: 'Sine.easeInOut',
      yoyo: true,
      scaleX: '-=0.1',
      scaleY: '-=0.1',
      onComplete: () => {
        this.activeTween = null
      }
    })
  }

  pointerout(pointer) {
  }

  pointerdown(pointer) {
    if (!this._ready || this.disable) {
      return
    }
    // console.log('buttonSprite:',this.buttonSprite)
    if (this.tween === false) {
      console.log('Change Sprite upon Down:')
    } else {
      if (this.activeTween) {
        this.scene.tweens.remove(this.activeTween)
        this.activeTween = null
      }
      this.displayContainer.setScale(0.8)
    }
  }

  pointerup(pointer) {
    if (!this._ready || this.disable) {
      return
    }
    if (this.tween === false) {
      console.log('Change Sprite upon Down:')
    } else {
      if (this.activeTween) {
        this.scene.tweens.remove(this.activeTween)
        this.activeTween = null
      }
      this.displayContainer.setScale(1)
      this.activeTween = this.scene.tweens.add({
        targets: this.displayContainer,
        duration: 80,
        ease: 'Sine.easeInOut',
        repeat: 1,
        yoyo: true,
        scaleX: '-=0.1',
        scaleY: '-=0.1',
        onComplete: () => {
          this.activeTween = null
        }
      })
    }
  }

  setDisable(disable: boolean) {
    if (this.disable !== disable) {
      this.disable = disable
      if (this.graphicsShadow) {
        this.graphicsShadow.setVisible(disable)
      }
      if (this.graphicsFrame) {
        this.graphicsFrame.setVisible(disable)
      }
      if (this.graphicsFrameOuter) {
        this.graphicsFrameOuter.setVisible(disable)
      }
      this.displayContainer.setAlpha(disable ? 0.5 : 1.0)
    }
  }
}
