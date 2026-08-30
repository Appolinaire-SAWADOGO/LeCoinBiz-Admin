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

export const getAdminNotifications = async () => {
  try {
    const getNotificationsFunction =
      firebasyeFunctions.httpsCallable("getNotifications");
    const result = await getNotificationsFunction({ isAdmin: true });
    return (result.data as { notifications?: any[] }).notifications ?? [];
  } catch (error) {
    console.error("Error getting admin notifications:", error);
    throw error;
  }
};

export const getAdminBoostPayments = async () => {
  try {
    const getBoostPaymentsFunction = firebasyeFunctions.httpsCallable(
      "adminGetBoostPayments",
    );
    const result = await getBoostPaymentsFunction();
    return (result.data as any[]) ?? [];
  } catch (error) {
    console.error("Error getting admin boost payments:", error);
    throw error;
  }
};

export const validateBoostPayment = async (
  paymentId: string,
  action: "approve" | "reject",
) => {
  const validateBoostPaymentFunction = firebasyeFunctions.httpsCallable(
    "validateBoostPayment",
  );
  const result = await validateBoostPaymentFunction({ paymentId, action });
  return result.data as { status: string };
};
