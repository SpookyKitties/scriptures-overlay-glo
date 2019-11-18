import { Component, ReactPropTypes } from 'react';

type ChapterProps = {
  a: boolean;
};

export class ChapterComponent extends Component<ChapterProps> {
  // private chapter:

  //   public a: boolean = false;
  public render() {
    if (this.props.a) {
      return (
        <h1 onClick={() => this.click('test')}>
          {' '}
          asdf
          <ChapterComponent a={false}></ChapterComponent>
        </h1>
      );
    }
    return <h1 onClick={() => this.click('test2')}>ded</h1>;
  }

  private click(a: string) {
    alert(a);
  }
}

// export default Chapter;
