import React from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import PageControl from "react-native-page-control";
import Container from "./Container";

class FretboardsRoot extends React.PureComponent {
  state = {
    selectedIndex: 0,
  };
  
  render() {
    console.log("rendering index", this.state.selectedIndex)
    return (
      <View style={{ width: "100%", aspectRatio: 4, backgroundColor: "#E6D9B9"}}>
        <Container tracks={this.props.tracks} onScrollEnd={this.onScrollEnd.bind(this)} />
        <PageControl 
          style={{position:'absolute', left:0, right:0, bottom:7}}
          numberOfPages={this.props.tracks.count()}
          currentPage={this.state.selectedIndex}
          hidesForSinglePage={true}
          pageIndicatorTintColor='gray'
          currentPageIndicatorTintColor='white'
          indicatorStyle={{borderRadius: 5}} 
          currentIndicatorStyle={{borderRadius: 5}}
          indicatorSize={{width:8, height:8}} 
        />
      </View>
    );
  }

  onScrollEnd(e) {
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = e.nativeEvent.layoutMeasurement;

    // Divide the horizontal offset by the width of the view to see which page is visible
    let page = Math.floor(contentOffset.x / viewSize.width);
    this.setState({ selectedIndex: page });
  }
}

const mapStateToProps = (state, props) => {
  return {
    tracks: state.get("guitarTracks")
  };
};

export default connect(mapStateToProps, null)(FretboardsRoot);


