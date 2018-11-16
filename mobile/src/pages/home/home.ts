import {Component, NgZone, OnInit} from '@angular/core';
import { NavController } from 'ionic-angular';
import * as io from 'socket.io-client';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  public lineChartData = [
    {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Acceleration'},
    {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Roll Angle'},
    {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Z Axis'}
  ];
  public lineChartLabels = ['1', '2', '3',
    '4', '5', '6', '7', "8", "9", "10"];
  public lineChartOptions = {
    responsive: true
  };
  public lineChartColors = [
    {
      backgroundColor: 'rgba(60, 179, 113,0.3)',
      borderColor: 'rgba(60, 179, 113, 0.8)',
      pointBackgroundColor: 'rgba(60, 179, 113, 1)',
      pointBorderColor: 'white',
      pointHoverBackgroundColor: 'rgba(60, 179, 113, 1)',
      pointHoverBorderColor: 'white'
    },
    {
      backgroundColor: 'rgba(106, 90, 205,0.3)',
      borderColor: 'rgba(106, 90, 205,0.8)',
      pointBackgroundColor: 'rgba(106, 90, 205,1)',
      pointBorderColor: 'white',
      pointHoverBackgroundColor: 'rgba(106, 90, 205,1)',
      pointHoverBorderColor: 'white'
    },
    {
      backgroundColor: 'rgba(255, 165, 0,0.3)',
      borderColor: 'rgba(255, 165, 0,0.8)',
      pointBackgroundColor: 'rgba(255, 165, 0,1)',
      pointBorderColor: 'white',
      pointHoverBackgroundColor: 'rgba(255, 165, 0,1)',
      pointHoverBorderColor: 'white)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public movemnt;
  constructor(public navCtrl: NavController, private ngZone: NgZone) { }

  ngOnInit() {
    this.ngZone.runOutsideAngular( () => {
      const socket = io(); // ADD SERVER URL HERE
      socket.on('event:accelerometer', (val1, val2, val3, val4) => {
        this.ngZone.run( () => {
          this.lineChartData[0] = val1.split(',');
          this.lineChartData[1] = val3.split(',');
          this.lineChartData[2] = val2.split(',');
          this.movemnt = val4;
        });
      });
    });
  }
}
