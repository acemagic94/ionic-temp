import { Injectable } from '@angular/core'
import { Button, Label } from '../elements'
import { Scene } from '../shared/scene'
import { frameColor } from '../shared/theme'

const TAB_ROUND = 16
const menuTextStyle = { fontFamily: 'BMJUA', fontSize: 60, color: '#4F2D16' }

@Injectable()
export class MainmenuScene extends Scene {

  title: Label = null
  menuPanel: Phaser.GameObjects.Container

  constructor() {
    super({ key: 'Mainmenu' })
  }

  preload() {
    this.cameras.main.setBackgroundColor('#ffd56d')
    // this.load.pack('help-pack', 'assets/json/pack-help.json')
  }

  preCreate(data) {

    const disableStartEffect = data.noTransition

    this.title = this.addElement(Label, {
      x: 0, y: 400, width: 715, height: 143,
      noBackground: true,
      icon: 'ui.banner.skyblue',
      iconOffsetY: 14,
      text: 'HELP',
      textStyle: { fontFamily: 'BMJUA', fontSize: 80, color: '#4F2D16' }
    })

    this.centerTopContainer.add(this.title)
    this.centerCenterContainer.add(this.menuHelp())

  }

  menuHelp() {

    this.title.setText('Minigame')

    if (this.menuPanel) { this.menuPanel.destroy() }

    // Frame
    // @ts-ignore
    const frame = this.rexUI.add.roundRectangle(0, 80, 820, 900,
      { tl: TAB_ROUND, tr: TAB_ROUND, bl: TAB_ROUND, br: TAB_ROUND },
      0xaed5f1).setStrokeStyle(5, 0x4f2d16, 1).setOrigin(0.5)

    // Buttons
    const buttonAlba = this.addElement(Button, {
      backgroundColor: 0x000000, frameColor, frameWidth: 5, roundWidth: 16,
      x: 0,
      y: -288 + 126,
      width: 656,
      height: 126,
      text: 'Reference',
      textStyle: menuTextStyle,
      delay: 0,
      click: () => {
        console.log('buttonAlba clicked')
        this.centerCenterContainer.add(this.menuAlba())
      }
    })
    const buttonBear = this.addElement(Button, {
      backgroundColor: 0x000000, frameColor, frameWidth: 5, roundWidth: 16,
      x: 0,
      y: -138 + 126,
      width: 656,
      height: 126,
      text: 'Game Type A',
      textStyle: menuTextStyle,
      delay: 0,
      click: () => {
        console.log('buttonDaily clicked')
        this.centerCenterContainer.add(this.menuBear())
      }
    })
    const buttonPet = this.addElement(Button, {
      backgroundColor: 0x000000, frameColor, frameWidth: 5, roundWidth: 16,
      x: 0,
      y: -138 + 126 + 150,
      width: 656,
      height: 126,
      text: 'Game Type B',
      textStyle: menuTextStyle,
      delay: 0,
      click: () => {
        console.log('buttonDaily clicked')
        this.centerCenterContainer.add(this.menuPet())
      }
    })

    this.menuPanel = this.add.container(0, 0, [frame, buttonAlba, buttonBear, buttonPet])
    return this.menuPanel
  }

  menuAlba() {

    if (this.menuPanel) { this.menuPanel.destroy() }
    this.title.setText('Ref')

    // Frame
    // @ts-ignore
    const frame = this.rexUI.add.roundRectangle(0, 200, 820, 1200,
      { tl: TAB_ROUND, tr: TAB_ROUND, bl: TAB_ROUND, br: TAB_ROUND },
      0xaed5f1).setStrokeStyle(5, 0x4f2d16, 1).setOrigin(0.5)

    const albaList = [ 'Burger', 'Corndog', 'Skincare', 'Olddream', 'Oldseek-Yard', 'Oldseek-Park', 'Brush', 'Bath'] // mma

    this.menuPanel = this.add.container(0, 0, [frame])
    // Loop처리해서 Burger, Corndog, Fries, Mart, Skincare, Sushi 연결
    for ( let n = 0; n < albaList.length; n++ ) {
      const buttonAlba = this.addElement(Button, {
        backgroundColor: 0x000000, frameColor, frameWidth: 5, roundWidth: 16,
        x: 0,
        y: -250 + n * 120,
        width: 656,
        height: 100,
        text: albaList[n],
        textStyle: menuTextStyle,
        delay: 0,
        click: () => {
          console.log('button <name> clicked')
          let place
          if (albaList[n].includes('seek')) {
            n === 4 ? place = 'Yard' : place = 'Park'
            console.log('Seek:', place)
            this.transition('Oldseek', { place })
            // this.transition('Seek')
          } else {
            this.transition(albaList[n])
          }
        }
      })
      this.menuPanel.add(buttonAlba)
    }
    return this.menuPanel


  }

  menuBear() {
    if (this.menuPanel) { this.menuPanel.destroy() }
    this.title.setText('Game Type A')

    // Frame
    // @ts-ignore
    const frame = this.rexUI.add.roundRectangle(0, 200, 820, 1200,
      { tl: TAB_ROUND, tr: TAB_ROUND, bl: TAB_ROUND, br: TAB_ROUND },
      0xaed5f1).setStrokeStyle(5, 0x4f2d16, 1).setOrigin(0.5)

    const dailyList = [ 'Fishing', 'Recycle', 'Dream', 'Shine', 'Toilet', 'Seek-Yard', 'Seek-Park']

    this.menuPanel  = this.add.container(0, 0, [frame])
    for ( let n = 0; n < dailyList.length; n++ ) {
      const buttonDaily = this.addElement(Button, {
        backgroundColor: 0x000000, frameColor, frameWidth: 5, roundWidth: 16,
        x: 0,
        y: -290 + n * 140,
        width: 656,
        height: 126,
        text: dailyList[n],
        textStyle: menuTextStyle,
        delay: 0,
        click: () => {
          console.log(`button ${dailyList[n]} clicked`)

          if (dailyList[n].includes('Seek')) {
            let place: string
            let daynight: string
            n === 5 ? place = 'yard' : place = 'park'
            n === 5 ? daynight = 'day' : daynight = 'night'
            console.log('Seek', place, daynight)
            this.transition('Seek', { place, daynight })
            // this.transition('Seek')
          } else {
            this.transition(dailyList[n])
          }
        }
      })
      this.menuPanel.add(buttonDaily)
    }
    return this.menuPanel
  }

  menuPet() {
    if (this.menuPanel) { this.menuPanel.destroy() }
    this.title.setText('Game Type B')

    // Frame
    // @ts-ignore
    const frame = this.rexUI.add.roundRectangle(0, 200, 820, 1200,
      { tl: TAB_ROUND, tr: TAB_ROUND, bl: TAB_ROUND, br: TAB_ROUND },
      0xaed5f1).setStrokeStyle(5, 0x4f2d16, 1).setOrigin(0.5)

    const dailyList = [ 'Catjump', 'Hair', 'Whac', 'Town', 'Cattower' ]

    this.menuPanel  = this.add.container(0, 0, [frame])
    for ( let n = 0; n < dailyList.length; n++ ) {
      const buttonDaily = this.addElement(Button, {
        backgroundColor: 0x000000, frameColor, frameWidth: 5, roundWidth: 16,
        x: 0,
        y: -290 + n * 140,
        width: 656,
        height: 126,
        text: dailyList[n],
        textStyle: menuTextStyle,
        delay: 0,
        click: () => {
          console.log(`button ${dailyList[n]} clicked`)
          this.transition(dailyList[n])
        }
      })
      this.menuPanel.add(buttonDaily)
    }
    return this.menuPanel
  }


}
