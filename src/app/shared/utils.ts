export class Utils {
  static getViewBounds(scale: Phaser.Scale.ScaleManager): Phaser.Geom.Rectangle {
    const viewX = scale.canvasBounds.left < 0 ? -scale.canvasBounds.left * scale.width / scale.canvasBounds.width : 0
    const viewY = scale.canvasBounds.top < 0 ? -scale.canvasBounds.top * scale.height / scale.canvasBounds.height : 0
    return new Phaser.Geom.Rectangle(viewX, viewY, scale.width - viewX * 2, scale.height - viewY * 2)
  }

  static getGroundBounds(viewBounds: Phaser.Geom.Rectangle) {
    return new Phaser.Geom.Rectangle(-viewBounds.width / 2, viewBounds.top, viewBounds.width, viewBounds.height)
  }

  static getSpineViewBounds(spine): Phaser.Geom.Rectangle {
    const spineBounds = spine.getBounds()
    spineBounds.offset.x *= spine.scaleX
    spineBounds.offset.y *= spine.scaleY
    spineBounds.size.x *= spine.scaleX
    spineBounds.size.y *= spine.scaleY
    return new Phaser.Geom.Rectangle(spineBounds.offset.x, -spineBounds.offset.y - spineBounds.size.y, spineBounds.size.x, spineBounds.size.y)
  }


}
