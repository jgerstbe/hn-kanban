import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// Model
import { HnItem } from "./hnItem";
// Util
import { Observable, forkJoin } from "rxjs";
import { map, switchMap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class HnApiService {
  baseUrl: string = `https://hacker-news.firebaseio.com/v0/`;

  constructor(private http: HttpClient) {}

  getStoryItems(
    path: string,
    count: number = 30,
    offset: number = 0
  ): Observable<HnItem[]> {
    return this.http.get(this.baseUrl + path).pipe(
      map((e) => e.slice(offset, count)),
      switchMap((e) => {
        return forkJoin(e.map((itemId) => this.getItem(itemId)));
      })
    );
  }

  getItem(id: number): Observable<any> {
    return this.http.get(this.baseUrl + `item/${id}.json`).pipe(
      map((e: any) => {
        if (e.url && typeof e.url === "string") {
          const url: URL = new URL(e.url);
          e.hostname = url.hostname.replace("www.", "");
        }
        return e;
      })
    );
  }
}
