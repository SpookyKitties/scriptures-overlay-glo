import { Component } from 'react';
import { NavigationItem } from '../navigation-item';

export class SearchBoxComponent extends Component {
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
        />
        ;
      </div>
    );
  }
}
