import { Component } from 'react';
import { NavigationItem } from '../navigation-item';
import { SearchBoxComponent } from './searchbox.component';
export class NavigationComponenet extends Component {
  public state = { navigation: NavigationItem };
  public render() {
    if (this.state && this.state.navigation) {
      const n = this.state.navigation;
      return (
        <div>
          <SearchBoxComponent />
        </div>
      );
    }
    return <></>;
  }
}
