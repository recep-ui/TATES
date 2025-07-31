import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar, Alert } from 'react-native';
import { Colors, Shadows, Spacing, BorderRadius } from '../constants/Colors';

export default function CategoriesScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    {
      id: 1,
      name: 'Kahvaltı',
      icon: '🍳',
      color: '#FF6B6B',
      description: 'Güne başlangıç tarifleri'
    },
    {
      id: 2,
      name: 'Ana Yemek',
      icon: '🍖',
      color: '#4ECDC4',
      description: 'Doyurucu ana yemekler'
    },
    {
      id: 3,
      name: 'Çorba',
      icon: '🥣',
      color: '#45B7D1',
      description: 'Sıcak ve besleyici çorbalar'
    },
    {
      id: 4,
      name: 'Salata',
      icon: '🥗',
      color: '#96CEB4',
      description: 'Taze ve sağlıklı salatalar'
    },
    {
      id: 5,
      name: 'Tatlı',
      icon: '🍰',
      color: '#FFEAA7',
      description: 'Lezzetli tatlılar'
    },
    {
      id: 6,
      name: 'İçecek',
      icon: '🥤',
      color: '#DDA0DD',
      description: 'Serinletici içecekler'
    },
    {
      id: 7,
      name: 'Atıştırmalık',
      icon: '🍿',
      color: '#FDCB6E',
      description: 'Hızlı atıştırmalıklar'
    },
    {
      id: 8,
      name: 'Vejetaryen',
      icon: '🥬',
      color: '#6C5CE7',
      description: 'Bitkisel bazlı tarifler'
    }
  ];

  const fetchRecipesByCategory = async (categoryId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://192.168.1.102:3000/api/recipes?category=${categoryId}`);
      if (response.ok) {
        const data = await response.json();
        setRecipes(data.recipes || []);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      // Demo veriler göster
      setRecipes([
        {
          id: 1,
          title: 'Örnek Tarif 1',
          description: 'Bu kategori için örnek tarif açıklaması',
          imageUrl: null,
          likes: 15
        },
        {
          id: 2,
          title: 'Örnek Tarif 2',
          description: 'Bu kategori için başka bir örnek tarif',
          imageUrl: null,
          likes: 8
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    fetchRecipesByCategory(category.id);
  };

  const handleRecipePress = (recipe) => {
    navigation.navigate('RecipeDetailScreen', { recipe });
  };

  const CategoryCard = ({ category, isSelected }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        { backgroundColor: category.color },
        isSelected && styles.selectedCategoryCard
      ]}
      onPress={() => handleCategoryPress(category)}
      activeOpacity={0.8}
    >
      <Text style={styles.categoryIcon}>{category.icon}</Text>
      <Text style={styles.categoryName}>{category.name}</Text>
      <Text style={styles.categoryDescription}>{category.description}</Text>
    </TouchableOpacity>
  );

  const RecipeCard = ({ recipe }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => handleRecipePress(recipe)}
      activeOpacity={0.8}
    >
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
        <Text style={styles.recipeTitle} numberOfLines={2}>{recipe.title}</Text>
        <Text style={styles.recipeDescription} numberOfLines={2}>{recipe.description}</Text>
        <View style={styles.recipeMeta}>
          <Text style={styles.recipeLikes}>❤️ {recipe.likes}</Text>
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
        <Text style={styles.headerTitle}>Kategoriler</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Categories Grid */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Tarif Kategorileri</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                isSelected={selectedCategory?.id === category.id}
              />
            ))}
          </View>
        </View>

        {/* Selected Category Recipes */}
        {selectedCategory && (
          <View style={styles.recipesSection}>
            <View style={styles.recipesHeader}>
              <Text style={styles.recipesTitle}>
                {selectedCategory.name} Tarifleri
              </Text>
              <Text style={styles.recipesCount}>
                {recipes.length} tarif
              </Text>
            </View>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Tarifler yükleniyor...</Text>
              </View>
            ) : recipes.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🍽️</Text>
                <Text style={styles.emptyTitle}>Tarif bulunamadı</Text>
                <Text style={styles.emptySubtitle}>
                  Bu kategoride henüz tarif eklenmemiş.
                </Text>
              </View>
            ) : (
              <View style={styles.recipesList}>
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Popular Categories */}
        <View style={styles.popularSection}>
          <Text style={styles.sectionTitle}>Popüler Kategoriler</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.popularScroll}
          >
            {categories.slice(0, 4).map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.popularCard, { backgroundColor: category.color }]}
                onPress={() => handleCategoryPress(category)}
              >
                <Text style={styles.popularIcon}>{category.icon}</Text>
                <Text style={styles.popularName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  content: {
    flex: 1,
  },
  categoriesSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
    ...Shadows.medium,
  },
  selectedCategoryCard: {
    borderWidth: 3,
    borderColor: Colors.white,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  categoryDescription: {
    fontSize: 12,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  recipesSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  recipesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  recipesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  recipesCount: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
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
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  recipesList: {
    gap: Spacing.md,
  },
  recipeCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  recipeImageContainer: {
    height: 120,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  recipeDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeLikes: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  popularSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  popularScroll: {
    paddingRight: Spacing.lg,
  },
  popularCard: {
    width: 120,
    height: 100,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    ...Shadows.medium,
  },
  popularIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  popularName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
  },
});
