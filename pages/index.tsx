import Header from './header';
// import { NextPage } from "react";
import { ChapterComponent } from '../components/chapter.component';
import axios from 'axios';
import { Chapter } from '../oith-lib/src/models/Chapter';
import { NextPage } from 'next';
import Layout from '../components/layout';
import { SearchBoxComponent } from '../components/navigation/searchbox.component';
import { Component } from 'react';
import { titleService } from '../components/TitleComponent';
import { NavigationItem } from '../components/navigation-item';
import { filterUndefined$, initnav } from '../components/nextPage';
import { appSettings } from '../components/SettingsComponent';
import { delay, map } from 'rxjs/operators';
import { NavItem } from '../components/navigation/NavItem';
// import { fetch } from "http";
function Testat() {
  return <h1>Test</h1>;
}

// export default function Index(props: string) {
//   return (
//     <div>
//       <Header />
//       {props}
//       <p>Hello Next.js</p>
//       <Testat />
//     </div>
//   );
// }

class Index extends Component {
  public state: { navigation: NavigationItem };

  componentDidMount() {
    appSettings.navigation$.subscribe(o => {
      this.setState({ navigation: o });
      initnav();
    });
    titleService.next(['Library', 'Library']);
  }
  render() {
    if (this.state && this.state.navigation) {
      const n = this.state.navigation;

      return (
        <div className={`navigation`}>
          <SearchBoxComponent />
          <hr />
          <div className={`nav-items-holder`}>
            {this.state.navigation.navigationItems.map(ni => {
              return <NavItem card={true} navItem={ni} />;
            })}
            <div className={`white-space`}></div>
          </div>
        </div>
      );
    }
    return <></>;
    return (
      <div className="oith-content">
        {/* <Layout title={chapter.title} shortTitle={chapter.shortTitle}></Layout> */}
        {/* <Header t="1" /> */}
        {/* <h1>Batman TV Shows</h1> */}
        {/* <ul>{a}</ul> */}
        {/* <ChapterComponent chapter={chapter} /> */}
        <SearchBoxComponent />
      </div>
    );
  }
}

const IndexPage: NextPage<{}> = ({}) => <Index></Index>;

IndexPage.getInitialProps = async () => {
  return {};
};

export default IndexPage;
