import {Component, Inject, ViewEncapsulation, QueryList, ElementRef} from 'angular2/core';
import {Http} from 'angular2/http';
import {MATERIAL_DIRECTIVES, MdTabs} from "ng2-material/all";
import {TranslateService} from 'ng2-translate/ng2-translate';
import {RouteParams, RouterLink} from 'angular2/router';
import {FORM_DIRECTIVES} from "angular2/common";

import {Logger, BaseCrud, UserDto, UrlService} from '../../engine/all';

@Component({
  selector: 'login',
  templateUrl: 'components/login/login.html',
  providers: [QueryList, ElementRef, MdTabs],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent extends BaseCrud {

  urlService:UrlService;
  user:UserDto;
  active = 0;

  constructor(@Inject(RouteParams) routeParams, private http:Http, private translate: TranslateService, private tabs:MdTabs) {
    super(translate);
    this.urlService = new UrlService(http, "/");
    this.user = new UserDto();
  }

  ngOnInit() {
    console.log(this.tabs);
  }

  login() {
    if (this.user.username == '' || this.user.password == '') {
      this.error = "Empty login or password";
      return;
    }
    this.urlService.login(this.user, true).subscribe((data) => {
      this.hasError(data).subscribe((data) => {
        window.location.hash = "#/home";
      });
    }, (error) => { this.info = ""; this.error = error; });
  }

  createAccount() {
    this.active = 2;
    if (this.fieldRequire(this.user.username, this.user.password, this.user.passwordConfirm, this.user.email, this.user.emailConfirm)) {
      this.error = "Migging field(s)";
      return;
    }
    if (this.user.password != this.user.passwordConfirm) {
      this.error = "not the same password";
      return;
    }
    if (this.user.email != this.user.emailConfirm) {
      this.error = "not the same email";
      return;
    }
    let newUser = new UserDto();
    newUser.username = this.user.username;
    newUser.password = btoa(this.user.password);
    newUser.email = this.user.email;
    this.urlService.postUrlBase("/user/createAccount", newUser).subscribe((data) => {
      this.hasError(data).subscribe((data) => {
        window.location.hash = "#/login";
      });
    }, (error) => { this.info = ""; this.error = error; });
  }
}