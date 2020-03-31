import { Component, OnInit } from '@angular/core';
import { QuestionService } from 'src/app/services/question.service';
import { AssessmentService } from 'src/app/services/assessment.service';
import { HelperService } from '../../../services/helper.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/models/shared/category.model';
import { Question } from 'src/app/models/question.interface';
import { Assessment } from 'src/app/models/assessment.model';
import { FormBuilder, FormArray } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AssessmentConfig } from 'src/app/models/assessment-config.model';

@Component({
  selector: 'app-edit-assessment',
  templateUrl: './edit-assessment.component.html',
  styleUrls: ['./edit-assessment.component.css']
})
export class EditAssessmentComponent implements OnInit {
  isEditMode: boolean;
  assessment: Assessment;
  assessmentSubscription: Subscription;
  updateAssessmentForm;
  selectCategoryForm;
  config;

  constructor(
    private route: ActivatedRoute,
    public questionService: QuestionService,
    public assessmentService: AssessmentService,
    public helperService: HelperService,
    private formBuilder: FormBuilder) {
      this.updateAssessmentForm = this.formBuilder.group({
        name: '',
        description: ''
      });
      this.selectCategoryForm = this.formBuilder.group({
      categories: '',
    });
  }

  ngOnInit() {
    // Sets up an assessment listener to get a new assessment
    // Gets the assessment based on the passed in id
    // id is passed through the URL
    this.assessmentService.getAssessmentById(this.route.snapshot.params.assessmentId);
    this.assessmentSubscription = this.assessmentService.getAssessmentUpdateListener()
      .subscribe((assessment: Assessment) => {
        this.assessment = assessment;
      });
  }

  onSubmit(assessmentData) {

    const updatedAssessment: Assessment = new Assessment();
    updatedAssessment._id = null;
    updatedAssessment.name = assessmentData.name;
    updatedAssessment.description = assessmentData.description;
    updatedAssessment.questionIds = null;
    updatedAssessment.config = new AssessmentConfig();
    // this.assessmentService.saveAssessment(updatedAssessment);
  }

}
