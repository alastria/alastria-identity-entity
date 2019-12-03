import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// COMPONENTS
import { HomeComponent } from 'src/app/components/pages/home/home.component';
import { DisabledFormComponent } from 'src/app/components/common/disabled-form/disabled-form.component';

@NgModule({
  declarations: [
    HomeComponent,
    DisabledFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class HomeModule { }
