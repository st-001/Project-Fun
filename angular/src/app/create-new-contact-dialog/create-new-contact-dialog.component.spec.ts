import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewContactDialogComponent } from './create-new-contact-dialog.component';

describe('CreateNewContactDialogComponent', () => {
  let component: CreateNewContactDialogComponent;
  let fixture: ComponentFixture<CreateNewContactDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewContactDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateNewContactDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
