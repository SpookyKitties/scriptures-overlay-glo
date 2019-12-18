import { Component, Fragment } from 'react';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export let titleService: BehaviorSubject<[string, string]>;

export class TitleComponent extends Component {
  public state: { title: string; shortTitle: string };
  componentDidMount() {
    titleService = new BehaviorSubject(['Library', 'Library']);

    titleService
      .pipe(
        map(([title, shortTitle]) => {
          this.setState({ title: title, shortTitle: shortTitle });
        }),
      )
      .subscribe();
  }
  render() {
    return (
      <Fragment>
        <span className={`title-text`}>
          {this.state ? this.state.title : ''}
        </span>
        <span className={`short-title-text`}>
          {this.state ? this.state.shortTitle : ''}
        </span>
      </Fragment>
    );
  }
}
