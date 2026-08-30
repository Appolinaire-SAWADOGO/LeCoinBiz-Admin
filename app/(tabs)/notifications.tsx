import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminNotifications,
  sendGeneralNotification,
} from "../../services/firebase";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../../components/AppText";

const formatNotificationDate = (createdAt: any) => {
  const date = createdAt?._seconds
    ? new Date(createdAt._seconds * 1000)
    : (createdAt?.toDate?.() ?? (createdAt ? new Date(createdAt) : null));
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleString("fr-FR")
    : "—";
};

export default function NotificationsScreen() {
  const [showComposer, setShowComposer] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const queryClient = useQueryClient();
  const {
    data: notifications = [],
    isLoading,
    isError,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["notifications", "admin"],
    queryFn: getAdminNotifications,
  });

  const handleSendNotification = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert("Erreur", "Veuillez remplir le titre et le message");
      return;
    }

    Alert.alert(
      "Confirmer l'envoi",
      "Envoyer cette notification à tous les utilisateurs ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Envoyer",
          onPress: async () => {
            setSending(true);
            try {
              await sendGeneralNotification(title, body);
              Alert.alert(
                "Succès",
                "Notification générale envoyée à tous les utilisateurs",
              );

              // Réinitialiser le formulaire
              setTitle("");
              setBody("");
              setShowComposer(false);
              queryClient.invalidateQueries({
                queryKey: ["notifications", "admin"],
              });
            } catch (error: any) {
              console.error("Error sending notification:", error);
              Alert.alert(
                "Erreur",
                error.message || "Impossible d'envoyer la notification",
              );
            } finally {
              setSending(false);
            }
          },
        },
      ],
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={["#641BB4"]}
            tintColor="#641BB4"
          />
        }
      >
        <View style={styles.header}>
          <AppText style={styles.headerTitle}>Notifications</AppText>
        </View>

        <View style={styles.content}>
          <View style={styles.listHeader}>
            <AppText style={styles.sectionTitle}>Historique</AppText>
            <AppText style={styles.count}>{notifications.length}</AppText>
          </View>
          {isLoading && <ActivityIndicator color="#641BB4" />}
          {isError && (
            <AppText style={styles.statusText}>
              Impossible de charger les notifications.
            </AppText>
          )}
          {!isLoading && !isError && notifications.length === 0 && (
            <AppText style={styles.statusText}>
              Aucune notification envoyée.
            </AppText>
          )}
          {!isLoading &&
            !isError &&
            notifications.map((notification: any) => (
              <View key={notification.id} style={styles.notificationCard}>
                <View style={styles.notificationIcon}>
                  <Ionicons name="notifications" size={20} color="#641BB4" />
                </View>
                <View style={styles.notificationDetails}>
                  <AppText style={styles.notificationTitle}>
                    {notification.title || "Notification sans titre"}
                  </AppText>
                  <AppText style={styles.notificationBody}>
                    {notification.body || "Aucun message"}
                  </AppText>
                  <AppText style={styles.notificationDate}>
                    {formatNotificationDate(notification.createdAt)}
                  </AppText>
                </View>
              </View>
            ))}

          {!showComposer ? (
            <TouchableOpacity
              style={styles.newNotificationButton}
              onPress={() => setShowComposer(true)}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <AppText style={styles.sendButtonText}>
                Envoyer une notification générale
              </AppText>
            </TouchableOpacity>
          ) : (
            <View style={styles.composer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setShowComposer(false)}
              >
                <Ionicons name="arrow-back" size={20} color="#641BB4" />
                <AppText style={styles.backButtonText}>
                  Retour à l'historique
                </AppText>
              </TouchableOpacity>
              <AppText style={styles.sectionTitle}>
                Nouvelle notification générale
              </AppText>
              <View style={styles.inputContainer}>
                <AppText style={styles.label}>Titre *</AppText>
                <TextInput
                  style={styles.input}
                  placeholder="Titre de la notification"
                  value={title}
                  onChangeText={setTitle}
                  maxLength={100}
                />
                <AppText style={styles.charCount}>{title.length}/100</AppText>
              </View>

              <View style={styles.inputContainer}>
                <AppText style={styles.label}>Message *</AppText>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Contenu de la notification"
                  value={body}
                  onChangeText={setBody}
                  multiline
                  numberOfLines={6}
                  maxLength={500}
                  textAlignVertical="top"
                />
                <AppText style={styles.charCount}>{body.length}/500</AppText>
              </View>

              <View style={styles.previewContainer}>
                <AppText style={styles.previewTitle}>Aperçu</AppText>
                <View style={styles.previewCard}>
                  <View style={styles.previewHeader}>
                    <Ionicons name="notifications" size={20} color="#641BB4" />
                    <AppText style={styles.previewAppName}>LeCoinBiz</AppText>
                  </View>
                  <AppText style={styles.previewNotificationTitle}>
                    {title || "Titre de la notification"}
                  </AppText>
                  <AppText style={styles.previewNotificationBody}>
                    {body || "Contenu de la notification"}
                  </AppText>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.sendButton,
                  sending && styles.sendButtonDisabled,
                ]}
                onPress={handleSendNotification}
                disabled={sending}
              >
                {sending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="send" size={20} color="#fff" />
                    <AppText style={styles.sendButtonText}>
                      Envoyer la notification
                    </AppText>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
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
    color: "#fff",
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  count: {
    backgroundColor: "#641BB4",
    borderRadius: 12,
    color: "#fff",
    minWidth: 28,
    paddingHorizontal: 8,
    paddingVertical: 3,
    textAlign: "center",
  },
  statusText: {
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  notificationCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    marginBottom: 12,
    padding: 14,
  },
  notificationIcon: {
    alignItems: "center",
    backgroundColor: "#f0e8fb",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    marginRight: 12,
    width: 40,
  },
  notificationDetails: {
    flex: 1,
  },
  notificationTitle: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  notificationBody: {
    color: "#666",
    fontSize: 14,
    lineHeight: 19,
  },
  notificationDate: {
    color: "#999",
    fontSize: 12,
    marginTop: 8,
  },
  newNotificationButton: {
    alignItems: "center",
    backgroundColor: "#641BB4",
    borderRadius: 12,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 8,
    padding: 16,
  },
  composer: {
    marginTop: 8,
  },
  backButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  backButtonText: {
    color: "#641BB4",
    fontSize: 15,
    fontWeight: "bold",
  },
  typeContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#641BB4",
    gap: 8,
  },
  typeButtonActive: {
    backgroundColor: "#641BB4",
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#641BB4",
  },
  typeButtonTextActive: {
    color: "#fff",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
  },
  charCount: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 4,
  },
  previewContainer: {
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  previewCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  previewAppName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#641BB4",
  },
  previewNotificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  previewNotificationBody: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  sendButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  sendButtonDisabled: {
    backgroundColor: "#9E9E9E",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
