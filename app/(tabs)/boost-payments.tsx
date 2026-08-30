import React from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../../components/AppText";
import {
  BoostPayment,
  useBoostPayments,
  useValidateBoostPayment,
} from "../../hooks/useBoostPayments";

const formatDate = (value: any) => {
  const date = value?._seconds
    ? new Date(value._seconds * 1000)
    : (value?.toDate?.() ?? (value ? new Date(value) : null));
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleString("fr-FR")
    : "Non renseignée";
};

const formatAmount = (amount?: number) =>
  typeof amount === "number"
    ? `${amount.toLocaleString("fr-FR")} FCFA`
    : "Non renseigné";

export default function BoostPaymentsScreen() {
  const {
    data: payments = [],
    isLoading,
    isError,
    isRefetching,
    refetch,
  } = useBoostPayments();
  const validationMutation = useValidateBoostPayment();

  const handleValidation = (
    payment: BoostPayment,
    action: "approve" | "reject",
  ) => {
    const isApproval = action === "approve";
    Alert.alert(
      isApproval ? "Valider le boost" : "Refuser le boost",
      isApproval
        ? "Le boost sera activé sur l'annonce. Continuer ?"
        : "Le paiement sera refusé et le boost retiré de l'annonce. Continuer ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: isApproval ? "Valider" : "Refuser",
          style: isApproval ? "default" : "destructive",
          onPress: async () => {
            try {
              const result = await validationMutation.mutateAsync({
                paymentId: payment.id,
                action,
              });
              if (result.status === "already_processed") {
                Alert.alert("Déjà traité", "Ce paiement a déjà été traité.");
              } else {
                Alert.alert(
                  "Succès",
                  isApproval ? "Boost activé." : "Boost refusé.",
                );
              }
            } catch (error: any) {
              console.error("Error validating boost payment:", error);
              Alert.alert(
                "Erreur",
                error?.message || "Impossible de traiter le paiement.",
              );
            }
          },
        },
      ],
    );
  };

  const renderPayment = ({ item }: { item: BoostPayment }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name="rocket-outline" size={22} color="#641BB4" />
        </View>
        <View style={styles.headerDetails}>
          <AppText style={styles.cardTitle}>Boost en attente</AppText>
          <AppText style={styles.paymentId}>Paiement : {item.id}</AppText>
        </View>
      </View>

      <View style={styles.details}>
        <AppText style={styles.detail}>
          Annonce : {item.adTitle || item.adId || "Non renseignée"}
        </AppText>
        <AppText style={styles.detail}>
          Utilisateur : {item.userId || "Non renseigné"}
        </AppText>
        <AppText style={styles.detail}>
          Montant : {formatAmount(item.price)}
        </AppText>
        <AppText style={styles.detail}>
          Durée : {item.days ? `${item.days} jour(s)` : "Non renseignée"}
        </AppText>
        <AppText style={styles.detail}>
          Début : {formatDate(item.startDate)}
        </AppText>
        <AppText style={styles.date}>
          Reçu le {formatDate(item.createdAt)}
        </AppText>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => handleValidation(item, "reject")}
          disabled={validationMutation.isPending}
        >
          <Ionicons name="close" size={18} color="#B42318" />
          <AppText style={styles.rejectText}>Refuser</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.approveButton]}
          onPress={() => handleValidation(item, "approve")}
          disabled={validationMutation.isPending}
        >
          <Ionicons name="checkmark" size={18} color="#fff" />
          <AppText style={styles.approveText}>Valider</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#641BB4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.title}>Paiements boost</AppText>
        <AppText style={styles.count}>{payments.length} en attente</AppText>
      </View>
      {isError ? (
        <View style={styles.center}>
          <AppText>Impossible de charger les paiements.</AppText>
        </View>
      ) : (
        <FlatList
          data={payments}
          renderItem={renderPayment}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <AppText>Aucun paiement boost en attente.</AppText>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  header: {
    backgroundColor: "#641BB4",
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  count: { color: "#E9D5FF", fontSize: 14, marginTop: 4 },
  list: { padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0E7FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerDetails: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: "bold" },
  paymentId: { color: "#777", fontSize: 12, marginTop: 3 },
  details: { borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 12 },
  detail: { color: "#444", fontSize: 14, marginBottom: 6 },
  date: { color: "#888", fontSize: 12, marginTop: 4 },
  actions: { flexDirection: "row", gap: 10, marginTop: 16 },
  button: {
    flex: 1,
    minHeight: 44,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  rejectButton: {
    backgroundColor: "#FEE4E2",
    borderWidth: 1,
    borderColor: "#FDA29B",
  },
  approveButton: { backgroundColor: "#198754" },
  rejectText: { color: "#B42318", fontWeight: "bold" },
  approveText: { color: "#fff", fontWeight: "bold" },
  empty: { alignItems: "center", marginTop: 50 },
});
