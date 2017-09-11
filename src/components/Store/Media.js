import React from "react";

import TabbedMedia from "./TabbedMedia";

class Media extends React.PureComponent {
  render() {
    return (
      <TabbedMedia media={this.props.media} onChoose={this.props.onChoose} />
    );
  }
}

export default Media;
