import { Component } from "react";
import { FormatMerged } from "../oith-lib/src/models/Chapter";

export class FormatTag extends Component<{ft:FormatMerged}>{

    public render(){
    return <span>{this.props.ft.text}</span>
    }
}