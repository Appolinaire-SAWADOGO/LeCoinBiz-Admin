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
import { usePendingAds, useActivateAd } from "../../hooks/usePendingAds";
import AppText from "../../components/AppText";

export default function PendingAdsScreen() {
  const { data: ads = [], isLoading, refetch, isRefetching } = usePendingAds();
  const activateAdMutation = useActivateAd();

  const handleActivate = async (ad: AnnouncementType) => {
    Alert.alert("Activer l'annonce", `Voulez-vous activer "${ad.title}" ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Activer",
        onPress: async () => {
          try {
            await activateAdMutation.mutateAsync({ adId: ad.id, ad });
            Alert.alert("Succès", "Annonce activée et notification envoyée");
          } catch (error) {
            console.error("Error activating ad:", error);
            Alert.alert("Erreur", "Impossible d'activer l'annonce");
          }
        },
      },
    ]);
  };

  const renderAdItem = ({ item }: { item: AnnouncementType }) => (
    <View style={styles.adCard}>
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
        <AppText style={styles.adDescription} numberOfLines={2}>
          {item.description}
        </AppText>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.activateButton]}
            onPress={() => handleActivate(item)}
            disabled={activateAdMutation.isPending}
          >
            <AppText style={styles.buttonText}>Activer</AppText>
          </TouchableOpacity>
        </View>
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
        <AppText style={styles.headerTitle}>Annonces en attente</AppText>
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
            <AppText style={styles.emptyText}>
              Aucune annonce en attente
            </AppText>
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
    backgroundColor: "#641BB4",
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#fff",
  },
  headerCount: {
    fontSize: 14,
    color: "#E9D5FF",
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
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  activateButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#F44336",
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
