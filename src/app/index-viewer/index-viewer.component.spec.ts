import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexViewerComponent } from './index-viewer.component';

describe('IndexViewerComponent', () => {
  let component: IndexViewerComponent;
  let fixture: ComponentFixture<IndexViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
