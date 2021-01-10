import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { HnItem } from 'src/app/api/hnItem';
import { foregoneTime } from '../../utils';

@Component({
  selector: 'app-card-material',
  templateUrl: './card-material.component.html',
  styleUrls: ['./card-material.component.scss']
})
export class CardMaterialComponent {
  @Input('clickHandler') clickHandler: Subject<any>; 
  @Input('item') item: HnItem;
  foregoneTime = foregoneTime;
   
  constructor() { }

  click(type: string, url: string) {
    console.log('CardMaterialComponent' ,this.clickHandler)
    console.log('click', type, url)
    this.clickHandler.next({
      type: type,
      url: url
    });
  }

}
