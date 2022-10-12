import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent implements OnInit {
  constructor(
    private _adminService: AdminService,
    private snackBar: SnackbarService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this._adminService.getWaitingList().subscribe(
      (res) => {
        this.router.navigateByUrl('/admin/waiting-list');
      },
      (err) => {
        this.snackBar.openFailureSnackBar(
          'Sistemdən istifadə etmək hüququnuz yoxdur!',
          ''
        );
        this.router.navigateByUrl('/login');
      }
    );
  }

  activeMenu: number = 0;

  checkActiveTab(tab: number) {
    this.activeMenu = tab;
  }
}
