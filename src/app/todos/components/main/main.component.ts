import {Component} from "@angular/core"
import {combineLatest, Observable} from "rxjs";
import {TodoInterface} from "../../types/todo.interface";
import {TodosService} from "../../services/todos.service";
import {map} from "rxjs/operators"
import {FilterEnum} from "../../types/filter.enum";

@Component({
  selector: 'app-todos-main',
  templateUrl: './main.component.html'
})
export class MainComponent {
  visibleTodos$: Observable<TodoInterface[]>
  noTodoClass$: Observable<boolean>
  isAllTodoSelected$: Observable<boolean>
  editingId: string | null = null

  constructor(private todosService: TodosService) {
    this.isAllTodoSelected$ = this.todosService.todos$.pipe(
      map((todos => todos.every((todo) => todo.isCompleted)))
    )
    this.noTodoClass$ = this.todosService.todos$.pipe(
      map((todos => todos.length === 0))
    )
    this.visibleTodos$ = combineLatest(
      this.todosService.todos$,
      this.todosService.filter$
    ).pipe(map(([todos, filter]: [TodoInterface[], FilterEnum]): TodoInterface[] => {
      switch (filter) {
        case FilterEnum.active:
          return todos.filter(todo => !todo.isCompleted)
        case FilterEnum.completed:
          return todos.filter(todo => todo.isCompleted)
        default:
          return todos
      }
    }))
  }

  toggleAllTodos(event: Event): void {
    const target: HTMLInputElement = event.target as HTMLInputElement
    this.todosService.toggleAll(target.checked)
  }

  setEditingId(id: string | null): void {
    this.editingId = id
  }
}
