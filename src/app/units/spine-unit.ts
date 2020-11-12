import { Scene } from '../shared/scene';
import { Utils } from '../shared/utils';
import { Unit } from './unit';

interface QueuedAnimation {
  animation: string,
  callback: () => void
}

export class SpineUnit extends Unit {

  public spine: any = null
  public animationDurations: any = {}
  public defaultAnimation = ''
  public animationQueue: QueuedAnimation[] = []
  public mixtime

  public get currentAnimation() {
    if (this.animationQueue.length === 0) {
      return this.defaultAnimation
    }
    return this.animationQueue[0].animation
  }
  public leftAnimationDuration = 0.0

  public constructor(scene: Scene, config: any) {
    super(scene, config)

    const spine = config.spine || ''
    this.defaultAnimation = config.animation || 'default'
    const skin = config.skin || 'default'
    const scale = config.scale || 1.0
    const loop = config.loop && true
    const speed = config.speed || 1.0
    // const mixtime = config.mixtime || 0.1
    this.mixtime = 0.1
    if (config.mixtime !== this.mixtime) { this.mixtime = config.mixtime }
    console.log('config.mixtime', config.mixtime, this.mixtime)
    console.log('config.speed', config.speed, speed)

    if (loop === false) { console.log(config.animation, 'loop status:', loop) }
    if (scale !== 1) { console.log(skin, 'Spine Scale', scale) }

    // @ts-ignore
    this.spine = scene.add.spine(0, 0, spine, this.defaultAnimation, loop)
    this.setSkin(skin)
    for (const animation of this.spine.skeletonData.animations) {
      this.animationDurations[animation.name] = animation.duration * (1000.0 / speed)
      for (const animation2 of this.spine.skeletonData.animations) {
        this.spine.setMix(animation.name, animation2.name, this.mixtime)
      }
    }
    // this.spine.drawDebug = true
    this.spine.setScale(scale)
    // this.spine.state.animationSpeed = speed
    this.add(this.spine)

    // console.log(this.spine)
    const spineViewBounds = Utils.getSpineViewBounds(this.spine)
    this.zone = scene.add.zone(spineViewBounds.left + spineViewBounds.width / 2, spineViewBounds.top + spineViewBounds.height / 2, spineViewBounds.width, spineViewBounds.height)
    this.zone.setInteractive()
    this.add(this.zone)

    if (this.spine.drawDebug) {
      const graphics = scene.add.graphics()
      graphics.fillStyle(0x000000, 0.3)
      graphics.fillRect(spineViewBounds.left, spineViewBounds.top, spineViewBounds.width, spineViewBounds.height)
      this.add(graphics)
    }

    scene.add.existing(this)
  }


  setMixtime(mixtime: number) {
    this.mixtime = mixtime
  }

  setSkin(skinName: string) {
    this.spine.setSkin(null)
    this.spine.setSkinByName(skinName)
  }

  setAnimationSpeed(speed: number) {
    this.spine.state.animationSpeed = speed;
  }


  setAttachment(slot: string, attachment: string) {
    this.spine.skeleton.setAttachment(slot, attachment)
  }

  setDefaultAnimation(animation: string, loop = true) {
    if (this.defaultAnimation != animation) {
      this.defaultAnimation = animation
      if ((this.animationQueue.length === 0) && (loop === true)) {
        this.spine.play(animation, true)
      }
    }
  }

  pushAnimation(animation: string, callback: () => void = null) {
    this.animationQueue.push({ animation, callback })
    if (this.animationQueue.length === 1) {
      this.spine.play(animation, false)
      this.leftAnimationDuration = this.animationDurations[animation]
    }
  }

  clearAnimation() {
    this.spine.play(this.defaultAnimation, true)
    this.animationQueue = []
    this.leftAnimationDuration = 0.0
  }

  getBone(name: string): any {
    return this.spine.findBone(name)
  }

  getBoneWorldPosition(name: string): Phaser.Geom.Point {
    const bone = this.getBone(name)
    if (!bone) {
      return new Phaser.Geom.Point(this.x, this.y)
    }
    const matrix = this.spine.getLocalTransformMatrix()
    const worldPosition = matrix.translate(bone.worldX, -bone.worldY)
    return new Phaser.Geom.Point(worldPosition.tx, worldPosition.ty)
  }

  update(time, delta) {
    if (this.animationQueue.length > 0) {
      this.leftAnimationDuration -= delta
      if (this.leftAnimationDuration <= 0.0) {
        // console.log('animationQueue:', this.animationQueue)
        const queuedAnimation = this.animationQueue.shift()
        if (queuedAnimation.callback) {
          console.log('callback', queuedAnimation.animation)
          queuedAnimation.callback()
        }
        // console.log('animationQueue:', this.animationQueue)
        if (this.animationQueue.length > 0) {
          const animation = this.animationQueue[0].animation
          this.spine.play(animation, false)
          this.leftAnimationDuration = this.animationDurations[animation]
        } else {
          this.spine.play(this.defaultAnimation, true)
          this.leftAnimationDuration = 0
        }
      }
    }
  }

}
