import { Component, OnInit } from '@angular/core';
import { ScriptLoaderService } from '../services/script-loader.service';
import { Helpers } from '../helpers';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: []
})
export class AuthComponent implements OnInit {

  constructor(
    private script: ScriptLoaderService
  ) { }

  ngOnInit(): void {
    this.script.loadScripts('body', [
      'assets/default/libs/fileinput.js',
      'assets/default/libs/theme.min.js'
    ], true).then(() => {
      Helpers.setLoading(false);
    });


  }

}
