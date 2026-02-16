import messaging from "@react-native-firebase/messaging";

export const subscribeToAdminTopic = async () => {
  try {
    await messaging().subscribeToTopic("admin");

    console.log("Abonné au topic admin.");
  } catch (error) {
    console.error("Erreur lors de l'abonnement au topic admin:", error);
  }
};
