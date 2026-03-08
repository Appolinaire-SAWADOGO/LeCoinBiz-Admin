import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
} from "react-native";
import { AnnouncementType } from "../../types";
import {
  useReportedAds,
  useSetAdPending,
  useIgnoreReports,
} from "../../hooks/useReportedAds";
import AppText from "../../components/AppText";

type AdWithReports = AnnouncementType & {
  reportCount: number;
};

export default function ReportedAdsScreen() {
  const { data: ads = [], isLoading, refetch, isRefetching } = useReportedAds();
  const setAdPendingMutation = useSetAdPending();
  const ignoreReportsMutation = useIgnoreReports();

  const handleSetPending = async (ad: AdWithReports) => {
    Alert.alert(
      "Mettre en attente",
      `Voulez-vous mettre "${ad.title}" en attente pour révision ?\n\nSignalements: ${ad.reportCount}`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Confirmer",
          onPress: async () => {
            try {
              await setAdPendingMutation.mutateAsync({ adId: ad.id, ad });
              Alert.alert(
                "Succès",
                "Annonce mise en attente et notification envoyée",
              );
            } catch (error) {
              console.error("Error setting ad to pending:", error);
              Alert.alert("Erreur", "Impossible de modifier l'annonce");
            }
          },
        },
      ],
    );
  };

  const handleIgnore = async (ad: AdWithReports) => {
    Alert.alert(
      "Ignorer les signalements",
      `Voulez-vous ignorer les signalements pour "${ad.title}" ?\n\nL'annonce restera active.`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Ignorer",
          onPress: async () => {
            try {
              await ignoreReportsMutation.mutateAsync({ adId: ad.id });
              Alert.alert("Succès", "Signalements ignorés");
            } catch (error) {
              console.error("Error ignoring reports:", error);
              Alert.alert("Erreur", "Impossible d'ignorer les signalements");
            }
          },
        },
      ],
    );
  };

  const renderAdItem = ({ item }: { item: AdWithReports }) => (
    <View style={styles.adCard}>
      <View style={styles.reportBadge}>
        <AppText style={styles.reportBadgeText}>
          🚨 {item.reportCount} signalement(s)
        </AppText>
      </View>

      {item.images && item.images.length > 0 && (
        <Image source={{ uri: item.images[0] }} style={styles.adImage} />
      )}

      <View style={styles.adContent}>
        <AppText style={styles.adTitle}>{item.title}</AppText>
        <AppText style={styles.adPrice}>
          {item.price.toLocaleString()} FCFA
        </AppText>
        <AppText style={styles.adCategory}>
          {item.category} - {item.subCategory}
        </AppText>
        <AppText style={styles.adCity}>{item.city}</AppText>
        <AppText style={styles.adStatus}>Statut: {item.status}</AppText>
        <AppText style={styles.adDescription} numberOfLines={2}>
          {item.description}
        </AppText>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.pendingButton]}
            onPress={() => handleSetPending(item)}
            disabled={setAdPendingMutation.isPending}
          >
            <AppText style={styles.buttonText}>En attente</AppText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.ignoreButton]}
          onPress={() => handleIgnore(item)}
          disabled={ignoreReportsMutation.isPending}
        >
          <AppText style={styles.buttonText}>Ignorer</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#641BB4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.headerTitle}>Annonces signalées</AppText>
        <AppText style={styles.headerCount}>{ads.length} annonce(s)</AppText>
      </View>

      <FlatList
        data={ads}
        renderItem={renderAdItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AppText style={styles.emptyText}>Aucune annonce signalée</AppText>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  headerCount: {
    fontSize: 14,
    color: "#666",
  },
  listContainer: {
    padding: 16,
  },
  adCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: "#FF9800",
  },
  reportBadge: {
    backgroundColor: "#FF9800",
    padding: 8,
    alignItems: "center",
  },
  reportBadgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  adImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  adContent: {
    padding: 16,
  },
  adTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  adPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#641BB4",
    marginBottom: 4,
  },
  adCategory: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  adCity: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  adStatus: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF9800",
    marginBottom: 8,
  },
  adDescription: {
    fontSize: 14,
    color: "#333",
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  pendingButton: {
    backgroundColor: "#FF9800",
  },
  suspendButton: {
    backgroundColor: "#F44336",
  },
  ignoreButton: {
    backgroundColor: "#9E9E9E",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});
