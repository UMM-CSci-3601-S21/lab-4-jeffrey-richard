import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockTodoService } from 'src/testing/todo.service.mock';
import { AddTodoComponent } from './add-todo.component';
import { TodoService } from '../todo.service';

describe('AddTodoComponent', () => {
  let addTodo: AddTodoComponent;
  let addTodoForm: FormGroup;
  let fixture: ComponentFixture<AddTodoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      declarations: [AddTodoComponent],
      providers: [{ provide: TodoService, useValue: new MockTodoService() }]
    }).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTodoComponent);
    addTodo = fixture.componentInstance;
    addTodo.ngOnInit();
    fixture.detectChanges();
    addTodoForm = addTodo.addTodoForm;
    expect(addTodoForm).toBeDefined();
    expect(addTodoForm.controls).toBeDefined();
  });

  it('should create', () => {
    expect(addTodo).toBeTruthy();
  });

  it('should create the component and the form', () => {
    expect(addTodo).toBeTruthy();
    expect(addTodoForm).toBeTruthy();
  });

  it('the form should be invalid when empty', () => {
    expect(addTodoForm.valid).toBeFalsy();
  });

  describe('Owner field', () => {
    let ownerControl: AbstractControl;

    beforeEach(() => {
      ownerControl = addTodo.addTodoForm.controls.owner;
    });

    it('should not allow an empty owner', () => {
      ownerControl.setValue('');
      expect(ownerControl.valid).toBeFalsy();
    });

    it('should be fine with 1 character', () => {
      ownerControl.setValue('a');
      expect(ownerControl.valid).toBeTruthy();
    });

    it('should be fine with "Richard"', () => {
      ownerControl.setValue('Richard');
      expect(ownerControl.valid).toBeTruthy();
    });

    it('should fail on more than 50 characters', () => {
      ownerControl.setValue('x'.repeat(51));
      expect(ownerControl.valid).toBeFalsy();
    });

    it('should allow 50 characters', () => {
      ownerControl.setValue('x'.repeat(50));
      expect(ownerControl.valid).toBeTruthy();
    });
  });

  describe('The category field', () => {
    let catControl: AbstractControl;

    beforeEach(() => {
      catControl = addTodo.addTodoForm.controls.category;
    });

    it('should not allow an empty category', () => {
      catControl.setValue('');
      expect(catControl.valid).toBeFalsy();
    });

    it('should be fine with 1 character', () => {
      catControl.setValue('j');
      expect(catControl.valid).toBeTruthy();
    });

    it('should be fine with "shopping"', () => {
      catControl.setValue('shopping');
      expect(catControl.valid).toBeTruthy();
    });

    it('should fail on more than 50 characters', () => {
      catControl.setValue('x'.repeat(51));
      expect(catControl.valid).toBeFalsy();
    });

    it('should allow 50 characters', () => {
      catControl.setValue('x'.repeat(50));
      expect(catControl.valid).toBeTruthy();
    });
  });

  describe('The body field', () => {
    let bodyControl: AbstractControl;

    beforeEach(() => {
      bodyControl = addTodo.addTodoForm.controls.body;
    });

    it('should not allow an empty body', () => {
      bodyControl.setValue('');
      expect(bodyControl.valid).toBeFalsy();
    });

    it('should be fine with 1 character', () => {
      bodyControl.setValue('h');
      expect(bodyControl.valid).toBeTruthy();
    });

    it('should be fine with "buy new shoes"', () => {
      bodyControl.setValue('buy new shoes');
      expect(bodyControl.valid).toBeTruthy();
    });

    it('should fail on more than 150 characters', () => {
      bodyControl.setValue('x'.repeat(151));
      expect(bodyControl.valid).toBeFalsy();
    });

    it('should allow 150 characters', () => {
      bodyControl.setValue('x'.repeat(150));
      expect(bodyControl.valid).toBeTruthy();
    });
  });
});
