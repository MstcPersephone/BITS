import { Component, OnInit } from '@angular/core';
import { AssessmentConfig } from 'src/app/models/assessment-config.model';
import { AssessmentService } from 'src/app/services/assessment.service';
import { QuestionService } from 'src/app/services/question.service';

@Component({
  selector: 'app-create-assessment-config',
  templateUrl: './create-assessment-config.component.html',
  styleUrls: ['./create-assessment-config.component.css']
})
export class CreateAssessmentConfigComponent implements OnInit {
  createConfigurationForm;

  constructor(public questionService: QuestionService,
              public assessmentService: AssessmentService) {

  }

  ngOnInit() {
    console.log(this.assessmentService.getIsRandom());
  }

  onSubmit(configurationdata) {
    // const config: AssessmentConfig = new AssessmentConfig();
    // config.isRandom = this.assessmentService.isRandomChanged();
    // config.minimumScore = null;
    // config.wrongStreak = null;
    // config.duration = null;
  }

}
