import { NgModule } from '@angular/core';
import {
  MatAutocompleteModule,
  MatCardModule,
  MatSelectModule,
  MatToolbarModule,
  MatInputModule,
  MatFormFieldModule,
  MatRadioModule,
  MatButtonModule
} from '@angular/material';

// Place Material Components that you want to use in here
// This saves us from adding components to imports and exports array separately
const MaterialComponents = [
  MatAutocompleteModule,
  MatCardModule,
  MatSelectModule,
  MatToolbarModule,
  MatInputModule,
  MatFormFieldModule,
  MatRadioModule,
  MatButtonModule
];

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})
export class MaterialModule {}
