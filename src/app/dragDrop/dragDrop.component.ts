import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import { HnApiService } from "../api/hnapi.service";
import { HnItem } from "../api/hnItem";
import { Subject } from "rxjs";

/**
 * @title Drag&Drop connected sorting
 */
@Component({
  selector: "dragDrop",
  templateUrl: "dragDrop.component.html",
  styleUrls: ["dragDrop.component.scss"]
})
export class dragDropComponent implements OnInit {
  @Output('onOpenLink') onOpenLink: EventEmitter<string> = new EventEmitter();
  onClick: Subject<any> = new Subject();
  newItems: HnItem[] = [];
  topItems: HnItem[] = [];
  readLaterItems: HnItem[] = [];
  watchItems: HnItem[] = [];
  cardType: string = 'simple';

  constructor(private hnApi: HnApiService) {}

  ngOnInit() {
    this.hnApi.getStoryItems("newstories.json").subscribe((data: HnItem[]) => {
      this.newItems = data.filter((e) => e !== null);
    });
    this.hnApi.getStoryItems("topstories.json").subscribe((data: HnItem[]) => {
      this.topItems = data.filter((e) => e !== null);
    });
    this.loadList('hn-kanban-watching');
    this.loadList('hn-kanban-read-later');
    this.onClick.subscribe(data => {
      this.onOpenLink.emit(data.url);
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    const item: any = Object.assign({}, event.previousContainer.data[event.previousIndex]);
    const targetListId: number = Number(event.container.id.slice(-1));
    const startListId: number = Number(event.previousContainer.id.slice(-1));
    if (startListId === 2) {
      let list = [...event.previousContainer.data];
      const index = list.findIndex((e:any) => e.id === item.id);
      list.splice(index, 1);
      this.saveList('hn-kanban-watching', list);
    } else if (startListId === 3) {
      let list = [...event.previousContainer.data];
      const index = list.findIndex((e:any) => e.id === item.id);
      list.splice(index, 1);
      this.saveList('hn-kanban-read-later', list);

    } if (targetListId === 2) {
      this.saveList('hn-kanban-watching', [...event.container.data, item]);
    } else if (targetListId === 3) {
      this.saveList('hn-kanban-read-later', [...event.container.data, item]);
    }
    if (event.previousContainer === event.container) {
      // moveItemInArray(
      //   event.container.data,
      //   event.previousIndex,
      //   event.currentIndex
      // );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  onPageChange(offset: number, list: string) {
    this.hnApi.getStoryItems(list+'stories.json', 30, offset*30).subscribe((data: HnItem[]) => {
      if (list == 'top') {
        this.topItems = data.filter((e) => e !== null);
      } else if (list == 'new') {
        this.newItems = data.filter((e) => e !== null);
      }
    });
  }

  saveList(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  
  loadList(key: string) {
    const data = localStorage.getItem(key);
    if (data) {
      if (key === 'hn-kanban-read-later') {
        this.readLaterItems = JSON.parse(data);
      } else if (key === 'hn-kanban-watching') {
        this.watchItems = JSON.parse(data);
      }
    }
  }

}
