import Header from "./header";
// import { NextPage } from "react";
import { ChapterComponent } from "../components/chapter.component";
import axios from "axios";
import { Chapter } from "../../oith-lib/src/models/Chapter";
import { NextPage } from "next";
import Layout from "../components/layout";
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

const Index: NextPage<{ a: string; chapter: Chapter }> = ({ a, chapter }) => (
  <div>
    <Layout title={chapter.title} shortTitle={chapter.shortTitle}></Layout>
    <Header t="1" />
    <h1>Batman TV Shows</h1>
    <ul>{a}</ul>
    <ChapterComponent chapter={chapter} />
  </div>
);

Index.getInitialProps = async () => {
  const a = "oiasjdf55555oiajsdf";
  const data = await axios.get("/scripture_files/eng-1-chr-4-chapter.json", {
    proxy: { port: 3000, host: "127.0.0.1" }
  });
  const chapter = (await data.data) as Chapter;
  console.log(chapter);

  return { a, chapter };
};

export default Index;
