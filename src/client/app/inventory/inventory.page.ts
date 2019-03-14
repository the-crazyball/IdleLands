import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { GameService } from '../game.service';
import { IItem } from '../../../shared/interfaces';
import { InventoryItemPopover } from './item.popover';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {

  constructor(
    private popoverCtrl: PopoverController,
    public gameService: GameService
  ) { }

  ngOnInit() {
  }

  public async openItemMenu($event, item: IItem) {
    const popover = await this.popoverCtrl.create({
      component: InventoryItemPopover,
      componentProps: { item },
      event: $event,
      translucent: true
    });

    return await popover.present();
  }

}