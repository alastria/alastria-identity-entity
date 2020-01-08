import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// COMPONENTS
import { LinkUserComponent } from 'src/app/components/pages/link-user/link-user.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
  declarations: [
    LinkUserComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ]
})
export class LinkUserModule { }
