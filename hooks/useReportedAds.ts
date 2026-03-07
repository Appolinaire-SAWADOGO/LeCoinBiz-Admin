import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "../config/firebase";
import { AnnouncementType, ReportType } from "../types";
import functions from "@react-native-firebase/functions";
import { firebasyeFunctions } from "../utils/firebase";

type AdWithReports = AnnouncementType & {
  reportCount: number;
};
export const useReportedAds = () => {
  return useQuery({
    queryKey: ["ads", "reported"],
    queryFn: async () => {
      try {
        const reportAdsFunction =
          firebasyeFunctions.httpsCallable("adminGetReportAds");
        const rslt = (await reportAdsFunction()) as any;

        const ads: AdWithReports[] = rslt.data?.ads as AdWithReports[];

        return ads;
      } catch (error) {
        console.error(
          "erreur l'ors de la recuperations des annonces signalles !",
          error,
        );

        return [];
      }
    },
  });
};

export const useSetAdPending = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ adId, ad }: { adId: string; ad: AdWithReports }) => {
      const setPendingAdFunction =
        firebasyeFunctions.httpsCallable("adminSetAdPending");

      await setPendingAdFunction({
        adId,
        AdTitle: ad.title,
        AdUserId: ad.userId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads", "reported"] });
      queryClient.invalidateQueries({ queryKey: ["ads", "pending"] });
    },
  });
};

export const useIgnoreReports = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ adId }: { adId: string }) => {
      const ignoreReportsFunction = firebasyeFunctions.httpsCallable(
        "adminIgnoreAdReport",
      );

      await ignoreReportsFunction({ adId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads", "reported"] });
    },
  });
};
