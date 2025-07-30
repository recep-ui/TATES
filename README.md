# TATES - Tarif Paylaşım Uygulaması

TATES, kullanıcıların tariflerini paylaşabilecekleri, keşfedebilecekleri ve favorilere ekleyebilecekleri bir mobil uygulamadır.

## 🚀 Özellikler

- **Tarif Paylaşımı**: Kullanıcılar kendi tariflerini ekleyebilir
- **Resim Yükleme**: Tariflerle birlikte resim yükleme özelliği
- **Kullanıcı Yönetimi**: Kayıt, giriş ve profil yönetimi
- **Favoriler**: Beğenilen tarifleri favorilere ekleme
- **Kategoriler**: Tarifleri kategorilere göre filtreleme
- **Arama**: Tariflerde arama yapma

## 🛠️ Teknolojiler

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MySQL** - Veritabanı
- **JWT** - Authentication
- **Multer** - File upload
- **bcrypt** - Password hashing

### Mobile
- **React Native** - Mobile framework
- **Expo** - Development platform
- **React Navigation** - Navigation
- **expo-image-picker** - Image selection

## 📁 Proje Yapısı

```
TATES/
├── TATES-App/
│   ├── backend/           # Backend API
│   │   ├── config/        # Database config
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth middleware
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   └── uploads/       # Uploaded images
│   ├── database/          # Database schema
│   └── mobile/            # React Native app
│       ├── navigation/    # Navigation components
│       ├── screens/       # App screens
│       └── components/    # Reusable components
```

## 🚀 Kurulum

### Backend Kurulumu

```bash
cd TATES-App/backend
npm install
```

### Veritabanı Kurulumu

1. MySQL veritabanını kurun
2. `database/schema.sql` dosyasını çalıştırın
3. `.env` dosyasını oluşturun:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=password
DB_NAME=tates
PORT=3000
JWT_SECRET=your-secret-key
```

### Mobile Kurulumu

```bash
cd TATES-App/mobile
npm install
```

## 🏃‍♂️ Çalıştırma

### Backend

```bash
cd TATES-App/backend
node server.js
```

### Mobile

```bash
cd TATES-App/mobile
npm start
```

## 📱 API Endpoints

### Authentication
- `POST /api/login` - Kullanıcı girişi
- `POST /api/register` - Kullanıcı kaydı
- `POST /api/forgot-password` - Şifre sıfırlama

### Recipes
- `GET /api/recipes` - Tüm tarifleri listele
- `GET /api/recipes/:id` - Tarif detayı
- `POST /api/recipes` - Yeni tarif ekle (Auth gerekli)
- `PUT /api/recipes/:id` - Tarif güncelle (Auth gerekli)
- `DELETE /api/recipes/:id` - Tarif sil (Auth gerekli)

## 🔧 Geliştirme

### Backend Geliştirme
- Express.js server
- MySQL veritabanı
- JWT authentication
- File upload desteği

### Mobile Geliştirme
- React Native + Expo
- Drawer navigation
- Image picker
- Form handling

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👥 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun 