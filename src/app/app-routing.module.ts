import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomepageComponent } from './homepage/homepage.component';

import { EditCategoryComponent } from './shared/category/edit-category/edit-category.component';

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

import { CreateStudentComponent } from './student/create-student/create-student.component';
import { EditStudentComponent } from './student/edit-student/edit-student.component';
import { ListStudentComponent } from './student/list-student/list-student.component';
import { ViewStudentComponent } from './student/view-student/view-student.component';
import { AssessmentEngineComponent } from '../app/assessment-engine/assessment-engine/assessment-engine.component';

import { LoginCreateComponent } from './login/login-create/login-create.component';
import { LoginViewComponent } from './login/login-view/login-view.component';

import { TakenAssessmentComponent } from './assessment-engine/taken-assessment/taken-assessment.component';


// Path naming convention: item/action ie: assessment/create
const routes: Routes = [
  { path: '', component: AssessmentListComponent },
  { path: 'assessment/create', component: CreateAssessmentComponent },
  { path: 'assessment/edit/:assessmentId', component: EditAssessmentComponent },
  { path: 'assessment/list', component: AssessmentListComponent },
  { path: 'assessment/view/:assessmentId', component: ViewAssessmentComponent },
  { path: 'assessment/take/:takenAssessmentId', component: AssessmentEngineComponent },
  { path: 'category', component: ManageCategoryComponent },
  { path: 'category/edit/:categoryId', component: EditCategoryComponent },
  { path: 'match/create', component: CreateExactMatchComponent },
  { path: 'option/create', component: CreateOptionComponent },
  { path: 'question/create', component: CreateQuestionComponent },
  { path: 'question/edit/:questionId', component: EditQuestionComponent },
  { path: 'question/list', component: ListQuestionsComponent },
  { path: 'question/view/:questionId', component: ViewQuestionComponent },
  { path: 'student/create', component: CreateStudentComponent },
  { path: 'student/edit', component: EditStudentComponent },
  { path: 'student/list', component: ListStudentComponent },
  { path: 'student/view', component: ViewStudentComponent },
  { path: 'home', component: HomepageComponent },
  { path: 'user/create', component: LoginCreateComponent},
  { path: 'login', component: LoginViewComponent},
  { path: 'assessment/generate', component: TakenAssessmentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
