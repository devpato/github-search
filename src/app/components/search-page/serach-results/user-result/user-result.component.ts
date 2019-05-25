import { Component, OnInit, Input } from '@angular/core';
import { UserItems } from 'src/app/shared/models/user-items.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as UsersActions from 'src/app/shared/state/actions/users.actions';
import * as UsersSelectors from 'src/app/shared/state/selectors/users.selector';
import { map } from 'rxjs/operators';
import { UiService } from 'src/app/shared/services/ui.service';
@Component({
  selector: 'app-user-result',
  templateUrl: './user-result.component.html',
  styleUrls: ['./user-result.component.scss']
})
export class UserResultComponent implements OnInit {
  @Input()
  user: UserItems;
  $subData: Observable<any>;
  toggle = false;
  selectedUser: any;

  constructor(private store: Store<any>, private uiService: UiService) {}

  ngOnInit() {}

  onSelectUser(selectedUser: any): void {
    this.uiService.setTabSelected(false);
    this.store.dispatch(new UsersActions.SetSelectedUser(null));
    this.store
      .select(UsersSelectors.selectSearchSubData)
      .pipe(
        map(usersSubdata =>
          usersSubdata.find(userSD => userSD.user === selectedUser.login)
        )
      )
      .subscribe(selected => {
        selected === undefined
          ? this.store.dispatch(
              new UsersActions.SearchSubData(selectedUser.login)
            )
          : this.store.dispatch(new UsersActions.SetSelectedUser(selected));
        this.uiService.setTabSelected(true);
      });
  }
}
