import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "../config/firebase";
import { AnnouncementType } from "../types";
import functions from "@react-native-firebase/functions";

export const usePendingAds = () => {
  return useQuery({
    queryKey: ["ads", "pending"],
    queryFn: async () => {
      try {
        const snapshot = await db
          .collection("Ads")
          .where("status", "==", "PENDING")
          .get();
        const ads: AnnouncementType[] = [];

        snapshot.forEach((doc) => {
          ads.push({ id: doc.id, ...doc.data() } as AnnouncementType);
        });

        return ads;
      } catch (error) {
        console.log(
          "Erreur lors de la récupération des annonces en attente:",
          error,
        );
        return [];
      }
    },
  });
};

export const useActivateAd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      adId,
      ad,
    }: {
      adId: string;
      ad: AnnouncementType;
    }) => {
      const activateAdFunction = functions().httpsCallable("adminActivateAd");
      await activateAdFunction({
        adId,
        adTitle: ad.title,
        AdUserId: ad.userId,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads", "pending"] });
    },
  });
};
