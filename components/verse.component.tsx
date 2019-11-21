import { Verse } from "../oith-lib/src/models/Chapter";
import { renderFormatGroups } from "./chapter.component";
import { Component } from "react";

type VerseProps = {
  verse?: Verse;
};

export class VerseComponent extends Component<VerseProps> {
  public state: { verse?: Verse; highlight?: boolean };

  public constructor(props: VerseProps) {
    super(props);

    this.setState({ verse: props.verse });
  }
  public render() {
    const verse = this.props.verse;

    if (verse) {
      const elementName = verse.n.toLowerCase();

      switch (elementName) {
        case "p": {
          return <p id={verse.id}>{renderFormatGroups(verse.grps)}</p>;
        }
        case "h1": {
          return (
            <h1 {...verse.attrs} id={verse.id}>
              {renderFormatGroups(verse.grps)}
            </h1>
          );
        }
        case "h2": {
          return (
            <h2 {...verse.attrs} id={verse.id}>
              {renderFormatGroups(verse.grps)}
            </h2>
          );
        }
        case "h3": {
          return (
            <h3 {...verse.attrs} id={verse.id}>
              {renderFormatGroups(verse.grps)}
            </h3>
          );
        }
        case "h4": {
          return (
            <h4 {...verse.attrs} id={verse.id}>
              {renderFormatGroups(verse.grps)}
            </h4>
          );
        }
        default:
          return <div>Missing verse element {verse.n}</div>;
          break;
      }
    }
    return "";
  }
}

// export function renderVerse(verse?: Verse): JSX.Element {
//   if (verse) {
//     const elementName = verse.n.toLowerCase();

//     switch (elementName) {
//       case "p": {
//         return <p id={verse.id}>{renderFormatGroups(verse.grps)}</p>;
//       }
//       case "h1": {
//         return (
//           <h1 {...verse.attrs} id={verse.id}>
//             {renderFormatGroups(verse.grps)}
//           </h1>
//         );
//       }
//       case "h2": {
//         return (
//           <h2 {...verse.attrs} id={verse.id}>
//             {renderFormatGroups(verse.grps)}
//           </h2>
//         );
//       }
//       case "h3": {
//         return (
//           <h3 {...verse.attrs} id={verse.id}>
//             {renderFormatGroups(verse.grps)}
//           </h3>
//         );
//       }
//       case "h4": {
//         return (
//           <h4 {...verse.attrs} id={verse.id}>
//             {renderFormatGroups(verse.grps)}
//           </h4>
//         );
//       }
//       default:
//         return <div>Missing verse element {verse.n}</div>;
//         break;
//     }
//   }
//   return;
// }
