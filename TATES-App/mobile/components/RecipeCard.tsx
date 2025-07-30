import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Shadows, Spacing, BorderRadius } from '../constants/Colors';

interface RecipeCardProps {
  recipe: {
    id: number;
    title: string;
    description: string;
    imageUrl?: string;
    likes?: number;
    username?: string;
    createdAt?: string;
  };
  onPress: () => void;
  onLike?: () => void;
  onFavorite?: () => void;
  isLiked?: boolean;
  isFavorited?: boolean;
  showActions?: boolean;
}

export default function RecipeCard({
  recipe,
  onPress,
  onLike,
  onFavorite,
  isLiked = false,
  isFavorited = false,
  showActions = true,
}: RecipeCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        {recipe.imageUrl ? (
          <Image 
            source={{ uri: `http://localhost:3000${recipe.imageUrl}` }} 
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>🍽️</Text>
          </View>
        )}
        
        {showActions && (
          <View style={styles.actionButtons}>
            {onLike && (
              <TouchableOpacity 
                style={[styles.actionButton, isLiked && styles.likedButton]} 
                onPress={onLike}
              >
                <Text style={[styles.actionIcon, isLiked && styles.likedIcon]}>
                  {isLiked ? '❤️' : '🤍'}
                </Text>
              </TouchableOpacity>
            )}
            
            {onFavorite && (
              <TouchableOpacity 
                style={[styles.actionButton, isFavorited && styles.favoritedButton]} 
                onPress={onFavorite}
              >
                <Text style={[styles.actionIcon, isFavorited && styles.favoritedIcon]}>
                  {isFavorited ? '⭐' : '☆'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {recipe.title}
        </Text>
        
        <Text style={styles.description} numberOfLines={2}>
          {recipe.description}
        </Text>
        
        <View style={styles.footer}>
          {recipe.username && (
            <Text style={styles.author}>👤 {recipe.username}</Text>
          )}
          
          {recipe.likes !== undefined && (
            <Text style={styles.likes}>❤️ {recipe.likes}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
  },
  actionButtons: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.round,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.xs,
    ...Shadows.small,
  },
  likedButton: {
    backgroundColor: Colors.errorLight,
  },
  favoritedButton: {
    backgroundColor: Colors.secondaryLight,
  },
  actionIcon: {
    fontSize: 16,
  },
  likedIcon: {
    color: Colors.error,
  },
  favoritedIcon: {
    color: Colors.secondary,
  },
  content: {
    padding: Spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  likes: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
}); 