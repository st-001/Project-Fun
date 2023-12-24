import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewClientDialogComponent } from './create-new-client-dialog.component';

describe('CreateNewClientDialogComponent', () => {
  let component: CreateNewClientDialogComponent;
  let fixture: ComponentFixture<CreateNewClientDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewClientDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateNewClientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
