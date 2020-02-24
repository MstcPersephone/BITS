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
import { HelperService } from './services/helper.service';

import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';

import { ListQuestionsComponent } from './questions/question/list-questions/list-questions.component';
import { CreateQuestionComponent } from './questions/question/create-question/create-question.component';
import { ViewQuestionComponent } from './questions/question/view-question/view-question.component';
import { EditQuestionComponent } from './questions/question/edit-question/edit-question.component';

import { CreateCheckboxComponent } from './questions/questionTypes/check-box/create-checkbox/create-checkbox.component';
import { EditCheckboxComponent } from './questions/questionTypes/check-box/edit-checkbox/edit-checkbox.component';
import { ListCheckboxComponent } from './questions/questionTypes/check-box/list-checkbox/list-checkbox.component';
import { ViewCheckboxComponent } from './questions/questionTypes/check-box/view-checkbox/view-checkbox.component';

import { CreateShortAnswerComponent } from './questions/questionTypes/short-answer/create-short-answer/create-short-answer.component';
import { EditShortAnswerComponent } from './questions/questionTypes/short-answer/edit-short-answer/edit-short-answer.component';
import { ListShortAnswerComponent } from './questions/questionTypes/short-answer/list-short-answer/list-short-answer.component';
import { ViewShortAnswerComponent } from './questions/questionTypes/short-answer/view-short-answer/view-short-answer.component';

// tslint:disable-next-line:max-line-length (The following line is 120+ characters and normally throws an error.)
import { CreateMultipleChoiceComponent } from './questions/questionTypes/multiple-choice/create-multiple-choice/create-multiple-choice.component';
import { EditMultipleChoiceComponent } from './questions/questionTypes/multiple-choice/edit-multiple-choice/edit-multiple-choice.component';
import { ListMultipleChoiceComponent } from './questions/questionTypes/multiple-choice/list-multiple-choice/list-multiple-choice.component';
import { ViewMultipleChoiceComponent } from './questions/questionTypes/multiple-choice/view-multiple-choice/view-multiple-choice.component';

import { CreateTrueFalseComponent } from './questions/questionTypes/true-false/create-true-false/create-true-false.component';
import { EditTrueFalseComponent } from './questions/questionTypes/true-false/edit-true-false/edit-true-false.component';
import { ListTrueFalseComponent } from './questions/questionTypes/true-false/list-true-false/list-true-false.component';
import { ViewTrueFalseComponent } from './questions/questionTypes/true-false/view-true-false/view-true-false.component';

import { CreateUploadComponent } from './questions/questionTypes/upload/create-upload/create-upload.component';
import { EditUploadComponent } from './questions/questionTypes/upload/edit-upload/edit-upload.component';
import { ListUploadComponent } from './questions/questionTypes/upload/list-upload/list-upload.component';
import { ViewUploadComponent } from './questions/questionTypes/upload/view-upload/view-upload.component';

import { CreateOptionComponent } from './shared/option/create-option/create-option.component';
import { EditOptionComponent } from './shared/option/edit-option/edit-option.component';
import { ListOptionComponent } from './shared/option/list-option/list-option.component';
import { ViewOptionComponent } from './shared/option/view-option/view-option.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CreateExactMatchComponent } from './exact-match/create-exact-match/create-exact-match.component';
import { EditExactMatchComponent } from './exact-match/edit-exact-match/edit-exact-match.component';
import { ListExactMatchComponent } from './exact-match/list-exact-match/list-exact-match.component';
import { ViewExactMatchComponent } from './exact-match/view-exact-match/view-exact-match.component';

import { CreateStudentComponent } from './student/create-student/create-student.component';
import { EditStudentComponent } from './student/edit-student/edit-student.component';
import { ListStudentComponent } from './student/list-student/list-student.component';
import { ViewStudentComponent } from './student/view-student/view-student.component';


@NgModule({
  declarations: [
    AppComponent,
    AssessmentListComponent,
    CreateAssessmentComponent,
    CreateCheckboxComponent,
    CreateExactMatchComponent,
    CreateMultipleChoiceComponent,
    CreateOptionComponent,
    CreateQuestionComponent,
    CreateShortAnswerComponent,
    CreateStudentComponent,
    CreateTrueFalseComponent,
    CreateUploadComponent,
    EditAssessmentComponent,
    EditCheckboxComponent,
    EditExactMatchComponent,
    EditMultipleChoiceComponent,
    EditOptionComponent,
    EditQuestionComponent,
    EditShortAnswerComponent,
    EditStudentComponent,
    EditTrueFalseComponent,
    EditUploadComponent,
    HeaderComponent,
    ListCheckboxComponent,
    ListExactMatchComponent,
    ListMultipleChoiceComponent,
    ListOptionComponent,
    ListQuestionsComponent,
    ListShortAnswerComponent,
    ListStudentComponent,
    ListTrueFalseComponent,
    ListUploadComponent,
    ViewAssessmentComponent,
    ViewCheckboxComponent,
    ViewExactMatchComponent,
    ViewMultipleChoiceComponent,
    ViewOptionComponent,
    ViewQuestionComponent,
    ViewShortAnswerComponent,
    ViewStudentComponent,
    ViewTrueFalseComponent,
    ViewUploadComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AssessmentService,
    AttachmentService,
    QuestionService,
    HelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
