import { Component } from 'react';
import { NavigationItem } from '../navigation-item';

export class SearchBoxComponent extends Component {
  public lookUp() {
    const textBox = document.getElementById('searchBox');
    console.log(textBox);
  }
  public render() {
    // if (this.props.navigation) {
    //   return <div></div>;
    // }

    return (
      <div>
        <input
          type="search"
          name="search"
          id="searchBox"
          placeholder="Look Up"
          onKeyDown={evt => {
            console.log(evt.key);

            this.lookUp();
          }}
        />
        ;
      </div>
    );
  }
}
