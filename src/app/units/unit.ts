import { Scene } from '../shared/scene'

export class Unit extends Phaser.GameObjects.Container {

  private _scene: Scene = null
  public get scene() {
    return this._scene
  }
  public pointerDowned: boolean = false
  public zone?: Phaser.GameObjects.Zone = null

  protected constructor(scene: Scene, config) {
    super(scene)

    this._scene = scene
    const x = config.x || 0
    const y = config.y || 0

    this.setPosition(x, y)
  }

  destroy() {
    this.scene.removeUnit(this)
    super.destroy()
  }

  update(time, delta) {
  }

  pointerover(pointer) {
  }

  pointerout(pointer) {
  }

  pointerdown(pointer) {
  }

  pointerup(pointer) {
  }

  pointermove(pointer) {
  }

  click() {
  }
}