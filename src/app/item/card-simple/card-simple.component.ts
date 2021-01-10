import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { HnItem } from 'src/app/api/hnItem';
import { foregoneTime } from 'src/app/utils';

@Component({
  selector: 'app-card-simple',
  templateUrl: './card-simple.component.html',
  styleUrls: ['./card-simple.component.scss']
})
export class CardSimpleComponent {
  @Input('clickHandler') clickHandler: Subject<any>; 
  @Input('item') item: HnItem;
  foregoneTime = foregoneTime;

  constructor() { }

  click(type: string, url: string) {
    console.log('CardSimpleComponent', this.clickHandler)
    console.log('click', type, url)
    this.clickHandler.next({
      type: type,
      url: url
    });
  }

}
