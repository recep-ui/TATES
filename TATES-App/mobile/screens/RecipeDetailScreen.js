import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';

export default function RecipeDetailScreen({ route, navigation }) {
  const { recipe } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState(recipe.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://192.168.1.102:3000/api/recipes/${recipe.id}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`http://192.168.1.102:3000/api/recipes/${recipe.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        setIsLiked(!isLiked);
        setLikes(isLiked ? likes - 1 : likes + 1);
      }
    } catch (error) {
      Alert.alert('Hata', 'Beğeni işlemi başarısız.');
    }
  };

  const handleFavorite = async () => {
    try {
      const response = await fetch(`http://192.168.1.102:3000/api/recipes/${recipe.id}/favorite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        setIsFavorited(!isFavorited);
        Alert.alert('Başarılı', isFavorited ? 'Favorilerden çıkarıldı!' : 'Favorilere eklendi!');
      }
    } catch (error) {
      Alert.alert('Hata', 'Favori işlemi başarısız.');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      Alert.alert('Hata', 'Lütfen yorum yazın.');
      return;
    }

    try {
      const response = await fetch(`http://192.168.1.102:3000/api/recipes/${recipe.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: newComment })
      });
      if (response.ok) {
        setNewComment('');
        fetchComments(); // Yorumları yenile
        Alert.alert('Başarılı', 'Yorum eklendi!');
      }
    } catch (error) {
      Alert.alert('Hata', 'Yorum ekleme başarısız.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tarif Detayı</Text>
        <View style={{ width: 50 }} />
      </View>

      {recipe.imageUrl && (
                    <Image source={{ uri: `http://192.168.1.102:3000${recipe.imageUrl}` }} style={styles.recipeImage} />
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.description}>{recipe.description}</Text>

        <View style={styles.ingredientsSection}>
          <Text style={styles.sectionTitle}>Malzemeler</Text>
          {recipe.ingredients && JSON.parse(recipe.ingredients).map((ingredient, index) => (
            <Text key={index} style={styles.ingredient}>• {ingredient}</Text>
          ))}
        </View>

        <View style={styles.stepsSection}>
          <Text style={styles.sectionTitle}>Hazırlanışı</Text>
          {recipe.steps && JSON.parse(recipe.steps).map((step, index) => (
            <View key={index} style={styles.step}>
              <Text style={styles.stepNumber}>{index + 1}.</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <Text style={[styles.actionText, isLiked && styles.likedText]}>
              ❤️ {likes}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleFavorite}>
            <Text style={[styles.actionText, isFavorited && styles.favoritedText]}>
              ⭐
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.sectionTitle}>Yorumlar ({comments.length})</Text>
          
          <View style={styles.addCommentContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Yorum yazın..."
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity style={styles.addCommentButton} onPress={handleAddComment}>
              <Text style={styles.addCommentButtonText}>Gönder</Text>
            </TouchableOpacity>
          </View>

          {comments.map((comment, index) => (
            <View key={index} style={styles.comment}>
              <Text style={styles.commentAuthor}>{comment.username}</Text>
              <Text style={styles.commentText}>{comment.comment}</Text>
              <Text style={styles.commentDate}>{new Date(comment.createdAt).toLocaleDateString('tr-TR')}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    elevation: 2,
  },
  backButton: {
    fontSize: 16,
    color: '#3867d6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222f3e',
  },
  recipeImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222f3e',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222f3e',
    marginBottom: 12,
  },
  ingredientsSection: {
    marginBottom: 24,
  },
  ingredient: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    paddingLeft: 8,
  },
  stepsSection: {
    marginBottom: 24,
  },
  step: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3867d6',
    marginRight: 12,
    minWidth: 20,
  },
  stepText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#d1d8e0',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d8e0',
    marginBottom: 24,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionText: {
    fontSize: 18,
  },
  likedText: {
    color: '#e74c3c',
  },
  favoritedText: {
    color: '#f39c12',
  },
  commentsSection: {
    marginTop: 20,
  },
  addCommentContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#d1d8e0',
    fontSize: 14,
  },
  addCommentButton: {
    backgroundColor: '#3867d6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  addCommentButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  comment: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222f3e',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
  },
}); 