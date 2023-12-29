import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSelectSearchComponent } from './project-select-search.component';

describe('ProjectSelectSearchComponent', () => {
  let component: ProjectSelectSearchComponent;
  let fixture: ComponentFixture<ProjectSelectSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectSelectSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectSelectSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
