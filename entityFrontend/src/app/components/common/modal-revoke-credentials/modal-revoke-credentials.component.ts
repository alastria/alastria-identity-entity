import { Component, OnInit, EventEmitter, Output, Pipe, PipeTransform } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';

@Pipe({name: 'replaceLineBreaks'})
export class ReplaceLineBreaks implements PipeTransform {
  transform(value: string): string {
    return value.replace(/\n/g, '<br/>');
  }
}

@Component({
  selector: 'app-modal-revoke-credentials',
  templateUrl: './modal-revoke-credentials.component.html',
  styleUrls: ['./modal-revoke-credentials.component.css']
})
export class ModalRevokeCredentialsComponent implements OnInit {
  @Output() handleRevokeCredentials = new EventEmitter<Array<string>>();
  form: FormGroup;
  credentials = []

  constructor(private userService: UserService,
              private fb: FormBuilder) {
    this.init()
  }

  ngOnInit() {
  }

  async init() {
    await this.getCredentialsDB();
    this.form = this.fb.group({
      options: this.fb.array(this.addCheckboxes())
    });
    if (this.credentials) {
      this.addCheckboxes();
    }
  }

  async getCredentialsDB() {
    try {
      let user = this.userService.getUserLoggedIn()
      this.credentials = await this.userService.getCredentialsDB(user.did)
    }
    catch(error) {
      console.error(error)
      throw error
    }
  }

  async revokeCredentials() {
    const credentialsSelected = this.form.value.options
      .map((v, i) => {
        let result: any = {}
        v ? this.credentials[i].psmHash : null
        if(v) {
          result.status = 2
          result.credentialHash = this.credentials[i].psmHash
        } else {
          result = null
        }
        return result
      })
      // this.form.reset()
      this.handleRevokeCredentials.emit(credentialsSelected.filter(credential => (credential)))
    }

  /**
   * function for add checkboxes in the form
   */
  private addCheckboxes(): Array<any> {
    const controls = [];
    this.credentials.forEach((o, i) => {
      controls.push(new FormControl(false));
    });
    return controls;
  }

}
