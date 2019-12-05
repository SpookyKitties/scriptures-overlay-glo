import { Component } from 'react';
import { NavigationItem } from '../navigation-item';
import { SearchBoxComponent } from './searchbox.component';
import { appSettings } from '../header.component';
import Link from 'next/link';

export class OithLink extends Component<{ href: string; active: boolean }> {
  public render() {
    if (this.props.href.includes('churchofjesuschrist.')) {
      return <Link href={`${this.props.href}`}>{this.props.children}</Link>;
    }
    return (
      <Link as={`/${this.props.href}`} href="/[book]/[chapter]">
        {this.props.children}
      </Link>
    );
  }
}

class NavItem extends Component<{ navItem: NavigationItem }> {
  public state: { navItem: NavigationItem; open: boolean };
  componentDidMount() {
    this.setState({ navItem: this.props.navItem });
  }

  open(navItem: NavigationItem) {
    navItem.open = !navItem.open;
    this.setState({ open: navItem.open });
  }

  render() {
    if (this.state && this.state.navItem) {
      const ni = this.state.navItem;

      if (ni.navigationItems) {
        return (
          <div>
            <span
              onClick={() => {
                this.open(ni);
              }}
            >
              {ni.title}
            </span>
            {this.state.open ? (
              ni.navigationItems.map(n => <NavItem navItem={n} />)
            ) : (
              <></>
            )}
          </div>
        );
      }
      return (
        <div>
          <OithLink href={ni.href} active={false}>
            <a>{ni.title}</a>
          </OithLink>{' '}
        </div>
      );
    }
    return <></>;
  }
}

export class NavigationComponenet extends Component {
  public state: { navigation: NavigationItem };

  componentDidMount() {
    appSettings.navigation$.subscribe(o => {
      this.setState({ navigation: o });
    });
  }
  public render() {
    if (this.state && this.state.navigation) {
      const n = this.state.navigation;
      return (
        <div className={`navigation`}>
          <SearchBoxComponent />
          <hr />
          <div>
            <span>{this.state.navigation.title}</span>
          </div>
          <hr />
          {this.state.navigation.navigationItems.map(ni => {
            return <NavItem navItem={ni} />;
          })}
        </div>
      );
    }
    return <></>;
  }
}
