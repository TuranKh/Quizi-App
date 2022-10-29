import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { InformationBarComponent } from './information-bar.component';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';




@NgModule({
  declarations: [InformationBarComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatSliderModule,
    BrowserAnimationsModule
  ]
})
export class InformationBarModule { }
