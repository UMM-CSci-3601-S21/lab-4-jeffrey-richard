import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { TodoCardComponent } from '../todo-card/todo-card.component';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from '../todo.service';
import { MockTodoService } from 'src/testing/todo.service.mock';
import { Todo } from '../todo';
import { MatIconModule } from '@angular/material/icon';

const COMMON_IMPORTS: any[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatListModule,
  MatDividerModule,
  MatRadioModule,
  MatIconModule,
  BrowserAnimationsModule,
  RouterTestingModule,
];

describe('TodoListComponent', () => {
  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [TodoListComponent, TodoCardComponent],
      providers: [{ provide: TodoService, useValue: new MockTodoService() }]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoListComponent);
      todoList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(todoList).toBeTruthy();
  });

  it('contains all of the todos', () => {
    expect(todoList.serverFilteredTodos.length).toBe(3);
  });

  it('contains an owner named "Dawn"', () => {
    expect(todoList.serverFilteredTodos.some((todo: Todo) => todo.owner === 'Dawn')).toBe(true);
  });

  it('should not contain a category named "dinner"', () => {
    expect(todoList.serverFilteredTodos.some((todo: Todo) => todo.category === 'dinner')).toBe(false);
  });

  it('should have two todos with the owner "Fry"', () => {
    expect(todoList.serverFilteredTodos.filter((todo: Todo) => todo.owner === 'Fry').length).toBe(2);
  });

  it('should not contain an owner named "Sarah"', () => {
    expect(todoList.serverFilteredTodos.filter((todo: Todo) => todo.owner === 'Sarah').length).toBe(0);
  });
});

  describe('Misbehaving Todo List', () => {
    let todoList: TodoListComponent;
    let fixture: ComponentFixture<TodoListComponent>;

    let todoServiceStub: {
      getTodos: () => Observable<Todo[]>;
      getTodosFiltered: () => Observable<Todo[]>;
    };

    beforeEach(() => {

      todoServiceStub = {
        getTodos: () => new Observable(observer => {
          observer.error('Error-prone observable');
        }),
        getTodosFiltered: () => new Observable(observer => {
          observer.error('Error-prone observable');
        })
      };

      TestBed.configureTestingModule({
        imports: [COMMON_IMPORTS],
        declarations: [TodoListComponent],
        providers: [{ provide: TodoService, useValue: todoServiceStub }]
      });
    });

    beforeEach(waitForAsync(() => {
      TestBed.compileComponents().then(() => {
        fixture = TestBed.createComponent(TodoListComponent);
        todoList = fixture.componentInstance;
        fixture.detectChanges();
      });
    }));

    it('generates an error if we dont make a TodoListService', () => {
      // Since the observer throws an error, we don't expect todos to be defined.
      expect(todoList.serverFilteredTodos).toBeUndefined();
    });
  });
