import {Component, OnInit} from '@angular/core';
import {ConfigurationService} from './services/configuration.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  isCheckedConfiguration = false;
  isConfigured = false;

  constructor(private configurationService: ConfigurationService) {}

  async ngOnInit(): Promise<void> {
    this.configurationService.checkConfiguration()
      .then(() => {
        this.isConfigured = true;
        this.isCheckedConfiguration = true;
      })
      .catch(() => {
        this.isConfigured = false;
        this.isCheckedConfiguration = true;
      });
  }
}
