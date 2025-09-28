import { Component, TemplateRef, input, output, signal } from '@angular/core';
import { ListUser } from '@core/models';
import { TranslateModule } from '@ngx-translate/core';
import { CommonPrimeNgModule } from '@shared/modules';
import { TableLazyLoadEvent } from 'primeng/table';
import { UserAvatar } from '@shared/components/user-avatar/user-avatar';
import { UserRolesChips } from '@shared/components/user-roles-chips/user-roles-chips';
import { LocalizedDatePipe } from '@shared/pipes';

@Component({
  selector: 'app-users-table',
  imports: [CommonPrimeNgModule, TranslateModule, UserAvatar, UserRolesChips, LocalizedDatePipe],
  templateUrl: './users-table.html',
  styles: ``,
})
export class UsersTable {
  public users = input<ListUser[]>([]);
  public paginator = input<boolean>(false);
  public totalCount = input<number>(0);
  public lazy = input<boolean>(false);
  public lazyLoad = output<TableLazyLoadEvent>();
  public enableEditRoles = input<boolean>(false);
  public actionsColumnTemplate = input<TemplateRef<any>>();
}
