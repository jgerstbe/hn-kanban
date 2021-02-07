import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
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
  cloudUrl: string = 'https://jsonbase.com/9r6qBxdTMDQeei7RDkNiMRogR39DDzBYxjzjmiyn/'; 
  uuid: any;

  constructor(private http: HttpClient) {
    this.loadFromLS();
    this.loadFromCloud();
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
        this.saveToLS(this.items);
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

 makeSaveDump(items: any, uuid: string = this.uuid) {
  return {
    uuid: uuid,
    timestamp: new Date().toDateString(),
    items: items
  };
 }

  saveToLS(items: any) {
    const data = this.makeSaveDump(items);
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

  loadFromCloud() {
    if (!this.uuid) {
      // const savedUuid = localStorage.getItem("hn-kanban-uuid");
      // if (!savedUuid) {
      //   this.uuid = this.generateUID();
      //   localStorage.setItem("hn-kanban-uuid", this.uuid);
      // } else {
      //   this.uuid = savedUuid;
      // }
      return console.error('No cloud UUID set.');
    }
    // get data from api
    this.http.get(this.cloudUrl + this.uuid+'/', {headers: new HttpHeaders().set('content-type', 'application/json')}).subscribe(
      (data: any) => {
        console.log("LOAD", data);
      },
      error => {
        console.error("Could not load data.", error);
        this.loadFromLS();
      }
    );
  }

  saveToCloud(items: any) {
    if (!this.uuid) {
      const savedUuid = localStorage.getItem("hn-kanban-uuid");
      if (!savedUuid) {
        this.uuid = this.generateUID();
        localStorage.setItem("hn-kanban-uuid", this.uuid);
      } else {
        this.uuid = savedUuid;
      }
    }
    const data = this.makeSaveDump(items, this.uuid);
    // save to api
    this.http.put(this.cloudUrl+this.uuid+'/', data, {headers: new HttpHeaders().set('content-type', 'application/json')}).subscribe(
      (data: any) => {
        console.log("CREATE + SAVE", data);
      },
      error => console.error("Could not save data.", error)
    );
  }

  generateUID() {
    // I generate the UID from two parts here
    // to ensure the random number provide enough bits.
    let firstPart:any = (Math.random() * 46656) | 0;
    let secondPart:any = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
  }

}
