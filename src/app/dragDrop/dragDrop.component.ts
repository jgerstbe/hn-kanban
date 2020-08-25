import { Component, OnInit } from "@angular/core";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import { HnApiService } from "../api/hnapi.service";
import { HnItem } from "../api/hnItem";

/**
 * @title Drag&Drop connected sorting
 */
@Component({
  selector: "dragDrop",
  templateUrl: "dragDrop.component.html",
  styleUrls: ["dragDrop.component.scss"]
})
export class dragDropComponent implements OnInit {
  newsItems: HnItem[] = [];
  topItems: HnItem[] = [];
  readLaterItems: HnItem[] = [];
  watchItems: HnItem[] = [];

  constructor(private hnApi: HnApiService) {}

  ngOnInit() {
    this.hnApi.getStoryItems("newstories.json").subscribe((data: HnItem[]) => {
      this.newsItems = data.filter((e) => e !== null);
    });
    this.hnApi.getStoryItems("topstories.json").subscribe((data: HnItem[]) => {
      this.topItems = data.filter((e) => e !== null);
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  foregoneTime(time: number) {
    return "some time";
  }
}
