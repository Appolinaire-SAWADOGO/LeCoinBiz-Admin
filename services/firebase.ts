import { cloudFunctions } from "../config/firebase";
import functions from "@react-native-firebase/functions";
import { firebasyeFunctions } from "../utils/firebase";

export const sendGeneralNotification = async (title: string, body: string) => {
  try {
    const createGeneralNotificationFunction = firebasyeFunctions.httpsCallable(
      "createGeneralNotification",
    );
    await createGeneralNotificationFunction({
      title,
      body,
    });
  } catch (error) {
    console.error("Error sending general notification:", error);
    throw error;
  }
};
