import { Element } from '../elements/element'
import { Unit } from '../units/unit'
import { Utils } from './utils'

export class Scene extends Phaser.Scene {

  public viewBounds: Phaser.Geom.Rectangle
  public groundBounds: Phaser.Geom.Rectangle
  public backgroundContainer: Phaser.GameObjects.Container
  public playgroundContainer: Phaser.GameObjects.Container
  public viewContainer: Phaser.GameObjects.Container
  public leftTopContainer: Phaser.GameObjects.Container
  public leftCenterContainer: Phaser.GameObjects.Container
  public leftBottomContainer: Phaser.GameObjects.Container
  public centerTopContainer: Phaser.GameObjects.Container
  public centerCenterContainer: Phaser.GameObjects.Container
  public centerBottomContainer: Phaser.GameObjects.Container
  public rightTopContainer: Phaser.GameObjects.Container
  public rightCenterContainer: Phaser.GameObjects.Container
  public rightBottomContainer: Phaser.GameObjects.Container
  private msgs: any[] = []
  private elements: Element[] = []
  private units: Unit[] = []

  constructor(config) {
    super(config)
  }

  setup(config: any = {}) {
    return this
  }

  create(data: any) {
    this.cameras.main.setAlpha(1)
    this.viewBounds = Utils.getViewBounds(this.scale)
    this.groundBounds = Utils.getGroundBounds(this.viewBounds)
    this.backgroundContainer = this.add.container(this.viewBounds.centerX, 0)
    this.playgroundContainer = this.add.container(this.viewBounds.centerX, 0)
    this.viewContainer = this.add.container(0, 0)
    this.leftTopContainer = this.add.container(this.viewBounds.left, this.viewBounds.top).setDepth(5)
    this.leftCenterContainer = this.add.container(this.viewBounds.left, this.viewBounds.centerY).setDepth(4)
    this.leftBottomContainer = this.add.container(this.viewBounds.left, this.viewBounds.bottom).setDepth(6)
    this.centerTopContainer = this.add.container(this.viewBounds.centerX, this.viewBounds.top).setDepth(2)
    this.centerCenterContainer = this.add.container(this.viewBounds.centerX, this.viewBounds.centerY).setDepth(1)
    this.centerBottomContainer = this.add.container(this.viewBounds.centerX, this.viewBounds.bottom).setDepth(3)
    this.rightTopContainer = this.add.container(this.viewBounds.right, this.viewBounds.top).setDepth(5)
    this.rightCenterContainer = this.add.container(this.viewBounds.right, this.viewBounds.centerY).setDepth(4)
    this.rightBottomContainer = this.add.container(this.viewBounds.right, this.viewBounds.bottom).setDepth(6)
    this.elements = []
    this.units = []

    this.input.on('pointerover', this.pointerover, this)
    this.input.on('pointerout', this.pointerout, this)
    this.input.on('pointerup', this.pointerup, this)
    this.input.on('pointerdown', this.pointerdown, this)
    this.input.on('pointermove', this.pointermove, this)

    this.events.on('transitioncomplete', this.transitioncomplete, this)
    this.events.on('transitionout', this.transitionout, this)

    this.preCreate(data)
    if (data && data.noTransition) {
      this.postCreate(data)
    }
  }

  resize(viewBounds) {
    this.leftTopContainer.setPosition(viewBounds.left, viewBounds.top)
    this.leftCenterContainer.setPosition(viewBounds.left, viewBounds.centerY)
    this.leftBottomContainer.setPosition(viewBounds.left, viewBounds.bottom)
    this.centerTopContainer.setPosition(viewBounds.centerX, viewBounds.top)
    this.centerBottomContainer.setPosition(viewBounds.centerX, viewBounds.bottom)
    this.rightTopContainer.setPosition(viewBounds.right, viewBounds.top)
    this.rightCenterContainer.setPosition(viewBounds.right, viewBounds.centerY)
    this.rightBottomContainer.setPosition(viewBounds.right, viewBounds.bottom)
  }

  update(time, delta) {
    for (const unit of this.units) {
      unit.update(time, delta)
    }
    for (const element of this.elements) {
      element.update(time, delta)
    }
    if (this.msgs.length > 0) {
      const { msg, params } = this.msgs.shift()
      this.receive(msg, params)
    }
  }

  pointerover(pointer, targets) {
    for (const target of targets) {
      const element = this.elements.find(element => element.zone == target)
      if (element) {
        element.pointerover(pointer)
      } else {
        const unit = this.units.find(unit => unit.zone == target)
        if (unit) {
          unit.pointerover(pointer)
        }
      }
    }
  }

  pointerout(pointer, targets) {
    for (const target of targets) {
      const element = this.elements.find(element => element.zone == target)
      if (element) {
        element.pointerout(pointer)
      } else {
        const unit = this.units.find(unit => unit.zone == target)
        if (unit) {
          unit.pointerout(pointer)
        }
      }
    }
  }

  pointerdown(pointer, targets) {
    for (const target of targets) {
      const element = this.elements.find(element => element.zone == target)
      if (element) {
        element.pointerDowned = true
        element.pointerdown(pointer)
      } else {
        const unit = this.units.find(unit => unit.zone == target)
        if (unit) {
          unit.pointerDowned = true
          unit.pointerdown(pointer)
        }
      }
    }
  }

  pointerup(pointer, targets) {
    let processed = false
    for (const element of this.elements.filter(element => element.pointerDowned)) {
      element.pointerup(pointer)
      element.pointerDowned = false
      if (!element.disable && element.click && targets.some(target => target == element.zone)) {
        element.click(element)
        processed = true
      }
    }
    for (const unit of this.units.filter(unit => unit.pointerDowned)) {
      unit.pointerup(pointer)
      unit.pointerDowned = false
      if (!processed && targets.some(target => target == unit.zone)) {
        unit.click()
      }
    }
  }

  pointermove(pointer) {
    for (const unit of this.units.filter(unit => unit.pointerDowned)) {
      unit.pointermove(pointer)
    }
  }

  start(target: string, data: any = {}) {
    for (const unit of this.units) {
      unit.setVisible(false)
    }
    this.units = []
    this.elements = []
    data.noTransition = true
    data.from = this.scene.key
    this.scene.start(target, data)
  }

  transition(target: string, data: any = {}, duration: number = 500) {
    for (const unit of this.units) {
      unit.setVisible(false)
    }
    this.units = []
    this.elements = []
    data.from = this.scene.key

    if ( target === 'Mainmenu') {
      this.scene.stop()
    }
    // duration = 1 // changed for developing. paul.
    this.scene.transition({
      target,
      duration,
      moveBelow: true,
      data,
      onUpdate: progress => this.cameras.main.setAlpha(1.0 - progress)
    })
  }

  preCreate(data: any) {
  }

  postCreate(data: any) {
  }

  transitioncomplete() {
    this.postCreate({ noTransition: false })
  }

  transitionout() {
  }

  addElement<T extends Element>(t: new (scene: Scene, config: any) => T, config: any = {}): T {
    const element = new t(this, config)
    this.elements.push(element)
    return element
  }

  removeElement(element: Element) {
    const p = this.elements.indexOf(element)
    if (p >= 0) {
      this.units.splice(p, 1)
    }
  }

  addUnit<T extends Unit>(t: new (scene: Scene, config: any) => T, config: any = {}): T {
    const unit = new t(this, config)
    this.units.push(unit)
    return unit
  }

  removeUnit(unit: Unit) {
    const p = this.units.indexOf(unit)
    if (p >= 0) {
      this.units.splice(p, 1)
    }
  }

  send(msg: string, params: any = {}) {
    this.msgs.push({ msg, params })
  }

  receive(msg: string, params: any) {
  }


}
