import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HelperService } from './helper.service';
import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class AssessmentEngineService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private helperService: HelperService, ) { }
}
