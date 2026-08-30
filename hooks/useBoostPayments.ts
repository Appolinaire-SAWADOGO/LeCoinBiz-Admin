import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminBoostPayments,
  validateBoostPayment,
} from "../services/firebase";

export type BoostPayment = {
  id: string;
  adId?: string;
  adTitle?: string;
  userId?: string;
  price?: number;
  days?: number;
  startDate?: any;
  createdAt?: any;
  status?: string;
  [key: string]: any;
};

export const useBoostPayments = () =>
  useQuery<BoostPayment[]>({
    queryKey: ["boost-payments", "pending"],
    queryFn: getAdminBoostPayments,
  });

export const useValidateBoostPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      paymentId,
      action,
    }: {
      paymentId: string;
      action: "approve" | "reject";
    }) => validateBoostPayment(paymentId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["boost-payments", "pending"],
      });
    },
  });
};
