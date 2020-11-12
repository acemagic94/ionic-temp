import { Scene } from '../shared/scene'
import { Element } from './element'

export class Label extends Element {

  textSlot: string = 'center'
  textOffsetX: number = 0
  textOffsetY: number = 0
  text: string = ''
  textStyle: any = {}
  textAlign: string = 'center'
  label: Phaser.GameObjects.Text = null

  constructor(scene: Scene, config: any) {
    super(scene, config)

    const icon = config.icon || ''
    const iconSlot = config.iconSlot || 'center'
    const iconOffsetX = config.iconOffsetX || 0
    const iconOffsetY = config.iconOffsetY || 0
    this.text = config.text || this.text
    this.textStyle = config.textStyle || this.textStyle
    this.textSlot = config.textSlot || 'center'
    this.textAlign = config.textAlign || this.textAlign
    this.textOffsetX = config.textOffsetX || this.textOffsetX
    this.textOffsetY = config.textOffsetY || this.textOffsetY

    if (icon !== '') {
      const iconX = iconSlot === 'left' ? -this._width / 2 : (iconSlot === 'right' ? this._width / 2 : 0)
      const image = scene.add.image(iconX + iconOffsetX, iconOffsetY, icon)
      this.displayContainer.add(image)
    }

    this.setText(this.text)

    this.start(config)
  }

  setText(text: string) {
    if (this.label) {
      this.label.destroy()
      this.label = null
    }
    this.text = text
    if (this.text !== '') {
      const textX = this.textSlot === 'left' ? -this._width / 2 : (this.textSlot === 'right' ? this._width / 2 : 0)
      this.label = this.scene.add.text(textX + this.textOffsetX, this.textOffsetY, this.text, this.textStyle).setOrigin(this.textAlign === 'left' ? 0.0 : (this.textAlign === 'right' ? 1.0 : 0.5), 0.5)
      this.displayContainer.add(this.label)
    }
  }

}