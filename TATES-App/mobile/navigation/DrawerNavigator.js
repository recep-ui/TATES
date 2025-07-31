import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddRecipeScreen from '../screens/AddRecipeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import TrendsScreen from '../screens/TrendsScreen';
import RecentlyViewedScreen from '../screens/RecentlyViewedScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import AboutScreen from '../screens/AboutScreen';
import LogoutScreen from '../screens/LogoutScreen';
import { Text } from 'react-native';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator 
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#fff',
          width: 280,
        },
        drawerActiveTintColor: '#3867d6',
        drawerInactiveTintColor: '#666',
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          drawerLabel: 'Ana Sayfa',
          drawerIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text>
        }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          drawerLabel: 'Profil',
          drawerIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👤</Text>
        }}
      />
      <Drawer.Screen 
        name="AddRecipeScreen" 
        component={AddRecipeScreen}
        options={{
          drawerLabel: 'Tarif Ekle',
          drawerIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>➕</Text>
        }}
      />
      <Drawer.Screen 
        name="Categories" 
        component={CategoriesScreen}
        options={{
          drawerLabel: 'Kategoriler',
          drawerIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📂</Text>
        }}
      />
      <Drawer.Screen 
        name="Favorites" 
        component={FavoritesScreen}
        options={{
          drawerLabel: 'Favoriler',
          drawerIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>⭐</Text>
        }}
      />
      <Drawer.Screen 
        name="Trends" 
        component={TrendsScreen}
        options={{
          drawerLabel: 'Trendler',
          drawerIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📈</Text>
        }}
      />
      <Drawer.Screen 
        name="RecentlyViewed" 
        component={RecentlyViewedScreen}
        options={{
          drawerLabel: 'Son Görülenler',
          drawerIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👁️</Text>
        }}
      />
      <Drawer.Screen 
        name="Feedback" 
        component={FeedbackScreen}
        options={{
          drawerLabel: 'Geri Bildirim',
          drawerIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>💬</Text>
        }}
      />
      <Drawer.Screen 
        name="About" 
        component={AboutScreen}
        options={{
          drawerLabel: 'Hakkında',
          drawerIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>ℹ️</Text>
        }}
      />
      <Drawer.Screen 
        name="Logout" 
        component={LogoutScreen}
        options={{
          drawerLabel: 'Çıkış Yap',
          drawerIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🚪</Text>
        }}
      />
    </Drawer.Navigator>
  );
}
