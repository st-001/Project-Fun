import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSelectSearchComponent } from './group-select-search.component';

describe('GroupSelectSearchComponent', () => {
  let component: GroupSelectSearchComponent;
  let fixture: ComponentFixture<GroupSelectSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupSelectSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupSelectSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
