import { Component, HostListener,  OnInit, ViewChild } from "@angular/core";
import { MatDrawer } from "@angular/material/sidenav";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  hasBackdrop: boolean = false;
  drawserMode: 'side' | 'over' | 'push' = 'push';
  @ViewChild('drawer') drawer: MatDrawer;
  drawerSource: SafeUrl;
  drawerIsOpen: boolean = false;

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
      if (event.keyCode === 27) {
        if (this.drawerIsOpen) {
          this.closeDrawer();
        }
      }
  }

  onIframeError(e:any) {
    console.error(e);
  }

  openInDrawer(url: string) {
    console.log('openInDrawer', url);
    this.drawerSource = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.drawer.open();
    this.drawerIsOpen = true;
  }

  closeDrawer() {
    delete this.drawerSource;
    this.drawer.close();
    this.drawerIsOpen = false;
  }

}
