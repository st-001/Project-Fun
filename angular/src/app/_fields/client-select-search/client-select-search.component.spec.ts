import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSelectSearchComponent } from './client-select-search.component';

describe('ClientSelectSearchComponent', () => {
  let component: ClientSelectSearchComponent;
  let fixture: ComponentFixture<ClientSelectSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientSelectSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientSelectSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
