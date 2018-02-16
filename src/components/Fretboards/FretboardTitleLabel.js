import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Text, StyleSheet } from "react-native";
import { getCurrentPattern } from "../../midi-store";

class FretboardTitleLabel extends React.Component {
  constructor(props) {
    super(props);
    this.isMounted_ = false;

    this.state = {
      patternName: undefined
    };
  }

  render() {
    const { track, isPhone, isSmart, assigned } = this.props;
    const fontSize = isPhone ? 13 : 16;

    var assignedLabel = "";
    if (assigned.length > 0 && track.name !== "chordsAndScales") {
      assigned.forEach(item => (assignedLabel += ` ${item.name},`));
      assignedLabel = assignedLabel.replace(/,\s*$/, "");
    }

    var title = "";
    if (track.name === "chordsAndScales" || track.name === "jamBar") {
      title = this.state.patternName || "";
    } else if (track !== undefined && track.name !== undefined && !isSmart) {
      title = track.name;
    }

    // break up title by ♭ but include  it
    title = title.replace("♭", "⌘♭⌘");
    const arr = title.split("⌘");

    if (title !== "" && assignedLabel !== "") {
      assignedLabel = " | " + assignedLabel;
    }

    return (
      <Text style={[styles.title, { fontSize }]}>
        {arr.map(function(str, index) {
          const style = str.includes("♭")
            ? [styles.keyFontFamily]
            : [styles.title];
          return (
            <Text key={index} style={style}>
              {str}
            </Text>
          );
        })}

        {!isSmart && (
          <Text
            numberOfLines={1}
            ellipsizeMode={"tail"}
            style={[styles.text, { fontSize }]}
          >
            {assignedLabel}
          </Text>
        )}
      </Text>
    );
  }

  componentDidMount() {
    this.isMounted_ = true;
    requestAnimationFrame(this.handleAnimationFrame);
  }

  componentWillUnmount() {
    this.isMounted_ = false;
  }

  handleAnimationFrame = () => {
    if (this.isMounted_ !== true) {
      return;
    }

    const { name } = getCurrentPattern();
    if (name !== this.state.patternName) {
      this.setState({ patternName: name });
    }

    if (this.isMounted_ === true) {
      requestAnimationFrame(this.handleAnimationFrame);
    }
  };
}

const styles = StyleSheet.create({
  title: { height: 24, textAlignVertical: "center" },
  text: { color: "#4e3200" },
  keyFontFamily: { fontFamily: "DejaVuSansMono" }
});

FretboardTitleLabel.propTypes = {
  track: PropTypes.object.isRequired,
  isPhone: PropTypes.bool.isRequired,
  isSmart: PropTypes.bool.isRequired,
  assigned: PropTypes.array.isRequired
};

const mapStateToProps = (state, ownProps) => {
  const assigned = state
    .get("guitars")
    .toJS()
    .filter(item => item.track === ownProps.track.name)
    .map((item, index) => {
      const name =
        item.name !== undefined
          ? item.name.replace("'s Fretlight", "")
          : `Fretlight ${index + 1}`;
      return { ...item, name };
    });

  return { assigned };
};

export default connect(mapStateToProps)(FretboardTitleLabel);
