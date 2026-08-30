import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "../config/firebase";
import { AnnouncementType, UserType } from "../types";
import { firebasyeFunctions } from "../utils/firebase";

type AdminGetUsersResponse = {
  users: UserType[];
  total: number;
};

export const useAllUsers = () => {
  return useQuery({
    queryKey: ["users", "all"],
    queryFn: async () => {
      try {
        const adminGetUsersFunction =
          firebasyeFunctions.httpsCallable("adminGetUsers");
        const result = await adminGetUsersFunction();
        const data = result.data as AdminGetUsersResponse | undefined;
        const users = data?.users ?? [];

        return users.sort((a, b) => {
          const aSeconds = a.createdAt?._seconds ?? 0;
          const bSeconds = b.createdAt?._seconds ?? 0;
          const aNanos = a.createdAt?._nanoseconds ?? 0;
          const bNanos = b.createdAt?._nanoseconds ?? 0;

          if (bSeconds !== aSeconds) {
            return bSeconds - aSeconds;
          }

          return bNanos - aNanos;
        });
      } catch (error) {
        console.log("Erreur lors de la récupération des utilisateurs:", error);
        return [];
      }
    },
  });
};

export const useAllAds = () => {
  return useQuery({
    queryKey: ["ads", "all"],
    queryFn: async () => {
      try {
        const snapshot = await db.collection("Ads").get();
        const ads: AnnouncementType[] = [];
        snapshot.forEach((doc) => {
          const raw = doc.data() as AnnouncementType & {
            subcategory?: string;
          };
          const { id: _ignoredId, ...rest } = raw;

          ads.push({
            id: doc.id,
            ...rest,
            subCategory: raw.subcategory ?? raw.subCategory,
          } as AnnouncementType);
        });

        return ads.sort((a, b) => {
          const aSeconds = a.createdAt?._seconds ?? 0;
          const bSeconds = b.createdAt?._seconds ?? 0;
          const aNanos = a.createdAt?._nanoseconds ?? 0;
          const bNanos = b.createdAt?._nanoseconds ?? 0;

          if (bSeconds !== aSeconds) {
            return bSeconds - aSeconds;
          }

          return bNanos - aNanos;
        });
      } catch (error) {
        console.log("Erreur lors de la récupération des annonces:", error);
        return [];
      }
    },
  });
};

type ChangeAdCategoryPayload = {
  adId: string;
  category: string;
  subCategory: string;
};

export const useChangeAdCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      adId,
      category,
      subCategory,
    }: ChangeAdCategoryPayload) => {
      const adminChangeAdCatAndSubCatById = firebasyeFunctions.httpsCallable(
        "adminChangeAdCatAndSubCatById",
      );

      await adminChangeAdCatAndSubCatById({
        adId,
        category,
        subCategory,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["ads", "all"] });
    },
  });
};
