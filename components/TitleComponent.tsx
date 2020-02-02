import { Component, Fragment } from 'react';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export let titleService: BehaviorSubject<[string, string]>;
import * as viewport from 'viewport-dimensions';

export class TitleComponent extends Component {
  public state: { title: string; shortTitle: string };
  componentDidMount() {
    titleService = new BehaviorSubject(['Library', 'Library']);

    titleService
      .pipe(
        map(([title, shortTitle]) => {
          const titleRegex = /([A-Za-z]+)(\d+)/g.exec(title);
          const shortTitleRegex = /([A-Za-z]+)(\d+)/g.exec(shortTitle);
          this.setState({
            title: titleRegex
              ? `${titleRegex[1]}<sup>${titleRegex[2]}</sup>`
              : title,
            shortTitle: shortTitleRegex
              ? `${shortTitleRegex[1]}<sup>${shortTitleRegex[2]}</sup>`
              : shortTitle,
          });
        }),
      )
      .subscribe();
  }
  render() {
    return (
      <Fragment>
        <span
          className={`title-text`}
          dangerouslySetInnerHTML={{
            __html: this.state ? this.state.title : '',
          }}
        ></span>
        <span
          className={`short-title-text`}
          dangerouslySetInnerHTML={{
            __html: this.state ? `${this.state.shortTitle}` : '',
          }}
        ></span>
      </Fragment>
    );
  }
}
