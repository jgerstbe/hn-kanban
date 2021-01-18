import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

// libs
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatPaginatorModule } from '@angular/material/paginator';

// components
import { AppComponent } from "./app.component";
import { dragDropComponent } from "./dragDrop/dragDrop.component";
import { CardMaterialComponent } from './item/card-material/card-material.component';
import { CardSimpleComponent } from './item/card-simple/card-simple.component';

@NgModule({
  declarations: [AppComponent, dragDropComponent, CardMaterialComponent, CardSimpleComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DragDropModule,
    MatButtonModule,
    MatCardModule,
    MatSidenavModule,
    MatPaginatorModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
