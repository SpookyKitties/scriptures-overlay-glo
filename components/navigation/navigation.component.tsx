import { Component } from 'react';
import { NavigationItem } from '../navigation-item';
import { SearchBoxComponent } from './searchbox.component';
import { appSettings } from '../header.component';
import Link from 'next/link';
import { filterUndefined$ } from '../nextPage';
import { map, take, delay } from 'rxjs/operators';
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

const isOpen = (open: boolean) => {
  return open ? 'open' : '';
};
class NavItem extends Component<{ navItem: NavigationItem }> {
  public state: { navItem: NavigationItem; open: boolean };
  componentDidMount() {
    this.setState({
      navItem: this.props.navItem,
      open: this.props.navItem.open,
    });

    appSettings.updatenavigation$.pipe(filterUndefined$).subscribe(o => {
      this.setState({
        open: this.props.navItem.open,
      });
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
              <span className={`title ${isOpen(ni.open)}`}>{ni.title}</span>
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
            <a className={`title  ${isOpen(ni.open)}`}>
              {ni.open}
              {ni.title}
            </a>
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
      console.log(o);

      appSettings.updatenavigation$.next(true);
    });

    appSettings.updatenavigation$
      .pipe(
        // filterUndefined$,
        delay(200),
        map(() => {
          const titleOpen = document.querySelector('a.title.open');

          if (titleOpen) {
            titleOpen.scrollIntoView();
          }

          // console.log(document.querySelector('.nav-items-holder').scrollHeight);
        }),
      )
      .subscribe(o => {
        // this.setState({ navigation: undefined });
        // this.setState({ navigation: o });
        console.log('huvrcrse');

        // setTimeout(() => {}, 100);
      });
  }
  public render() {
    if (this.state && this.state.navigation) {
      const n = this.state.navigation;

      return (
        <div className={`navigation`}>
          <SearchBoxComponent />
          <hr />
          <div id="library">
            <span>{this.state.navigation.title}</span>
          </div>
          <hr />
          <div className={`nav-items-holder`}>
            {this.state.navigation.navigationItems.map(ni => {
              return <NavItem navItem={ni} />;
            })}
            <div className={`white-space`}></div>
          </div>
        </div>
      );
    }
    return <></>;
  }
}
