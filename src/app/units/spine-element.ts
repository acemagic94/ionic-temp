import { Scene } from '../shared/scene'
import { SpineUnit } from './spine-unit'

export class SpineElement extends SpineUnit {

  public constructor(scene: Scene, config: any) {
    super(scene, config)
  }

  removeElement(ar, e) {
    const p = ar.indexOf(e)
    if (p >= 0) {
      ar.splice(p, 1)
    }
  }

  pointerdown(pointer) {
    this.scene.send('SPINE_CLICKED', this.currentAnimation)
  }

  pointermove(pointer) {
  }

  pointerup() {
  }

}
