import { Component, Input } from '@angular/core';
import { HnItem } from 'src/app/api/hnItem';
import { foregoneTime } from '../../utils';

@Component({
  selector: 'app-card-material',
  templateUrl: './card-material.component.html',
  styleUrls: ['./card-material.component.scss']
})
export class CardMaterialComponent {
  @Input('item') item: HnItem;
  foregoneTime = foregoneTime;
   
  constructor() { }

}
