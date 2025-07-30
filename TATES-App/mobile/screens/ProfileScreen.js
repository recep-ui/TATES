import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile'); // profile, likes, comments, recipes, saved
  const [recipes, setRecipes] = useState([]);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    fetchUserProfile();
    fetchUserData();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/profile', {
        headers: {
          'Authorization': `Bearer ${global.token}` // Global token kullanımı
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      // Kullanıcının tariflerini getir
      const recipesResponse = await fetch('http://localhost:3000/api/profile/recipes', {
        headers: {
          'Authorization': `Bearer ${global.token}`
        }
      });
      if (recipesResponse.ok) {
        const recipesData = await recipesResponse.json();
        setRecipes(recipesData.recipes || []);
      }

      // Beğenileri getir
      const likesResponse = await fetch('http://localhost:3000/api/profile/likes', {
        headers: {
          'Authorization': `Bearer ${global.token}`
        }
      });
      if (likesResponse.ok) {
        const likesData = await likesResponse.json();
        setLikes(likesData.likes || []);
      }

      // Yorumları getir
      const commentsResponse = await fetch('http://localhost:3000/api/profile/comments', {
        headers: {
          'Authorization': `Bearer ${global.token}`
        }
      });
      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json();
        setComments(commentsData.comments || []);
      }

      // Kaydedilenleri getir
      const savedResponse = await fetch('http://localhost:3000/api/profile/saved', {
        headers: {
          'Authorization': `Bearer ${global.token}`
        }
      });
      if (savedResponse.ok) {
        const savedData = await savedResponse.json();
        setSaved(savedData.saved || []);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Çıkış Yap', 
          style: 'destructive',
          onPress: () => {
            global.token = null;
            navigation.reset({
              index: 0,
              routes: [{ name: 'LoginScreen' }],
            });
          }
        }
      ]
    );
  };

  const renderProfileTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.fullName || user?.username}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{recipes.length}</Text>
          <Text style={styles.statLabel}>Tarif</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{likes.length}</Text>
          <Text style={styles.statLabel}>Beğeni</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{comments.length}</Text>
          <Text style={styles.statLabel}>Yorum</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Profili Düzenle</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRecipesTab = () => (
    <View style={styles.tabContent}>
      {recipes.length === 0 ? (
        <Text style={styles.emptyText}>Henüz tarif eklememişsiniz.</Text>
      ) : (
        recipes.map((recipe) => (
          <TouchableOpacity 
            key={recipe.id} 
            style={styles.recipeItem}
            onPress={() => navigation.navigate('RecipeDetailScreen', { recipe })}
          >
            {recipe.imageUrl && (
              <Image source={{ uri: `http://localhost:3000${recipe.imageUrl}` }} style={styles.recipeImage} />
            )}
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeTitle}>{recipe.title}</Text>
              <Text style={styles.recipeDate}>
                {new Date(recipe.createdAt).toLocaleDateString('tr-TR')}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  const renderLikesTab = () => (
    <View style={styles.tabContent}>
      {likes.length === 0 ? (
        <Text style={styles.emptyText}>Henüz beğendiğiniz tarif yok.</Text>
      ) : (
        likes.map((like) => (
          <TouchableOpacity 
            key={like.recipeId} 
            style={styles.recipeItem}
            onPress={() => navigation.navigate('RecipeDetailScreen', { recipe: like.recipe })}
          >
            {like.recipe.imageUrl && (
              <Image source={{ uri: `http://localhost:3000${like.recipe.imageUrl}` }} style={styles.recipeImage} />
            )}
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeTitle}>{like.recipe.title}</Text>
              <Text style={styles.recipeAuthor}>{like.recipe.username}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  const renderCommentsTab = () => (
    <View style={styles.tabContent}>
      {comments.length === 0 ? (
        <Text style={styles.emptyText}>Henüz yorum yapmamışsınız.</Text>
      ) : (
        comments.map((comment) => (
          <View key={comment.id} style={styles.commentItem}>
            <Text style={styles.commentRecipe}>{comment.recipeTitle}</Text>
            <Text style={styles.commentText}>{comment.comment}</Text>
            <Text style={styles.commentDate}>
              {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
            </Text>
          </View>
        ))
      )}
    </View>
  );

  const renderSavedTab = () => (
    <View style={styles.tabContent}>
      {saved.length === 0 ? (
        <Text style={styles.emptyText}>Henüz tarif kaydetmemişsiniz.</Text>
      ) : (
        saved.map((save) => (
          <TouchableOpacity 
            key={save.recipeId} 
            style={styles.recipeItem}
            onPress={() => navigation.navigate('RecipeDetailScreen', { recipe: save.recipe })}
          >
            {save.recipe.imageUrl && (
              <Image source={{ uri: `http://localhost:3000${save.recipe.imageUrl}` }} style={styles.recipeImage} />
            )}
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeTitle}>{save.recipe.title}</Text>
              <Text style={styles.recipeAuthor}>{save.recipe.username}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutButton}>Çıkış</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>Profil</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'recipes' && styles.activeTab]}
          onPress={() => setActiveTab('recipes')}
        >
          <Text style={[styles.tabText, activeTab === 'recipes' && styles.activeTabText]}>Tariflerim</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'likes' && styles.activeTab]}
          onPress={() => setActiveTab('likes')}
        >
          <Text style={[styles.tabText, activeTab === 'likes' && styles.activeTabText]}>Beğeniler</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'comments' && styles.activeTab]}
          onPress={() => setActiveTab('comments')}
        >
          <Text style={[styles.tabText, activeTab === 'comments' && styles.activeTabText]}>Yorumlar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
          onPress={() => setActiveTab('saved')}
        >
          <Text style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}>Kaydedilenler</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'recipes' && renderRecipesTab()}
        {activeTab === 'likes' && renderLikesTab()}
        {activeTab === 'comments' && renderCommentsTab()}
        {activeTab === 'saved' && renderSavedTab()}
      </ScrollView>
    </View>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222f3e',
  },
  logoutButton: {
    fontSize: 16,
    color: '#e74c3c',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    elevation: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3867d6',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
  },
  activeTabText: {
    color: '#3867d6',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3867d6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222f3e',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3867d6',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  editButton: {
    backgroundColor: '#3867d6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recipeItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 1,
  },
  recipeImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
  },
  recipeInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222f3e',
    marginBottom: 4,
  },
  recipeAuthor: {
    fontSize: 14,
    color: '#666',
  },
  recipeDate: {
    fontSize: 12,
    color: '#999',
  },
  commentItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  commentRecipe: {
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
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 50,
  },
});
