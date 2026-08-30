import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import {
  useAllUsers,
  useAllAds,
  useChangeAdCategory,
} from "../../hooks/useDashboard";
import AppText from "../../components/AppText";
import { AnnouncementType, UserType } from "../../types";
import { CATEGORIES_NAMES, subCategoriesNames } from "../../utils/categories";

type Tab = "users" | "ads";
const STATUS_COLORS: Record<string, string> = {
  PENDING: "#F59E0B",
  ACTIVATED: "#10B981",
  REJECTED: "#EF4444",
  SUSPENDED: "#6B7280",
};

export default function DashboardScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("users");
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<
    Record<string, string>
  >({});
  const [selectedSubCategories, setSelectedSubCategories] = useState<
    Record<string, string>
  >({});
  const {
    data: users = [],
    isLoading: usersLoading,
    refetch: refetchUsers,
    isRefetching: isRefetchingUsers,
  } = useAllUsers();

  const {
    data: ads = [],
    isLoading: adsLoading,
    refetch: refetchAds,
    isRefetching: isRefetchingAds,
  } = useAllAds();

  const { mutateAsync: changeAdCategory, isPending: isUpdatingAdCategory } =
    useChangeAdCategory();

  const isLoading = usersLoading || adsLoading;
  const isRefreshing = isRefetchingUsers || isRefetchingAds;

  const handleRefresh = () => {
    refetchUsers();
    refetchAds();
  };

  const getAdSubCategory = (item: AnnouncementType) => {
    const raw = (item as AnnouncementType & { subcategory?: string })
      .subcategory;
    return item.subCategory || raw || "";
  };

  const handleStartEditAd = (item: AnnouncementType) => {
    const currentCategory = item.category || CATEGORIES_NAMES[0] || "";
    const availableSubs = subCategoriesNames(currentCategory);
    const currentSubCategory = getAdSubCategory(item);
    const nextSubCategory = availableSubs.includes(currentSubCategory)
      ? currentSubCategory
      : availableSubs[0] || "";

    setSelectedCategories((prev) => ({
      ...prev,
      [item.id]: currentCategory,
    }));
    setSelectedSubCategories((prev) => ({
      ...prev,
      [item.id]: nextSubCategory,
    }));
    setEditingAdId(item.id);
  };

  const handleSelectCategory = (adId: string, categoryName: string) => {
    const availableSubs = subCategoriesNames(categoryName);
    setSelectedCategories((prev) => ({
      ...prev,
      [adId]: categoryName,
    }));
    setSelectedSubCategories((prev) => ({
      ...prev,
      [adId]: availableSubs[0] || "",
    }));
  };

  const handleSaveAdCategory = async (adId: string) => {
    const category = selectedCategories[adId];
    const subCategory = selectedSubCategories[adId];

    if (!category || !subCategory) {
      Alert.alert(
        "Champs requis",
        "Merci de sélectionner une catégorie et une sous-catégorie.",
      );
      return;
    }

    try {
      await changeAdCategory({ adId, category, subCategory });
      setEditingAdId(null);
      Alert.alert("Succès", "Catégorie et sous-catégorie mises à jour.");
    } catch (error) {
      console.log("Erreur de mise à jour catégorie annonce:", error);
      Alert.alert(
        "Erreur",
        "Impossible de modifier la catégorie de cette annonce.",
      );
    }
  };

  const renderUserItem = ({ item }: { item: UserType }) => (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <AppText style={styles.avatarLetter}>
              {(item.userName || item.firstAndLastName || "?")[0].toUpperCase()}
            </AppText>
          </View>
        )}
        <View style={styles.cardInfo}>
          <AppText style={styles.cardTitle}>
            {item.firstAndLastName || item.userName}
          </AppText>
          <AppText style={styles.cardSubtitle}>{item.email}</AppText>
          <AppText style={styles.cardMeta}>
            {item.location?.city
              ? `${item.location.city}, ${item.location.country}`
              : "Localisation inconnue"}
          </AppText>
          <AppText style={styles.cardMeta}>
            Inscrit le{" "}
            {item.createdAt
              ? new Date(item.createdAt._seconds * 1000).toLocaleDateString(
                  "fr-FR",
                )
              : "—"}
          </AppText>
        </View>
      </View>
    </View>
  );

  const renderAdItem = ({ item }: { item: AnnouncementType }) => (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        {item.images && item.images.length > 0 ? (
          <Image source={{ uri: item.images[0] }} style={styles.adThumb} />
        ) : (
          <View style={[styles.adThumb, styles.adThumbPlaceholder]}>
            <AppText style={styles.adThumbText}>N/A</AppText>
          </View>
        )}
        <View style={styles.cardInfo}>
          <AppText style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </AppText>
          <AppText style={styles.adPrice}>
            {item.price.toLocaleString()} FCFA
          </AppText>
          <AppText style={styles.cardSubtitle}>
            {item.category} — {getAdSubCategory(item)}
          </AppText>
          <AppText style={styles.cardMeta}>{item.city}</AppText>
          <AppText style={styles.cardMeta}>
            {item.city} · {item.stats?.clicks ?? 0} clics
          </AppText>
          <AppText style={styles.cardMeta}>
            Publié le{" "}
            {item.createdAt
              ? new Date(item.createdAt._seconds * 1000).toLocaleDateString(
                  "fr-FR",
                )
              : "—"}
          </AppText>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: STATUS_COLORS[item.status] ?? "#6B7280" },
            ]}
          >
            <AppText style={styles.statusText}>{item.status}</AppText>
          </View>

          {editingAdId === item.id ? (
            <View style={styles.editSection}>
              <AppText style={styles.editLabel}>Catégorie</AppText>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsRow}
              >
                {CATEGORIES_NAMES.map((categoryName) => {
                  const active =
                    (selectedCategories[item.id] || item.category) ===
                    categoryName;

                  return (
                    <TouchableOpacity
                      key={`${item.id}-cat-${categoryName}`}
                      style={[styles.chip, active && styles.chipActive]}
                      onPress={() =>
                        handleSelectCategory(item.id, categoryName)
                      }
                    >
                      <AppText
                        style={[
                          styles.chipText,
                          active && styles.chipTextActive,
                        ]}
                      >
                        {categoryName}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <AppText style={styles.editLabel}>Sous-catégorie</AppText>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsRow}
              >
                {subCategoriesNames(
                  selectedCategories[item.id] || item.category,
                ).map((subCategoryName) => {
                  const active =
                    selectedSubCategories[item.id] === subCategoryName;

                  return (
                    <TouchableOpacity
                      key={`${item.id}-sub-${subCategoryName}`}
                      style={[styles.chip, active && styles.chipActive]}
                      onPress={() =>
                        setSelectedSubCategories((prev) => ({
                          ...prev,
                          [item.id]: subCategoryName,
                        }))
                      }
                    >
                      <AppText
                        style={[
                          styles.chipText,
                          active && styles.chipTextActive,
                        ]}
                      >
                        {subCategoryName}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={styles.editActionsRow}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={() => setEditingAdId(null)}
                  disabled={isUpdatingAdCategory}
                >
                  <AppText style={styles.cancelButtonText}>Annuler</AppText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={() => handleSaveAdCategory(item.id)}
                  disabled={isUpdatingAdCategory}
                >
                  <AppText style={styles.saveButtonText}>
                    {isUpdatingAdCategory ? "En cours..." : "Enregistrer"}
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.editToggleButton}
              onPress={() => handleStartEditAd(item)}
            >
              <AppText style={styles.editToggleText}>
                Modifier catégorie
              </AppText>
            </TouchableOpacity>
          )}
        </View>
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

  const dashboardHeader = (
    <View>
      {/* Stats cards */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <AppText style={styles.statNumber}>{users.length}</AppText>
          <AppText style={styles.statLabel}>Utilisateurs</AppText>
        </View>
        <View style={styles.statCard}>
          <AppText style={styles.statNumber}>{ads.length}</AppText>
          <AppText style={styles.statLabel}>Annonces</AppText>
        </View>
        <View style={styles.statCard}>
          <AppText style={styles.statNumber}>
            {ads.filter((a) => a.status === "ACTIVATED").length}
          </AppText>
          <AppText style={styles.statLabel}>Actives</AppText>
        </View>
        <View style={styles.statCard}>
          <AppText style={styles.statNumber}>
            {ads.filter((a) => a.status === "PENDING").length}
          </AppText>
          <AppText style={styles.statLabel}>En attente</AppText>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "users" && styles.tabActive]}
          onPress={() => setActiveTab("users")}
        >
          <AppText
            style={[
              styles.tabText,
              activeTab === "users" && styles.tabTextActive,
            ]}
          >
            Utilisateurs ({users.length})
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "ads" && styles.tabActive]}
          onPress={() => setActiveTab("ads")}
        >
          <AppText
            style={[
              styles.tabText,
              activeTab === "ads" && styles.tabTextActive,
            ]}
          >
            Annonces ({ads.length})
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );

  const refreshControl = (
    <RefreshControl
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
      colors={["#641BB4"]}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <AppText style={styles.headerTitle}>Dashboard</AppText>
      </View>

      {activeTab === "users" ? (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderUserItem}
          ListHeaderComponent={dashboardHeader}
          contentContainerStyle={styles.list}
          refreshControl={refreshControl}
          ListEmptyComponent={
            <AppText style={styles.emptyText}>
              Aucun utilisateur trouvé.
            </AppText>
          }
        />
      ) : (
        <FlatList
          data={ads}
          keyExtractor={(item) => item.id}
          renderItem={renderAdItem}
          ListHeaderComponent={dashboardHeader}
          contentContainerStyle={styles.list}
          refreshControl={refreshControl}
          ListEmptyComponent={
            <AppText style={styles.emptyText}>Aucune annonce trouvée.</AppText>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: "#641BB4",
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  statsRow: {
    flexDirection: "row",
    paddingVertical: 12,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#641BB4",
  },
  statLabel: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 2,
    textAlign: "center",
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 4,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: "#641BB4",
  },
  tabText: {
    fontSize: 13,
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  list: { paddingHorizontal: 12, paddingBottom: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardRow: { flexDirection: "row", gap: 12 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: "600", color: "#111" },
  cardSubtitle: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  cardMeta: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#641BB4",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  adThumb: { width: 64, height: 64, borderRadius: 8 },
  adThumbPlaceholder: {
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  adThumbText: { color: "#9CA3AF", fontSize: 11 },
  adPrice: { fontSize: 13, fontWeight: "600", color: "#641BB4", marginTop: 2 },
  statusBadge: {
    alignSelf: "flex-start",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
  },
  statusText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  editToggleButton: {
    marginTop: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#EFE7FA",
  },
  editToggleText: {
    color: "#641BB4",
    fontSize: 12,
    fontWeight: "600",
  },
  editSection: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 6,
  },
  editLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  chipsRow: {
    gap: 8,
    paddingRight: 6,
    paddingBottom: 4,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#fff",
  },
  chipActive: {
    borderColor: "#641BB4",
    backgroundColor: "#EEE5FA",
  },
  chipText: {
    fontSize: 12,
    color: "#4B5563",
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#641BB4",
  },
  editActionsRow: {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  actionButton: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
  },
  saveButton: {
    backgroundColor: "#641BB4",
  },
  cancelButtonText: {
    color: "#4B5563",
    fontSize: 12,
    fontWeight: "600",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  emptyText: { textAlign: "center", color: "#9CA3AF", marginTop: 40 },

  contactBarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 5,
  },
  contactBarLabel: {
    fontSize: 10,
    color: "#6B7280",
    width: 26,
    fontWeight: "600",
  },
  contactBarValue: {
    fontSize: 10,
    color: "#374151",
    width: 22,
    textAlign: "right",
    fontWeight: "600",
  },
  contactBarWA: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#641BB4",
    borderRadius: 999,
  },
  contactBarSMS: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#641BB4",
    borderRadius: 999,
  },
  contactBarCall: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#641BB4",
    borderRadius: 999,
  },
});
