import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Image, StatusBar, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Shadows, Spacing, BorderRadius } from '../constants/Colors';
import ModernInput from '../components/ModernInput';
import ModernButton from '../components/ModernButton';

export default function AddRecipeScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [image, setImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://192.168.1.102:3000/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Tarif başlığı gerekli';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Tarif açıklaması gerekli';
    }
    
    if (!ingredients.trim()) {
      newErrors.ingredients = 'Malzemeler gerekli';
    }
    
    if (!steps.trim()) {
      newErrors.steps = 'Hazırlanış adımları gerekli';
    }
    
    if (!selectedCategory) {
      newErrors.category = 'Kategori seçimi gerekli';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Fotoğraf galerisine erişim izni gereklidir.');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Hata', 'Resim seçilirken bir hata oluştu.');
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      let formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('ingredients', ingredients);
      formData.append('steps', steps);
      formData.append('categoryId', selectedCategory.id);
      
      if (image) {
        formData.append('image', {
          uri: image,
          name: 'recipe.jpg',
          type: 'image/jpeg',
        });
      }

      const response = await fetch('http://192.168.1.102:3000/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${global.token}`,
        },
        body: formData,
      });

      if (response.ok) {
        Alert.alert(
          'Başarılı', 
          'Tarif başarıyla eklendi!',
          [
            { 
              text: 'Tamam', 
              onPress: () => {
                setTitle('');
                setDescription('');
                setIngredients('');
                setSteps('');
                setImage(null);
                navigation.goBack();
              }
            }
          ]
        );
      } else {
        const data = await response.json();
        Alert.alert('Hata', data.message || 'Tarif eklenirken bir hata oluştu.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yeni Tarif Ekle</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Image Section */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>Tarif Fotoğrafı</Text>
          <TouchableOpacity 
            style={styles.imageContainer} 
            onPress={pickImage}
            activeOpacity={0.8}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.selectedImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imageIcon}>📷</Text>
                <Text style={styles.imageText}>Fotoğraf Seç</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <ModernInput
            label="Tarif Başlığı"
            placeholder="Örn: Ev Yapımı Pizza"
            value={title}
            onChangeText={setTitle}
            error={errors.title}
          />

          <ModernInput
            label="Tarif Açıklaması"
            placeholder="Tarifiniz hakkında kısa bir açıklama yazın..."
            value={description}
            onChangeText={setDescription}
            error={errors.description}
            multiline
            numberOfLines={3}
          />

          {/* Category Selection */}
          <View style={styles.categorySection}>
            <Text style={styles.categoryLabel}>Kategori</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryOption,
                    { backgroundColor: category.color },
                    selectedCategory?.id === category.id && styles.selectedCategoryOption
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {errors.category && (
              <Text style={styles.errorText}>{errors.category}</Text>
            )}
          </View>

          <ModernInput
            label="Malzemeler"
            placeholder="Her malzemeyi yeni satıra yazın..."
            value={ingredients}
            onChangeText={setIngredients}
            error={errors.ingredients}
            multiline
            numberOfLines={6}
          />

          <ModernInput
            label="Hazırlanışı"
            placeholder="Her adımı yeni satıra yazın..."
            value={steps}
            onChangeText={setSteps}
            error={errors.steps}
            multiline
            numberOfLines={8}
          />
        </View>

        {/* Submit Button */}
        <View style={styles.submitSection}>
          <ModernButton
            title="Tarifi Yayınla"
            onPress={handleSubmit}
            loading={loading}
            size="large"
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  imageSection: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  imageIcon: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  imageText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  formSection: {
    marginBottom: Spacing.xl,
  },
  submitSection: {
    marginTop: Spacing.lg,
  },
  submitButton: {
    width: '100%',
  },
  categorySection: {
    marginBottom: Spacing.lg,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  categoryScroll: {
    paddingRight: Spacing.lg,
  },
  categoryOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    marginRight: Spacing.sm,
    alignItems: 'center',
    minWidth: 80,
    ...Shadows.small,
  },
  selectedCategoryOption: {
    borderWidth: 2,
    borderColor: Colors.white,
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: Spacing.xs,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 12,
    color: '#e74c3c',
    marginTop: Spacing.xs,
  },
});
