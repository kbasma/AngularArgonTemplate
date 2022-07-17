import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IAlert} from '../sections/alerts-section/alerts-section.component';
import {LANDING} from './landing.constants';
import {APP} from '../core/constants';
import {containsExclusionKey, getEmailFormKeyName} from './landing.utils';
import {SmtpService} from '../core/aws/smtp.service';

declare let Email: any;

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})

export class LandingComponent implements OnInit {
  focus: any;
  focus1: any;
  emailForm: FormGroup;
  alerts: Array<IAlert> = [];
  alert: IAlert;
  commentRequest = new Map();
  appConstants = APP;

  constructor(
    private _smtpService: SmtpService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.buildEmailForm();
  }

  buildEmailForm() {
    this.emailForm = this.formBuilder.group({
      fName: ['', [
        Validators.required,
        Validators.maxLength(26)
      ]],
      lName: ['', [
        Validators.required,
        Validators.maxLength(26)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      phone: ['', []],
      business: ['', [
        Validators.required,
        Validators.maxLength(50)
      ]],
      service: ['', [
        Validators.required
      ]],
      comments: ['', [
        Validators.maxLength(700)
      ]]
    });
  }

  populateComment(type) {
    const comments = this.emailForm.controls['comments'].value;
    // Remove any additional comments that have been manually deleted from text area
    for (const entry of this.commentRequest.entries()) {
      if (!containsExclusionKey(LANDING.COMMENTS[entry[0]].EXCLUSION_KEYS, comments.toLowerCase())) {
        this.commentRequest.delete(entry[0]);
      }
    }
    this.commentRequest.set(type, `${LANDING.COMMENTS[type].MESSAGE}`);
    this.buildComments();
  }

  buildComments() {
    let comments = this.emailForm.controls['comments'].value.trimEnd();
    // Build the comments
    for (const entry of this.commentRequest.entries()) {
      if (!containsExclusionKey(LANDING.COMMENTS[entry[0]].EXCLUSION_KEYS, comments.toLowerCase())) {
        if (comments.length > 0) {
          comments += `\n${LANDING.COMMENTS.ADDITIONAL}${entry[1]}\n`;
        } else {
          comments += `${entry[1]}\n`;
        }
      }
    }
    this.emailForm.controls['comments'].setValue(comments);
  }

  sendMessage() {
    this.alerts = new Array<IAlert>();
    this.alert = {};
    if (this.emailForm.valid) {
      this._smtpService.sendMail(
        this.emailForm.controls['email'].value,
        `New Tackon Technologies Business Request : ${this.emailForm.controls['business'].value}`,
        `<i>New Tackon Technologies Business Request : ${this.emailForm.controls['business'].value}</i>
          <br/> <b>Name:</b>          <br/>   ${this.emailForm.controls['fName'].value} ${this.emailForm.controls['lName'].value}
          <br/> <b>Email:</b>         <br/>   ${this.emailForm.controls['email'].value}
          <br/> <b>Business Name:</b> <br/>   ${this.emailForm.controls['business'].value}
          <br/> <b>Phone:</b>         <br/>   ${this.emailForm.controls['phone'].value}
          <br/> <b>Comments:</b>      <br/>   ${this.emailForm.controls['comments'].value}`
      ).then(message => {
        this.emailForm.reset();
        if (message === 'OK') {
          this.alerts.push({
            id: 1,
            type: 'success',
            strong: 'Success!',
            message: 'Email Successfully Sent!',
            icon: 'ni ni-like-2'
          });
        } else {
          alert(message);
        }
      });
    } else {
      this.emailForm.markAllAsTouched();
      this.handleFormErrors();
    }
  }

  handleFormErrors() {
    Object.keys(this.emailForm.controls).forEach(key => {
      const control = this.emailForm.get(key);
      if (control.invalid) {
        const errors = control.errors;
        Object.keys(errors).forEach(err => {
          const value = Object.values(errors).pop();
          switch (err) {
            case 'required':
              return this.alerts.push({
                key: key,
                type: 'warning',
                strong: 'Warning!',
                message: `- ${getEmailFormKeyName(key)} required`,
                icon: 'ni ni-support-16'
              });
            case 'maxlength':
              return this.alerts.push({
                key: key,
                type: 'warning',
                strong: 'Warning!',
                message: `- ${getEmailFormKeyName(key)} maximum characters ${value.requiredLength}`,
                icon: 'ni ni-support-16'
              });
            case 'email':
              return this.alerts.push({
                key: key,
                type: 'warning',
                strong: 'Warning!',
                message: `- ${getEmailFormKeyName(key)} invalid email format`,
                icon: 'ni ni-support-16'
              });
            default:
              return this.alerts.push({
                key: key,
                type: 'warning',
                strong: 'Warning!',
                message: `- Unknown error for ${getEmailFormKeyName(key)}`,
                icon: 'ni ni-support-16'
              });
          }
        });
        this.buildErrorMessage();
      }
    });
  }

  buildErrorMessage() {
    this.alert = {
      type: 'warning',
      strong: 'Warning!',
      header: 'Please fix the following fields.',
      alerts: this.alerts,
      icon: 'ni ni-support-16'
    };
  }

  isFormFieldInvalid(type) {
    return this.emailForm.controls[type].touched && this.emailForm.controls[type].invalid;
  }
}
