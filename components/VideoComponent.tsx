import { Component } from 'react';
import { FormatGroup } from '../oith-lib/src/models/Chapter';
import axios from 'axios';
import { of } from 'rxjs';
import { flatMap, map, find } from 'rxjs/operators';
export class VideoComponent extends Component<{
  grp: FormatGroup;
  attrs: {};
}> {
  //   public state: { src: string } = { src: "" };
  public async componentDidMount() {
    this.props.attrs['src'];
    console.log(`localhost:4000/video?url=${this.props.attrs['src']}`);
    const u = `https://oith-function-test.azurewebsites.net/api/HttpTrigger?code=OaVlNwE4G3X/CMyIX77sL8fOtj2UyNlh/q8W2Ha79FlctEMb2F0dEQ==&url=${this.props.attrs['src']}`;
    console.log(u);

    try {
      console.log(u);

      await of(
        axios.get(u, {
          responseType: 'json',
        }),
      )
        .pipe(
          flatMap(o => o),
          map(o => {
            //
            // console.log(o.data);

            return (o.data as VideoData.RootObject).renditions;
          }),
          flatMap(o => o),
          find(o => typeof o.src === 'string' && o.container === 'MP4'),
          map(o => {
            if (o) {
              this.setState({ src: o.src });
            }
          }),
        )
        .toPromise();
      // console.log(`localhost:4000/video?url=${this.props.attrs['src']}`);
    } catch (error) {
      console.log(error);
    }
    // of(axios.get(this.props.attrs["src"] as string, { responseType: "json" }))
    //   .pipe(
    //     flatMap(o => o),
    //     map(o => {
    //       //
    //       return (o.data as VideoData.RootObject).renditions;
    //     }),
    //     flatMap(o => o),
    //     find(o => typeof o.src === "string" && o.container === "MP4"),
    //     map(o => {
    //       if (o) {
    //         this.setState({ src: o.src });
    //       }
    //     })
    //   )
    //   .subscribe();
  }

  public render() {
    return (
      <video
        controls={true}
        {...this.props.attrs}
        src={`${this.state ? this.state['src'] : ''}`}
      ></video>
    );
  }
}
export declare module VideoData {
  export interface Source {
    src: string;
  }

  export interface TextTrack {
    default: boolean;
    account_id: string;
    sources: Source[];
    src: string;
    mime_type: string;
    kind: string;
    srclang: string;
    id: string;
    label: string;
    asset_id?: any;
  }

  export interface Rendition {
    container: string;
    asset_id: string;
    encoding_rate: number;
    remote: boolean;
    duration: number;
    app_name: string;
    codec: string;
    stream_name: string;
    size: number;
    uploaded_at: Date;
    width: number;
    permalink: string;
    height: number;
    src: string;
    type: string;
  }

  export interface Source2 {
    src: string;
    width?: any;
    height?: any;
  }

  export interface Thumbnail {
    sources: Source2[];
    src: string;
    asset_id: string;
    remote: boolean;
  }

  export interface Source3 {
    src: string;
    width?: any;
    height?: any;
  }

  export interface Poster {
    sources: Source3[];
    src: string;
    asset_id: string;
    remote: boolean;
  }

  export interface Images {
    thumbnail: Thumbnail;
    poster: Poster;
  }

  export interface CustomFields {
    ipclearance: string;
    keywords: string;
    artist: string;
    topics: string;
    composer: string;
    album: string;
    trackid: string;
    tm_category: string;
    language: string;
    classification: string;
    preparer: string;
    filename: string;
    release_date: string;
    scriptures: string;
    speakers: string;
    genre: string;
    track: string;
  }

  export interface Sharing {
    to_external_acct: boolean;
    by_reference: boolean;
    by_external_acct: boolean;
    source_id: string;
    by_id: string;
  }

  export interface CreatedBy {
    type: string;
  }

  export interface UpdatedBy {
    type: string;
  }

  export interface RootObject {
    digital_master_id: string;
    has_digital_master: boolean;
    reference_id: string;
    link?: any;
    created_at: Date;
    description: string;
    playback_rights_id?: any;
    cue_points: any[];
    duration: number;
    geo?: any;
    original_filename: string;
    updated_at: Date;
    delivery_type: string;
    text_tracks: TextTrack[];
    renditions: Rendition[];
    id: string;
    projection?: any;
    state: string;
    published_at: Date;
    ad_keys?: any;
    thumbnailURL: string;
    videoStillURL: string;
    images: Images;
    custom_fields: CustomFields;
    long_description?: any;
    sharing: Sharing;
    created_by: CreatedBy;
    tags: string[];
    schedule?: any;
    economics: string;
    account_id: string;
    name: string;
    updated_by: UpdatedBy;
    clip_source_video_id?: any;
    complete: boolean;
    folder_id?: any;
  }
}
