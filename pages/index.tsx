import Header from './header';
// import { NextPage } from "react";
import { ChapterComponent } from '../components/chapter.component';
import axios from 'axios';
import { Chapter } from '../oith-lib/src/models/Chapter';
import { NextPage } from 'next';
import Layout from '../components/layout';
import { SearchBoxComponent } from '../components/navigation/searchbox.component';
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

const Index: NextPage<{}> = ({}) => (
  <div className="oith-content">
    {/* <Layout title={chapter.title} shortTitle={chapter.shortTitle}></Layout> */}
    {/* <Header t="1" /> */}
    {/* <h1>Batman TV Shows</h1> */}
    {/* <ul>{a}</ul> */}
    {/* <ChapterComponent chapter={chapter} /> */}
    <SearchBoxComponent />
  </div>
);

Index.getInitialProps = async () => {
  return {};
};

export default Index;
