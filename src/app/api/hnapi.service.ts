import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
// Model
import { HnItem } from "./hnItem";
// Util
import { Observable, forkJoin } from "rxjs";
import { map, flatMap, switchMap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class HnApiService {
  baseUrl: string = `https://hacker-news.firebaseio.com/v0/`;

  constructor(private http: HttpClient) {}

  getStoryItems(path: string): Observable<HnItem[]> {
    return this.http.get(this.baseUrl + path).pipe(
      switchMap((e) => {
        return forkJoin(e.map((itemId) => this.getItem(itemId)));
      })
    );
  }

  getItem(id: number): Observable<any> {
    return this.http.get(this.baseUrl + `item/${id}.json`);
  }
}
