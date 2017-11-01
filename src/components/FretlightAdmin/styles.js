import { StyleSheet } from "react-native";
import { PrimaryBlue } from "../../design";

export const guitarModalStyles = {
  popover: {
    width: "100%",
    height: "100%",
    padding: 20,
    backgroundColor: "white"
  },
  toolbar: {
    flex: -1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    paddingBottom: 4
  },
  titleText: {
    flex: 1,
    fontSize: 22,
    fontWeight: "800"
  },
  doneButton: {
    flex: -1,
    height: 50,
    width: 50
  },
  doneText: {
    height: 50,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "left",
    marginLeft: 5,
    height: 50,
    textAlignVertical: "center",
    color: PrimaryBlue
  },
  bottomBar: {
    flex: -1,
    paddingTop: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopColor: "lightgray",
    borderTopWidth: 1
  },
  bottomButton: {
    flex: 1,
    maxWidth: 260,
    height: 50,
    marginHorizontal: 20
  },
  bottomButtonText: {
    flex: 1,
    fontSize: 18,
    textAlign: "center",
    textAlignVertical: "center",
    color: "white",
    backgroundColor: PrimaryBlue,
    borderRadius: 6
  }
};

export const guitarRowStyles = {
  container: {
    width: "100%",
    height: 110,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  icon: {
    width: 50,
    height: 50,
    marginHorizontal: 15
  },
  guitarNumber: {
    fontSize: 42,
    fontWeight: "100",
    marginHorizontal: 20,
    marginTop: -6
  },
  descriptionContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  description: {
    flex: -1,
    flexDirection: "column",
    justifyContent: "flex-start"
  },
  id: {
    width: "100%",
    height: 40,
    fontSize: 17,
    color: "lightgray",
    textAlignVertical: "center",
    marginVertical: -14
  },
  settings: {
    width: 120,
    height: "100%",
    padding: 10,
    justifyContent: "center",
    alignItems: "flex-end"
  },
  settingsButton: {
    flex: 1,
    height: 50,
    justifyContent: "center"
  },
  settingsButtonTextOn: {
    flex: 1,
    fontSize: 17,
    textAlignVertical: "center",
    color: PrimaryBlue
  },
  settingsButtonTextOff: {
    flex: 1,
    fontSize: 17,
    textAlignVertical: "center",
    color: "lightgray"
  }
};

export const nameModalStyles = {
  button: {
    height: 40,
    fontSize: 18,
    textAlignVertical: "center",
    color: PrimaryBlue
  },
  popover: {
    width: 500,
    height: 200,
    padding: 20,
    marginTop: -240,
    backgroundColor: "white"
  }
};

export const trackModalStyles = {
  popover: {
    position: "absolute",
    width: 400,
    padding: 20,
    backgroundColor: "white"
  },
  button: {
    height: 40,
    fontSize: 17,
    textAlignVertical: "center",
    color: "#44b5e8"
  },
  bottomButton: {
    flex: 1,
    maxWidth: 260,
    height: 50,
    marginHorizontal: 20,
    paddingHorizontal: 40,
    fontSize: 18,
    textAlign: "center",
    textAlignVertical: "center",
    color: "white",
    backgroundColor: PrimaryBlue,
    borderRadius: 6
  }
};
