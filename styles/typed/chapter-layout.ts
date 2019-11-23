import { style } from "typestyle";
import { Settings } from "../../components/header.component";

export const oithContentParent = style({
  width: "calc(100vw - 250px)",
  left: "250px",
  position: "absolute"
});

export function oithContentParent2(settings: Settings) {
  // const clientWidth =
}

// export const oithMain = style({
//   height: `100vh`,
//   width: `100vw`,
//   display: `grid`,
//   gridTemplateColumns: `0px 48px calc(100vh - 48px)`,
//   '&.with-logo':{}
// });

// .oith-main {
//   &.with-logo {
//     grid-template-rows: 48px 48px calc(100vh - 48px - 48px) !important;
//   }
//   .logo {
//     width: 100vw;
//     height: 48px;
//   }
//   .oith-header {
//     width: 100vw;
//     height: 48px;
//   }

//   .oith-content-parent {
//     @media screen and (max-width: 700px) {
//       display: grid;
//       &.large-notes {
//         grid-template-columns: 0 calc(100% - 250px) 250px;
//       }
//       &.small-notes {
//         grid-template-columns: 0 calc(100% - 250px) 250px;
//       }
//       @include mobileNav();
//     }
//     @media screen and (min-width: 768px) {
//       display: grid;
//       @include mobileNav();
//       @include oithContent(0, 350px);
//     }
//     @media screen and (min-width: 992px) {
//       display: grid;
//       @include oithContent(250px, 350px);
//     }
//     @media screen and (min-width: 1120px) {
//       display: grid;
//       @include oithContent(250px, 350px);
//     }
//     // >=768px	Medium
//     // >=992px	Large
//     // >=1200px
//   }
// }

// }
