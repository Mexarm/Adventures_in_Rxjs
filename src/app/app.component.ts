import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  form: FormGroup;

  constructor(private fb: FormBuilder) {

    this.form = fb.group({
      search: []
    });

    var search = this.form.get('search');
    search.valueChanges.debounceTime(400)
      .map(str => (<string>str).replace(/ /g, '-'))
      .subscribe(x => console.log(x));

    var startDates = [];
    var startDate = new Date();

    for (var day = -2; day <= 2; day++) {
      var date = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + day
      );
      startDates.push(date);
    }
    Observable.from(startDates)
      .map(date => {
        console.log("Getting deals for date " + date);
        return [1, 2, 3];
      })
      .subscribe(x => console.log(x));

    //var observable = Observable.of(1,2,3,4,5,6)
    //var observable = Observable.throw(new Error('error!!!'))
    //var observable = Observable.empty()
    //var observable = Observable.range(1,10)
    //var observable = Observable.from([1,2,3,4])
    //var observable = Observable.of([1,2,3,4])
    var observable = Observable.interval(1000)
      .flatMap(x => {
        console.log(x + " calling the server to get the latests news");
        //return [1,2,3,4,5];
        return Observable.of([1, 2, 3, 4, 5]);
      })
      .subscribe(
        news => console.log(news), 
        err => console.log(err), 
        () => console.log('Completed'))
      .unsubscribe()//remove
      ; 
    
    //running parallel operations
    var userStream = Observable.of({
      userId: 1, username: 'mexarm'
    }).delay(2500);

    var tweetsStream = Observable.of([1, 2, 3]).delay(1500);

    Observable
      .forkJoin(userStream, tweetsStream)
     // .timeout(500)
      .map(joined =>
        new Object({ user: joined[0], tweets: joined[1] }))
      .subscribe(
        result => console.log(result),
        err => console.log(err));


    //error handling
    var errorObservable = Observable.throw(new Error('Something went wrong!!'));
    errorObservable.subscribe(
      x => console.log(x),
      error => console.log(error));

    //retrying

    var counter = 0

    var fakeAjaxCall = Observable.of('url')
      .flatMap((url) => {
        if (++counter < 2)
          return Observable.throw(new Error(url + ' Request Failed'));
        return Observable.of([counter, 1, 2, 3, 4, 5, 6]);
      });

    fakeAjaxCall
      .retry(3)  //without retrying observable logs error
      .subscribe(
      x => console.log(x),
      err => console.log(err)
      );

      //catching and continuing

      var remoteDataStream = Observable.of([4,5,6]);
      //var remoteDataStream = Observable.throw(new Error('something failed'));

      remoteDataStream
        .catch(err => {
          var localDataStream = Observable.of([1,2]);
          return localDataStream;
        }).subscribe(x => console.log(x));

  }
}
