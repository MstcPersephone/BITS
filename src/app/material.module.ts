import { NgModule } from '@angular/core';
import {
  MatAutocompleteModule,
  MatCardModule,
  MatSelectModule,
  MatToolbarModule
} from '@angular/material';

// Place Material Components that you want to use in here
// This saves us from adding components to imports and exports array separately
const MaterialComponents = [
  MatAutocompleteModule,
  MatCardModule,
  MatSelectModule,
  MatToolbarModule
];

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})
export class MaterialModule {}
