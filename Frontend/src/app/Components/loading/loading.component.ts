// import { Component, Input } from '@angular/core';

// @Component({
//   selector: 'app-loading',
//   templateUrl: './loading.component.html',
//   styleUrls: ['./loading.component.css']
// })
// export class LoadingComponent {
//   @Input() message: string = 'Processing your request...';
//   @Input() progress: number = 0;
//   @Input() showProgress: boolean = true;
//   @Input() fullScreen: boolean = true;
//   @Input() spinnerType: 'circular' | 'dots' = 'circular';
// }


import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {
  @Input() message: string = 'Processing your request...';
  @Input() progress: number = 0;
  @Input() showProgress: boolean = true;
  @Input() fullScreen: boolean = true;
  @Input() spinnerType: 'circular' | 'dots' = 'circular';
  @Input() status: 'loading' | 'success' | 'error' = 'loading';
  @Input() successMessage: string = 'Completed successfully!';
  @Input() errorMessage: string = 'An error occurred!';
}