import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PhaserModule } from 'phaser-component-library';

import { GamePage } from './game.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: GamePage
      }
    ]),
    PhaserModule
  ],
  declarations: [GamePage]
})
export class GamePageModule { }
