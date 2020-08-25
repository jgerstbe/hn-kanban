import { Component, Input } from '@angular/core';
import { HnItem } from 'src/app/api/hnItem';
import { foregoneTime } from 'src/app/utils';

@Component({
  selector: 'app-card-simple',
  templateUrl: './card-simple.component.html',
  styleUrls: ['./card-simple.component.scss']
})
export class CardSimpleComponent {
  @Input('item') item: HnItem;
  foregoneTime = foregoneTime;

  constructor() { }

}
