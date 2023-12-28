import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewNoteDialogComponent } from './create-new-note-dialog.component';

describe('CreateNewNoteDialogComponent', () => {
  let component: CreateNewNoteDialogComponent;
  let fixture: ComponentFixture<CreateNewNoteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewNoteDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateNewNoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
