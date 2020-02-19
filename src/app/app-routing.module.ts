import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssessmentListComponent } from './assessments/assessment-list/assessment-list.component';
import { CreateAssessmentComponent} from './assessments/create-assessment/create-assessment.component';
import { EditAssessmentComponent } from './assessments/edit-assessment/edit-assessment.component';
import { ViewAssessmentComponent } from './assessments/view-assessment/view-assessment.component';
import { CreateQuestionComponent } from './questions/question/create-question/create-question.component';

// Path naming convention: item/action ie: assessment/create
const routes: Routes = [
  { path: '', component: AssessmentListComponent },
  { path: 'assessment/create', component: CreateAssessmentComponent },
  { path: 'assessment/edit', component: EditAssessmentComponent },
  { path: 'assessment/view', component: ViewAssessmentComponent },
  { path: 'question/create', component: CreateQuestionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
