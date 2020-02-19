import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssessmentListComponent } from './assessments/assessment-list/assessment-list.component';
import { CreateAssessmentComponent} from './assessments/create-assessment/create-assessment.component';
import { EditAssessmentComponent } from './assessments/edit-assessment/edit-assessment.component';
import { ViewAssessmentComponent } from './assessments/view-assessment/view-assessment.component';
import { CreateQuestionComponent } from './questions/question/create-question/create-question.component';
import { EditQuestionComponent } from './questions/question/edit-question/edit-question.component';
import { ListQuestionsComponent } from './questions/question/list-questions/list-questions.component';
import { ViewQuestionComponent } from './questions/question/view-question/view-question.component';
import { CreateCheckboxComponent } from './questions/questionTypes/check-box/create-checkbox/create-checkbox.component';
import { EditCheckboxComponent } from './questions/questionTypes/check-box/edit-checkbox/edit-checkbox.component';
import { ListCheckboxComponent } from './questions/questionTypes/check-box/list-checkbox/list-checkbox.component';
import { ViewCheckboxComponent } from './questions/questionTypes/check-box/view-checkbox/view-checkbox.component';
import { CreateEssayComponent } from './questions/questionTypes/essay/create-essay/create-essay.component';
import { EditEssayComponent } from './questions/questionTypes/essay/edit-essay/edit-essay.component';
import { ListEssayComponent } from './questions/questionTypes/essay/list-essay/list-essay.component';
import { ViewEssayComponent } from './questions/questionTypes/essay/view-essay/view-essay.component';
// tslint:disable-next-line: max-line-length
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

// Path naming convention: item/action ie: assessment/create
const routes: Routes = [
  { path: '', component: AssessmentListComponent },
  { path: 'assessment/create', component: CreateAssessmentComponent },
  { path: 'assessment/edit', component: EditAssessmentComponent },
  { path: 'assessment/view', component: ViewAssessmentComponent },
  { path: 'checkbox/create', component: CreateCheckboxComponent },
  { path: 'checkbox/edit', component: EditCheckboxComponent },
  { path: 'checkbox/list', component: ListCheckboxComponent },
  { path: 'checkbox/view', component: ViewCheckboxComponent },
  { path: 'essay/create', component: CreateEssayComponent },
  { path: 'essay/edit', component: EditEssayComponent },
  { path: 'essay/list', component: ListEssayComponent },
  { path: 'essay/view', component: ViewEssayComponent },
  { path: 'multiple-choice/create', component: CreateMultipleChoiceComponent },
  { path: 'multiple-choice/edit', component: EditMultipleChoiceComponent },
  { path: 'multiple-choice/list', component: ListMultipleChoiceComponent },
  { path: 'multiple-choice/view', component: ViewMultipleChoiceComponent },
  { path: 'question/create', component: CreateQuestionComponent },
  { path: 'question/edit', component: EditQuestionComponent },
  { path: 'questions/list', component: ListQuestionsComponent },
  { path: 'question/view', component: ViewQuestionComponent },
  { path: 'true-false/create', component: CreateTrueFalseComponent },
  { path: 'true-false/edit', component: EditTrueFalseComponent },
  { path: 'true-false/list', component: ListTrueFalseComponent },
  { path: 'true-false/view', component: ViewTrueFalseComponent },
  { path: 'upload/create', component: CreateUploadComponent },
  { path: 'upload/edit', component: EditUploadComponent },
  { path: 'upload/list', component: ListUploadComponent },
  { path: 'upload/view', component: ViewUploadComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
