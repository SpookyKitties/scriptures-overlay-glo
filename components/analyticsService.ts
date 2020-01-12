import ReactGa, { EventArgs, TrackerNames } from 'react-ga';
import { Subject } from 'rxjs';
export class AnalyticsService {
  public event$ = new Subject<{
    args: ReactGa.EventArgs;
    trackerNames?: ReactGa.TrackerNames;
  }>();

  constructor() {
    this.event();
  }

  public event() {
    this.event$.subscribe(evt => {
      ReactGa.event(evt.args, evt.trackerNames);
    });
  }
}
