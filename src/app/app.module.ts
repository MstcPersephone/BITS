import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';

import { AssessmentListComponent } from './assessments/assessment-list/assessment-list.component';
import { CreateAssessmentComponent } from './assessments/create-assessment/create-assessment.component';
import { ViewAssessmentComponent } from './assessments/view-assessment/view-assessment.component';
import { EditAssessmentComponent } from './assessments/edit-assessment/edit-assessment.component';

import { AssessmentService } from './services/assessment.service';
import { AttachmentService } from './services/attachment.service';
import { QuestionService } from './services/question.service';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';

import { ListQuestionsComponent } from './questions/list-questions/list-questions.component';
import { CreateQuestionComponent } from './questions/create-question/create-question.component';
import { ViewQuestionComponent } from './questions/view-question/view-question.component';
import { EditQuestionComponent } from './questions/edit-question/edit-question.component';

import { MultipleChoiceComponent } from './questions/questionTypes/multiple-choice/multiple-choice.component';
import { TrueFalseComponent } from './questions/questionTypes/true-false/true-false.component';
import { EssayComponent } from './questions/questionTypes/essay/essay.component';
import { UploadComponent } from './questions/questionTypes/upload/upload.component';
import { CheckBoxComponent } from './questions/questionTypes/check-box/check-box.component';

@NgModule({
  declarations: [
    AppComponent,
    AssessmentListComponent,
    CreateAssessmentComponent,
    ViewAssessmentComponent,
    EditAssessmentComponent,
    HeaderComponent,
    ListQuestionsComponent,
    CreateQuestionComponent,
    ViewQuestionComponent,
    EditQuestionComponent,
    MultipleChoiceComponent,
    TrueFalseComponent,
    EssayComponent,
    UploadComponent,
    CheckBoxComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    AssessmentService,
    AttachmentService,
    QuestionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
