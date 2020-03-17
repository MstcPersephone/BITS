import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssessmentListComponent } from './assessments/assessment/assessment-list/assessment-list.component';
import { CreateAssessmentComponent} from './assessments/assessment/create-assessment/create-assessment.component';
import { EditAssessmentComponent } from './assessments/assessment/edit-assessment/edit-assessment.component';
import { ViewAssessmentComponent } from './assessments/assessment/view-assessment/view-assessment.component';

import { CreateQuestionComponent } from './questions/question/create-question/create-question.component';
import { EditQuestionComponent } from './questions/question/edit-question/edit-question.component';
import { ListQuestionsComponent } from './questions/question/list-questions/list-questions.component';
import { ViewQuestionComponent } from './questions/question/view-question/view-question.component';

import { CreateOptionComponent } from './shared/option/create-option/create-option.component';
import { CreateExactMatchComponent } from './exact-match/create-exact-match/create-exact-match.component';
import { ManageCategoryComponent } from './shared/category/manage-category/manage-category.component';

import { ListCheckboxComponent } from './questions/questionTypes/check-box/list-checkbox/list-checkbox.component';
import { ListTrueFalseComponent } from './questions/questionTypes/true-false/list-true-false/list-true-false.component';
import { ListMultipleChoiceComponent } from './questions/questionTypes/multiple-choice/list-multiple-choice/list-multiple-choice.component';
import { ListShortAnswerComponent } from './questions/questionTypes/short-answer/list-short-answer/list-short-answer.component';

// Path naming convention: item/action ie: assessment/create
const routes: Routes = [
  { path: '', component: AssessmentListComponent },
  { path: 'assessment/create', component: CreateAssessmentComponent },
  { path: 'assessment/edit', component: EditAssessmentComponent },
  { path: 'assessment/view', component: ViewAssessmentComponent },
  { path: 'match/create', component: CreateExactMatchComponent },
  { path: 'option/create', component: CreateOptionComponent },
  { path: 'question/create', component: CreateQuestionComponent },
  { path: 'question/edit/:questionId', component: EditQuestionComponent },
  { path: 'question/list', component: ListQuestionsComponent },
  { path: 'question/checkbox/list', component: ListCheckboxComponent },
  { path: 'question/true-false/list', component: ListTrueFalseComponent },
  { path: 'question/multiple-choice/list', component: ListMultipleChoiceComponent },
  { path: 'question/short-answer/list', component: ListShortAnswerComponent },
  { path: 'question/view', component: ViewQuestionComponent },
  { path: 'category', component: ManageCategoryComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
