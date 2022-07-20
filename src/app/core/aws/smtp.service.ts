import {Injectable} from '@angular/core';
import {AWS} from './api-constants';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SmtpService {
  API = AWS.API.SMTP.BASE;
  headers = this.getBaseHeaders();

  constructor(private http: HttpClient) {
  }

  sendMail(recipient, subject, body) {
    const request = this.API + AWS.API.SMTP.SEND_MAIL;
    return this.http.post(request, {
      recipient: AWS.API.SMTP.FROM_EMAIL,
      subject: subject,
      msgBody: body,
      from: recipient
    }, {
      headers: this.headers
    }).toPromise();
  }

  getBaseHeaders() {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    return headers;
  }
}
