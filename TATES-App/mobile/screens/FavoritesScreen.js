import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar, Alert, RefreshControl } from 'react-native';
import { Colors, Shadows, Spacing, BorderRadius } from '../constants/Colors';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, recent, popular

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('http://192.168.1.102:3000/api/profile/favorites', {
        headers: {
          'Authorization': `Bearer ${global.token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || []);
      } else {
        // Demo veriler göster
        setFavorites([
          {
            id: 1,
            recipe: {
              id: 1,
              title: 'Ev Yapımı Pizza',
              description: 'Lezzetli ev yapımı pizza tarifi',
              imageUrl: null,
              likes: 25,
              category: { name: 'Ana Yemek', color: '#4ECDC4' }
            },
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            recipe: {
              id: 2,
              title: 'Çikolatalı Kek',
              description: 'Nemli ve lezzetli çikolatalı kek',
              imageUrl: null,
              likes: 18,
              category: { name: 'Tatlı', color: '#FFEAA7' }
            },
            createdAt: new Date().toISOString()
          },
          {
            id: 3,
            recipe: {
              id: 3,
              title: 'Mercimek Çorbası',
              description: 'Sıcak ve besleyici mercimek çorbası',
              imageUrl: null,
              likes: 12,
              category: { name: 'Çorba', color: '#45B7D1' }
            },
            createdAt: new Date().toISOString()
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      Alert.alert('Hata', 'Favoriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFavorites();
    setRefreshing(false);
  };

  const handleRemoveFavorite = async (recipeId) => {
    try {
      const response = await fetch(`http://192.168.1.102:3000/api/recipes/${recipeId}/favorite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        // Favorilerden kaldır
        setFavorites(favorites.filter(fav => fav.recipe.id !== recipeId));
        Alert.alert('Başarılı', 'Tarif favorilerden kaldırıldı!');
      }
    } catch (error) {
      Alert.alert('Hata', 'Favori kaldırma işlemi başarısız.');
    }
  };

  const handleRecipePress = (recipe) => {
    navigation.navigate('RecipeDetailScreen', { recipe });
  };

  const filteredFavorites = favorites.filter(favorite => {
    if (filter === 'recent') {
      // Son 7 gün içinde eklenenler
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(favorite.createdAt) > weekAgo;
    } else if (filter === 'popular') {
      return favorite.recipe.likes > 10;
    }
    return true;
  });

  const FilterButton = ({ title, isActive, onPress }) => (
    <TouchableOpacity 
      style={[styles.filterButton, isActive && styles.activeFilterButton]}
      onPress={onPress}
    >
      <Text style={[styles.filterText, isActive && styles.activeFilterText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const FavoriteCard = ({ favorite }) => (
    <TouchableOpacity
      style={styles.favoriteCard}
      onPress={() => handleRecipePress(favorite.recipe)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: favorite.recipe.category?.color || Colors.primary }]}>
          <Text style={styles.categoryText}>{favorite.recipe.category?.name || 'Genel'}</Text>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFavorite(favorite.recipe.id)}
        >
          <Text style={styles.removeIcon}>✕</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.recipeImageContainer}>
        {favorite.recipe.imageUrl ? (
          <Image source={{ uri: `http://192.168.1.102:3000${favorite.recipe.imageUrl}` }} style={styles.recipeImage} />
        ) : (
          <View style={styles.recipeImagePlaceholder}>
            <Text style={styles.recipeImageIcon}>🍽️</Text>
          </View>
        )}
      </View>
      
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle} numberOfLines={2}>{favorite.recipe.title}</Text>
        <Text style={styles.recipeDescription} numberOfLines={2}>{favorite.recipe.description}</Text>
        
        <View style={styles.recipeMeta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>❤️</Text>
            <Text style={styles.metaText}>{favorite.recipe.likes}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>📅</Text>
            <Text style={styles.metaText}>
              {new Date(favorite.createdAt).toLocaleDateString('tr-TR')}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Favorilerim</Text>
          <Text style={styles.headerSubtitle}>{favorites.length} tarif</Text>
        </View>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={onRefresh}
        >
          <Text style={styles.refreshIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <FilterButton 
          title="Tümü" 
          isActive={filter === 'all'} 
          onPress={() => setFilter('all')} 
        />
        <FilterButton 
          title="Son Eklenen" 
          isActive={filter === 'recent'} 
          onPress={() => setFilter('recent')} 
        />
        <FilterButton 
          title="Popüler" 
          isActive={filter === 'popular'} 
          onPress={() => setFilter('popular')} 
        />
      </View>

      {/* Favorites List */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Favoriler yükleniyor...</Text>
          </View>
        ) : filteredFavorites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>⭐</Text>
            <Text style={styles.emptyTitle}>
              {filter === 'all' ? 'Henüz favori tarifiniz yok' : 'Bu kriterlere uygun favori bulunamadı'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {filter === 'all' 
                ? 'Beğendiğiniz tarifleri favorilere ekleyerek burada görebilirsiniz.'
                : 'Farklı filtreler deneyebilirsiniz.'
              }
            </Text>
            {filter !== 'all' && (
              <TouchableOpacity 
                style={styles.clearFilterButton}
                onPress={() => setFilter('all')}
              >
                <Text style={styles.clearFilterText}>Filtreyi Temizle</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.favoritesList}>
            {filteredFavorites.map((favorite) => (
              <FavoriteCard key={favorite.id} favorite={favorite} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    ...Shadows.medium,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.small,
  },
  backIcon: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.primaryLight,
    marginTop: 2,
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.small,
  },
  refreshIcon: {
    fontSize: 18,
    color: Colors.primary,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  filterButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },
  activeFilterButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeFilterText: {
    color: Colors.white,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
    lineHeight: 24,
  },
  clearFilterButton: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.round,
  },
  clearFilterText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  favoritesList: {
    gap: Spacing.md,
  },
  favoriteCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.white,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: 'bold',
  },
  recipeImageContainer: {
    height: 150,
    backgroundColor: Colors.gray200,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  recipeImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray200,
  },
  recipeImageIcon: {
    fontSize: 32,
    color: Colors.textSecondary,
  },
  recipeInfo: {
    padding: Spacing.md,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  recipeDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  recipeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
});
