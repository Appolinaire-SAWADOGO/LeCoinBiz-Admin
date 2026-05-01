import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { sendGeneralNotification } from "../../services/firebase";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../../components/AppText";

type NotificationType = "general" | "user";

export default function NotificationsScreen() {
  const [notificationType, setNotificationType] =
    useState<NotificationType>("general");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [userId, setUserId] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendNotification = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert("Erreur", "Veuillez remplir le titre et le message");
      return;
    }

    if (notificationType === "user" && !userId.trim()) {
      Alert.alert("Erreur", "Veuillez entrer l'ID de l'utilisateur");
      return;
    }

    Alert.alert(
      "Confirmer l'envoi",
      notificationType === "general"
        ? "Envoyer cette notification à tous les utilisateurs ?"
        : `Envoyer cette notification à l'utilisateur ${userId} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Envoyer",
          onPress: async () => {
            setSending(true);
            try {
              if (notificationType === "general") {
                await sendGeneralNotification(title, body);
                Alert.alert(
                  "Succès",
                  "Notification générale envoyée à tous les utilisateurs",
                );
              }

              // Réinitialiser le formulaire
              setTitle("");
              setBody("");
              setUserId("");
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <AppText style={styles.headerTitle}>Envoyer une notification</AppText>
        </View>

        <View style={styles.content}>
          <AppText style={styles.sectionTitle}>Type de notification</AppText>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                notificationType === "general" && styles.typeButtonActive,
              ]}
              onPress={() => setNotificationType("general")}
            >
              <Ionicons
                name="people"
                size={24}
                color={notificationType === "general" ? "#fff" : "#641BB4"}
              />
              <AppText
                style={[
                  styles.typeButtonText,
                  notificationType === "general" && styles.typeButtonTextActive,
                ]}
              >
                Générale
              </AppText>
            </TouchableOpacity>
          </View>

          {notificationType === "user" && (
            <View style={styles.inputContainer}>
              <AppText style={styles.label}>ID Utilisateur *</AppText>
              <TextInput
                style={styles.input}
                placeholder="Entrez l'ID de l'utilisateur"
                value={userId}
                onChangeText={setUserId}
                autoCapitalize="none"
              />
            </View>
          )}

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
            style={[styles.sendButton, sending && styles.sendButtonDisabled]}
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
