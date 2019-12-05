import { Component } from 'react';
import { NavigationItem } from '../navigation-item';
import { SearchBoxComponent } from './searchbox.component';
import { appSettings } from '../header.component';
import Link from 'next/link';
import { filterUndefined$ } from '../nextPage';
import { map, take } from 'rxjs/operators';
import { flatMap$ } from '../../oith-lib/src/rx/flatMap$';

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
    this.setState({
      navItem: this.props.navItem,
      open: this.props.navItem.open,
    });
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
          <div className={`navigation-parent`}>
            <span
              onClick={() => {
                this.open(ni);
              }}
            >
              <span className={`title`}>{ni.title}</span>
              {/* <span className={`short-title`}>{ni.title}</span> */}
            </span>
            <div className={`navigation-child`}>
              {this.state.open ? (
                ni.navigationItems.map(n => <NavItem navItem={n} />)
              ) : (
                <></>
              )}
            </div>
          </div>
        );
      }
      return (
        <div>
          <OithLink href={ni.href} active={false}>
            <a className={`title`}>{ni.title}</a>
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

    appSettings.updatenavigation$
      .pipe(
        filterUndefined$,
        map(() =>
          appSettings.navigation$.pipe(
            take(1),
            filterUndefined$,
          ),
        ),
        flatMap$,
      )
      .subscribe(o => {
        this.setState({ navigation: undefined });
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
          <div>
            {this.state.navigation.navigationItems.map(ni => {
              return <NavItem navItem={ni} />;
            })}
          </div>
        </div>
      );
    }
    return <></>;
  }
}
