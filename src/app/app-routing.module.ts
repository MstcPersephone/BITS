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
import { AuthGuard } from './login/auth-guard';
import { AdminGuard } from './login/admin-guard';


// Path naming convention: item/action ie: assessment/create
const routes: Routes = [
  { path: '', component: AssessmentListComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'assessment/create', component: CreateAssessmentComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'assessment/edit/:assessmentId', component: EditAssessmentComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'assessment/list', component: AssessmentListComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'assessment/view/:assessmentId', component: ViewAssessmentComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'assessment/take/:takenAssessmentId', component: AssessmentEngineComponent },
  { path: 'category', component: ManageCategoryComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'category/edit/:categoryId', component: EditCategoryComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'match/create', component: CreateExactMatchComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'option/create', component: CreateOptionComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'question/create', component: CreateQuestionComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'question/edit/:questionId', component: EditQuestionComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'question/list', component: ListQuestionsComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'question/view/:questionId', component: ViewQuestionComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'student/create', component: CreateStudentComponent, canActivate: [AuthGuard] },
  { path: 'student/edit', component: EditStudentComponent, canActivate: [AuthGuard] },
  { path: 'student/list', component: ListStudentComponent, canActivate: [AuthGuard] },
  { path: 'student/view', component: ViewStudentComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomepageComponent, canActivate: [AuthGuard] },
  { path: 'user/create', component: LoginCreateComponent, canActivate: [AuthGuard, AdminGuard]},
  { path: 'login', component: LoginViewComponent},
  { path: 'assessment/generate', component: TakenAssessmentComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule],
  providers: [AuthGuard, AdminGuard]
})
export class AppRoutingModule {}
