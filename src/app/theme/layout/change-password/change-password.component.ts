import { Component, OnInit, Input } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
// import { AccountService } from 'src/app/services/account.service';

declare let $: any;
declare let toastr: any;

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: []
})
export class ChangePasswordComponent implements OnInit {
  passwordModel: any = {};
  loading: boolean;
  valid: boolean;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {}

  public show() {
    this.passwordModel = {};
    $('#change-password-modal').modal('show');
  }

  hide() {
    $('#change-password-modal').modal('hide');
  }

  onSave() {
    const self = this;
    console.log('onSaveChanges', this.passwordModel);

    self.loading = true;
    self.accountService.updatePwd(self.passwordModel).then((res: any) => {
      res = res.json();
      self.loading = false;
      if (res) {
        if (!res.success) {
          toastr.error(res.message, 'Error');
        }
      } else {
        toastr.success('Saved successfully!', 'Success');
        self.hide();
      }
    });
  }

  validatePassword() {
    const pass = this.passwordModel.newPassword;
    this.valid = false;
    if (!pass) {
      return false;
    }

    const regex = new Array();
    regex.push('[A-Z]'); // Uppercase Alphabet.
    regex.push('[a-z]'); // Lowercase Alphabet.
    regex.push('[0-9]'); // Digit.

    let passed = 0;

    regex.forEach((item, index) => {
      if (new RegExp(item).test(pass)) {
        passed++;
      }
    });

    if (passed > 2 && pass.length >= 8) {
      this.valid = true;
    }

    return this.valid;
  }

  validateConfirmPassword(): boolean {
    if (this.passwordModel.newPassword !== this.passwordModel.reNewPassword) {
      return false;
    }
    return true;
  }
}
