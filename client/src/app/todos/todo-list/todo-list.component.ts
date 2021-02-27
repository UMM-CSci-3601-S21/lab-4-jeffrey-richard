import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Todo } from '../todo';
import { TodoService } from '../todo.service';


@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  public serverFilteredTodos: Todo[];
  public filteredTodos: Todo[];

  public owner: string;
  public todoStatus: boolean;
  public todoBody: string;
  public todoCategory: string;
  public limit: number;

  constructor(private todoService: TodoService, private matSnack: MatSnackBar) { }

  ngOnInit(): void {
  }

  // The method we use to filter on the server side
  getTodosFromServer() {

  }

  // The method we use to filter on the client side
  updateFilter(){

  }

  // Returns the maximum size of todos (size of database)
  getSize(): number {
    return 1000;
  }

}
