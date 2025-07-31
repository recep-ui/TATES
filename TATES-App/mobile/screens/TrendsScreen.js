import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar, Alert, RefreshControl } from 'react-native';
import { Colors, Shadows, Spacing, BorderRadius } from '../constants/Colors';

export default function TrendsScreen({ navigation }) {
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [popularCategories, setPopularCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeFilter, setTimeFilter] = useState('week'); // week, month, all

  useEffect(() => {
    fetchTrendingData();
  }, [timeFilter]);

  const fetchTrendingData = async () => {
    try {
      // Trending recipes
      const recipesResponse = await fetch(`http://192.168.1.102:3000/api/recipes/trending?time=${timeFilter}`);
      if (recipesResponse.ok) {
        const data = await recipesResponse.json();
        setTrendingRecipes(data.recipes || []);
      } else {
        // Demo veriler göster
        setTrendingRecipes([
          {
            id: 1,
            title: 'Ev Yapımı Pizza',
            description: 'Bu hafta en çok beğenilen tarif',
            imageUrl: null,
            likes: 156,
            views: 2340,
            category: { name: 'Ana Yemek', color: '#4ECDC4' },
            trend: 'up'
          },
          {
            id: 2,
            title: 'Çikolatalı Kek',
            description: 'Viral olan nemli kek tarifi',
            imageUrl: null,
            likes: 89,
            views: 1890,
            category: { name: 'Tatlı', color: '#FFEAA7' },
            trend: 'up'
          },
          {
            id: 3,
            title: 'Mercimek Çorbası',
            description: 'Sağlıklı ve lezzetli çorba',
            imageUrl: null,
            likes: 67,
            views: 1450,
            category: { name: 'Çorba', color: '#45B7D1' },
            trend: 'stable'
          }
        ]);
      }

      // Popular categories
      const categoriesResponse = await fetch('http://192.168.1.102:3000/api/categories/popular');
      if (categoriesResponse.ok) {
        const data = await categoriesResponse.json();
        setPopularCategories(data.categories || []);
      } else {
        // Demo veriler göster
        setPopularCategories([
          { id: 1, name: 'Ana Yemek', icon: '🍖', color: '#4ECDC4', recipeCount: 45, trend: 'up' },
          { id: 2, name: 'Tatlı', icon: '🍰', color: '#FFEAA7', recipeCount: 32, trend: 'up' },
          { id: 3, name: 'Kahvaltı', icon: '🍳', color: '#FF6B6B', recipeCount: 28, trend: 'stable' },
          { id: 4, name: 'Salata', icon: '🥗', color: '#96CEB4', recipeCount: 23, trend: 'down' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching trending data:', error);
      Alert.alert('Hata', 'Trend verileri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTrendingData();
    setRefreshing(false);
  };

  const handleRecipePress = (recipe) => {
    navigation.navigate('RecipeDetailScreen', { recipe });
  };

  const handleCategoryPress = (category) => {
    navigation.navigate('Categories', { selectedCategory: category });
  };

  const TimeFilterButton = ({ title, value, isActive, onPress }) => (
    <TouchableOpacity 
      style={[styles.timeFilterButton, isActive && styles.activeTimeFilterButton]}
      onPress={onPress}
    >
      <Text style={[styles.timeFilterText, isActive && styles.activeTimeFilterText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const TrendingRecipeCard = ({ recipe, index }) => (
    <TouchableOpacity
      style={styles.trendingCard}
      onPress={() => handleRecipePress(recipe)}
      activeOpacity={0.8}
    >
      <View style={styles.trendingRank}>
        <Text style={styles.rankText}>#{index + 1}</Text>
        <Text style={styles.trendIcon}>
          {recipe.trend === 'up' ? '📈' : recipe.trend === 'down' ? '📉' : '➡️'}
        </Text>
      </View>
      
      <View style={styles.recipeImageContainer}>
        {recipe.imageUrl ? (
          <Image source={{ uri: `http://192.168.1.102:3000${recipe.imageUrl}` }} style={styles.recipeImage} />
        ) : (
          <View style={styles.recipeImagePlaceholder}>
            <Text style={styles.recipeImageIcon}>🍽️</Text>
          </View>
        )}
      </View>
      
      <View style={styles.recipeInfo}>
        <View style={[styles.categoryBadge, { backgroundColor: recipe.category?.color || Colors.primary }]}>
          <Text style={styles.categoryText}>{recipe.category?.name || 'Genel'}</Text>
        </View>
        <Text style={styles.recipeTitle} numberOfLines={2}>{recipe.title}</Text>
        <Text style={styles.recipeDescription} numberOfLines={2}>{recipe.description}</Text>
        
        <View style={styles.recipeStats}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>❤️</Text>
            <Text style={styles.statText}>{recipe.likes}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>👁️</Text>
            <Text style={styles.statText}>{recipe.views}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const CategoryTrendCard = ({ category, index }) => (
    <TouchableOpacity
      style={styles.categoryTrendCard}
      onPress={() => handleCategoryPress(category)}
      activeOpacity={0.8}
    >
      <View style={styles.categoryTrendHeader}>
        <Text style={styles.categoryTrendIcon}>{category.icon}</Text>
        <Text style={styles.categoryTrendIcon}>
          {category.trend === 'up' ? '📈' : category.trend === 'down' ? '📉' : '➡️'}
        </Text>
      </View>
      
      <Text style={styles.categoryTrendName}>{category.name}</Text>
      <Text style={styles.categoryTrendCount}>{category.recipeCount} tarif</Text>
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
          <Text style={styles.headerTitle}>Trendler</Text>
          <Text style={styles.headerSubtitle}>En popüler tarifler ve kategoriler</Text>
        </View>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={onRefresh}
        >
          <Text style={styles.refreshIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Time Filter */}
      <View style={styles.timeFilterContainer}>
        <TimeFilterButton 
          title="Bu Hafta" 
          value="week"
          isActive={timeFilter === 'week'} 
          onPress={() => setTimeFilter('week')} 
        />
        <TimeFilterButton 
          title="Bu Ay" 
          value="month"
          isActive={timeFilter === 'month'} 
          onPress={() => setTimeFilter('month')} 
        />
        <TimeFilterButton 
          title="Tüm Zamanlar" 
          value="all"
          isActive={timeFilter === 'all'} 
          onPress={() => setTimeFilter('all')} 
        />
      </View>

      {/* Content */}
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
            <Text style={styles.loadingText}>Trend verileri yükleniyor...</Text>
          </View>
        ) : (
          <>
            {/* Trending Recipes Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🔥 Trend Tarifler</Text>
                <Text style={styles.sectionSubtitle}>
                  {timeFilter === 'week' ? 'Bu hafta' : timeFilter === 'month' ? 'Bu ay' : 'Tüm zamanlar'} en popüler
                </Text>
              </View>
              
              {trendingRecipes.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon}>📊</Text>
                  <Text style={styles.emptyTitle}>Henüz trend tarif yok</Text>
                  <Text style={styles.emptySubtitle}>
                    Tarifler beğenilmeye başladığında burada görünecek.
                  </Text>
                </View>
              ) : (
                <View style={styles.trendingList}>
                  {trendingRecipes.map((recipe, index) => (
                    <TrendingRecipeCard key={recipe.id} recipe={recipe} index={index} />
                  ))}
                </View>
              )}
            </View>

            {/* Popular Categories Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📈 Popüler Kategoriler</Text>
                <Text style={styles.sectionSubtitle}>
                  En çok tarif eklenen kategoriler
                </Text>
              </View>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesScroll}
              >
                {popularCategories.map((category, index) => (
                  <CategoryTrendCard key={category.id} category={category} index={index} />
                ))}
              </ScrollView>
            </View>

            {/* Stats Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📊 İstatistikler</Text>
                <Text style={styles.sectionSubtitle}>
                  Platform genelinde özet
                </Text>
              </View>
              
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{trendingRecipes.length}</Text>
                  <Text style={styles.statLabel}>Trend Tarif</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{popularCategories.length}</Text>
                  <Text style={styles.statLabel}>Aktif Kategori</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>
                    {trendingRecipes.reduce((sum, recipe) => sum + recipe.likes, 0)}
                  </Text>
                  <Text style={styles.statLabel}>Toplam Beğeni</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>
                    {trendingRecipes.reduce((sum, recipe) => sum + recipe.views, 0)}
                  </Text>
                  <Text style={styles.statLabel}>Toplam Görüntü</Text>
                </View>
              </View>
            </View>
          </>
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
    fontSize: 12,
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
  timeFilterContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  timeFilterButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },
  activeTimeFilterButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeFilterText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeTimeFilterText: {
    color: Colors.white,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
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
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  trendingList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  trendingCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  trendingRank: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
  },
  rankText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.white,
    marginRight: 4,
  },
  trendIcon: {
    fontSize: 12,
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
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
    marginBottom: Spacing.sm,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.white,
  },
  recipeTitle: {
    fontSize: 16,
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
  recipeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  statText: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  categoriesScroll: {
    paddingHorizontal: Spacing.lg,
  },
  categoryTrendCard: {
    width: 120,
    height: 100,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginRight: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
  },
  categoryTrendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  categoryTrendIcon: {
    fontSize: 16,
    marginHorizontal: 2,
  },
  categoryTrendName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 2,
  },
  categoryTrendCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  statCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.small,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
