import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// Model
import { HnItem } from "./hnItem";
// Util
import { Observable, forkJoin, of } from "rxjs";
import { map, tap, switchMap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class HnApiService {
  baseUrl: string = `https://hacker-news.firebaseio.com/v0/`;
  items: any = {};

  constructor(private http: HttpClient) {
    this.loadFromLS();
  }

  getStoryItems(
    path: string,
    count: number = 30,
    offset: number = 0
  ): Observable<HnItem[]> {
    return this.http.get<number[]>(this.baseUrl + path).pipe(
      map((e) => e.slice(offset, offset+count)),
      switchMap((e) => {
        e = e.filter(item => item !== null);
        return forkJoin(e.map((itemId) => this.getItem(itemId)));
      }),
      tap((e) => {
        this.saveToLS(this.items)
      })
    );
  }

  getItem(id: number): Observable<HnItem> {
    if (this.items[id]) {
      return of(this.items[id]);
    } else {
      return this.http.get(this.baseUrl + `item/${id}.json`).pipe(
        map((e: any) => {
          if (e && e.url && typeof e.url === "string") {
            const url: URL = new URL(e.url);
            e.hostname = url.hostname.replace("www.", "");
          }
          this.items[id] = e;
          return e;
        })
      );
    }
  }

  saveToLS(items: any) {
    const data = {
      timestamp: new Date().toDateString(),
      items: this.items
    };
    localStorage.setItem('hn-kanban-data', JSON.stringify(data));
  }

  loadFromLS() {
    let data: any = localStorage.getItem('hn-kanban-data');
    if (data) {
      // TODO check if data is recent
      data = JSON.parse(data);
      this.items = data.items;
    }
  }

}
