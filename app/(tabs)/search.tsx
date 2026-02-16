import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AnnouncementType } from '../../types';
import { useSearchAds } from '../../hooks/useSearchAds';
import { Ionicons } from '@expo/vector-icons';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  const { data: ads = [], isLoading, isFetching } = useSearchAds(debouncedQuery);

  const handleSearch = () => {
    setDebouncedQuery(searchQuery);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVATED':
        return '#4CAF50';
      case 'PENDING':
        return '#FF9800';
      case 'REJECTED':
        return '#F44336';
      case 'SUSPENDED':
        return '#9E9E9E';
      default:
        return '#666';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVATED':
        return 'Activée';
      case 'PENDING':
        return 'En attente';
      case 'REJECTED':
        return 'Rejetée';
      case 'SUSPENDED':
        return 'Suspendue';
      default:
        return status;
    }
  };

  const renderAdItem = ({ item }: { item: AnnouncementType }) => (
    <View style={styles.adCard}>
      {item.images && item.images.length > 0 && (
        <Image source={{ uri: item.images[0] }} style={styles.adImage} />
      )}
      
      <View style={styles.adContent}>
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusLabel(item.status)}
          </Text>
        </View>

        <Text style={styles.adTitle}>{item.title}</Text>
        <Text style={styles.adPrice}>{item.price.toLocaleString()} FCFA</Text>
        <Text style={styles.adCategory}>{item.category} - {item.subCategory}</Text>
        <Text style={styles.adCity}>📍 {item.city}</Text>
        <Text style={styles.adDescription} numberOfLines={3}>{item.description}</Text>
        
        <View style={styles.adMeta}>
          <Text style={styles.adMetaText}>👁️ {item.stats?.views || 0} vues</Text>
          <Text style={styles.adMetaText}>❤️ {item.stats?.favorites || 0} favoris</Text>
          <Text style={styles.adMetaText}>👆 {item.stats?.clicks || 0} clics</Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}>User ID: {item.userId}</Text>
          <Text style={styles.userInfoText}>📞 {item.phoneNumber}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recherche d'annonces</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher par titre..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => {
              setSearchQuery('');
              setDebouncedQuery('');
            }}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={isLoading || !searchQuery.trim()}
        >
          <Text style={styles.searchButtonText}>Rechercher</Text>
        </TouchableOpacity>
      </View>

      {isLoading || isFetching ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Recherche en cours...</Text>
        </View>
      ) : (
        <FlatList
          data={ads}
          renderItem={renderAdItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            debouncedQuery ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>
                  {searchQuery ? `Aucune annonce trouvée pour "${debouncedQuery}"` : 'Aucun résultat'}
                </Text>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="newspaper-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>Recherchez une annonce par son titre</Text>
              </View>
            )
          }
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  adCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  adImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  adContent: {
    padding: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  adTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  adPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  adCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  adCity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  adDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  adMeta: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
  },
  adMetaText: {
    fontSize: 12,
    color: '#666',
  },
  userInfo: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  userInfoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
});
