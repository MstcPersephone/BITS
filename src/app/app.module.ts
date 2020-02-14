import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';

import { AssessmentListComponent } from './assessments/assessment-list/assessment-list.component';
import { CreateAssessmentComponent } from './assessments/create-assessment/create-assessment.component';
import { ViewAssessmentComponent } from './assessments/view-assessment/view-assessment.component';
import { EditAssessmentComponent } from './assessments/edit-assessment/edit-assessment.component';

import { AssessmentService } from './services/assessment.service';
import { AttachmentService } from './services/attachment.service';
import { QuestionService } from './services/question.service';

@NgModule({
  declarations: [
    AppComponent,
    AssessmentListComponent,
    CreateAssessmentComponent,
    ViewAssessmentComponent,
    EditAssessmentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [
    AssessmentService,
    AttachmentService,
    QuestionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
