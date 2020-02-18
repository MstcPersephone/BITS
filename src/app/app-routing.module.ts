import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssessmentListComponent } from './assessments/assessment-list/assessment-list.component';
import { CreateAssessmentComponent} from './assessments/create-assessment/create-assessment.component';
import { EditAssessmentComponent } from './assessments/edit-assessment/edit-assessment.component';
import { ViewAssessmentComponent } from './assessments/view-assessment/view-assessment.component';
import { CreateQuestionComponent } from './questions/question/create-question/create-question.component';

const routes: Routes = [
  { path: '', component: AssessmentListComponent },
  { path: 'question/create', component: CreateQuestionComponent },
  { path: 'create-assessment', component: CreateAssessmentComponent },
  { path: 'edit-assessment', component: EditAssessmentComponent },
  { path: 'view-assessment', component: ViewAssessmentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
