import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProjectDialogComponent } from './edit-project-dialog.component';

describe('EditProjectDialogComponent', () => {
  let component: EditProjectDialogComponent;
  let fixture: ComponentFixture<EditProjectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProjectDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditProjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
