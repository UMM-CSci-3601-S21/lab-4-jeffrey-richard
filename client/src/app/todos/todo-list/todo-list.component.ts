import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Todo } from '../todo';
import { TodoService } from '../todo.service';


@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})

export class TodoListComponent implements OnInit, OnDestroy {

  public serverFilteredTodos: Todo[];
  public filteredTodos: Todo[];

  public owner: string;
  public todoStatus: boolean;
  public todoBody: string;
  public todoCategory: string;
  public limit: number;
  getTodosSub: Subscription;

  constructor(private todoService: TodoService) { }

  // The method we use to filter on the server side
  getTodosFromServer(): void {
    this.unsub();
    this.getTodosSub = this.todoService.getTodos({
      status: this.todoStatus,
      owner: this.owner
    }).subscribe(returnedTodos => {
      this.serverFilteredTodos = returnedTodos;
      this.updateFilter();
    }, err => {
      console.log(err);
    });
  }

  // The method we use to filter on the client side
  updateFilter(){
    this.filteredTodos = this.todoService.filterTodos(
      this.serverFilteredTodos, { category: this.todoCategory, body: this.todoBody, limit: this.limit });
  }

  ngOnInit(): void {
    this.getTodosFromServer();
  }

  ngOnDestroy(): void {
    this.unsub();
  }

  unsub(): void {
    if(this.getTodosSub) {
      this.getTodosSub.unsubscribe();
    }
  }
}
