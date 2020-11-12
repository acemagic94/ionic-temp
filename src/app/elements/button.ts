import { Scene } from '../shared/scene'
import { Element } from './element'

export class Button extends Element {

  gauge = 0
  gaugeColor: any = 0xffffff
  gaugeAlpha = 1.0
  private graphicsGauge: Phaser.GameObjects.Graphics = null
  private _maskShape: Phaser.GameObjects.Graphics = null
  private _mask: Phaser.Display.Masks.GeometryMask = null
  iconWidth = 0
  iconHeight = 0
  iconSlot = 'center'
  iconOffsetX = 0
  iconOffsetY = 0
  image: Phaser.GameObjects.Image = null
  text = ''
  textSlot = 'center'
  textStyle = {}
  textOffsetX = 0
  textOffsetY = 0
  textAlign = 'center'
  label: Phaser.GameObjects.Text = null

  constructor(scene: Scene, config: any) {
    super(scene, config)

    const icon = config.icon || ''
    const iconSlot = config.iconSlot || 'center'
    this.text = config.text || ''
    this.textSlot = config.textSlot || 'center'
    this.textStyle = config.textStyle || { fontFamily: 'BMJUA', fontSize: 30, color: '#4f2c15', padding: 20 }
    this.textOffsetX = config.textOffsetX || 0
    this.textOffsetY = config.textOffsetY || 0
    this.textAlign = config.textAlign || 'center'
    const gaugeEnabled = config.gaugeEnabled || false
    this.gauge = config.gauge || 0.0
    this.gaugeColor = config.gaugeColor || this.gaugeColor
    const gaugeAlpha = config.gaugeAlpha || this.gaugeAlpha

    if (gaugeEnabled) {
      const gaugeColor = typeof this.gaugeColor === 'function' ? this.gaugeColor(this.gauge) : this.gaugeColor
      this.graphicsGauge = scene.add.graphics()
      this.graphicsGauge.fillStyle(gaugeColor, gaugeAlpha)
      this.graphicsGauge.fillRoundedRect(-this._width / 2, -this._height / 2, this._width, this._height, this._roundWidth)
      // @ts-ignore
      this._maskShape = scene.make.graphics()
      this._maskShape.fillStyle(0xffffff)
      this._maskShape.beginPath()
      this._maskShape.fillRect(-this._width / 2, -this._height / 2, this._width, this._height)
      this._mask = new Phaser.Display.Masks.GeometryMask(scene, this._maskShape)
      this.graphicsGauge.setMask(this._mask)
      this.displayContainer.add(this.graphicsGauge)
    }

    if (icon !== '') {
      const iconX = this.iconSlot === 'left' ? -this._width / 2 : (this.iconSlot === 'right' ? this._width / 2 : 0)
      this.iconWidth = config.iconWidth || this._width
      this.iconHeight = config.iconHeight || this._height
      this.iconSlot = config.iconSlot || 'center'
      this.iconOffsetX = config.iconOffsetX || 0
      this.iconOffsetY = config.iconOffsetY || 0
      // const image = scene.add.image(this.iconOffsetX, this.iconOffsetY, icon).setDisplaySize(this.iconWidth, this.iconHeight)
      const image = scene.add.image(iconX + this.iconOffsetX, this.iconOffsetY, icon).setScrollFactor(0, 0)
      // this.image = scene.add.image(this.iconOffsetX, this.iconOffsetY, icon)
      this.displayContainer.add(image)
    }

    if (this.text !== '') {
      const textX = this.textSlot === 'left' ? -this._width / 2 : (this.textSlot === 'right' ? this._width / 2 : 0)
      this.label = scene.add.text(textX + this.textOffsetX, this.textOffsetY, this.text, this.textStyle).setOrigin(this.textAlign === 'left' ? 0.0 : (this.textAlign === 'right' ? 1.0 : 0.5), 0.5)
      this.displayContainer.add(this.label)
    }

    this.zone = scene.add.zone(0, 0, this._width, this._height).setScrollFactor(0, 0)
    this.zone.setInteractive()
    this.add(this.zone)

    this.start(config)
  }

  update(time, delta) {
    if (this._maskShape) {
      const offset = this.zone.height * (1.0 - this.gauge) * this.displayContainer.scale
      const matrix = this.displayContainer.getWorldTransformMatrix()
      this._maskShape.setPosition(matrix.tx, matrix.ty + offset)
      this._maskShape.setScale(this.displayContainer.scale)
    }
  }

  setIcon(icon) {
    if (this.image) {
      this.image.destroy()
    }
    this.image = this.scene.add.image(this.iconOffsetX, this.iconOffsetY, icon).setDisplaySize(this.iconWidth, this.iconHeight)
    this.displayContainer.add(this.image)
  }

  setText(text) {
    this.text = text
    if (this.label) {
      this.label.destroy()
      this.label = null
    }
    if (this.text != '') {
      this.label = this.scene.add.text(this.textOffsetX, this.textOffsetY, this.text, this.textStyle).setOrigin(this.textAlign === 'left' ? 0.0 : (this.textAlign === 'right' ? 1.0 : 0.5), 0.5)
      this.displayContainer.add(this.label)
    }
  }

  setGauge(gauge) {
    this.gauge = gauge
    if (this.graphicsGauge) {
      const gaugeColor = typeof this.gaugeColor === 'function' ? this.gaugeColor(this.gauge) : this.gaugeColor
      this.graphicsGauge.clear()
      this.graphicsGauge.fillStyle(gaugeColor, this.gaugeAlpha)
      this.graphicsGauge.fillRoundedRect(-this._width / 2, -this._height / 2, this._width, this._height, this._roundWidth)
      this.graphicsGauge.setMask(this._mask)
    }
  }

}
