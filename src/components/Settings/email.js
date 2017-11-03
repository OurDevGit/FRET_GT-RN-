import Mailer from "react-native-mail";
import { Alert } from "react-native";

export const sendSupportEmail = () => {
  Mailer.mail(
    {
      subject: "Guitar Tunes Feedback",
      recipients: ["support@guitartunes.com"],
      body: "",
      isHTML: true
    },
    (error, event) => {
      Alert.alert(
        error,
        event,
        [
          {
            text: "Ok",
            onPress: () => console.log("OK: Email Error Response")
          },
          {
            text: "Cancel",
            onPress: () => console.log("CANCEL: Email Error Response")
          }
        ],
        { cancelable: true }
      );
    }
  );
};
