import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewTaskDialogComponent } from './create-new-task-dialog.component';

describe('CreateNewTaskDialogComponent', () => {
  let component: CreateNewTaskDialogComponent;
  let fixture: ComponentFixture<CreateNewTaskDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewTaskDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateNewTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
