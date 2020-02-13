import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { AssessmentService } from './services/assessment.service';
import { AttachmentService } from './services/attachment.service';
import { QuestionService } from './services/question.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    AssessmentService,
    AttachmentService,
    QuestionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
