import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-waiting-list',
  templateUrl: './waiting-list.component.html',
  styleUrls: ['./waiting-list.component.scss']
})
export class WaitingListComponent implements OnInit {

  constructor(private _userService: UserService, private _adminService: AdminService, private snackBar: SnackbarService) { }

  tableData: any;

  ngOnInit(): void {
    this.getWaitingList()
  }

  getWaitingList() {
    this._adminService.getWaitingList().subscribe(res => {
      this.tableData = res
    },
      (err) => {
        this.snackBar.openFailureSnackBar()
      })
  }

  acceptUser(id: number) {
    let updatedUser = {
      id: id,
      status: 1
    }
    this.updateUserStatus(updatedUser)
    this.getWaitingList()
  }
  denyUser(id: number) {
    let updateUser = {
      id: id,
      status: -1
    }
    this.updateUserStatus(updateUser)
    this.getWaitingList()
  }

  updateUserStatus(updateduser: { id: number, status: number }) {
    this._adminService.updateUserStatus(updateduser).subscribe((res) => {
      this.snackBar.openSuccessSnackBar()
    },
      (err) => {
        this.snackBar.openFailureSnackBar()
      })
  }

}
