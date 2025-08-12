# 📺 AzTV Proqram Siyahısı

Azərbaycan TV proqram siyahısını idarə etmək və HTML export etmək üçün modern web tətbiqi.

## ✨ Xüsusiyyətlər

- 📅 Həftənin bütün günlərinin TV proqramları
- ➕ Yeni proqram əlavə etmə
- 🗑️ Proqram silmə
- 📄 HTML export funksiyası
- 📱 Responsive dizayn
- 🎨 Modern və gözəl interfeys
- ⚡ Real-time yeniləmə

## 🚀 Quraşdırma

1. **Asılılıqları yükləyin:**
   ```bash
   npm install
   ```

2. **Serveri işə salın:**
   ```bash
   npm start
   ```

3. **Development rejimində işə salın:**
   ```bash
   npm run dev
   ```

4. **Brauzerinizdə açın:**
   ```
   http://localhost:3000
   ```

## 📁 Layihə Strukturu

```
aztv-program/
├── server.js          # Express server
├── package.json       # Asılılıqlar
├── views/            # EJS şablonları
│   ├── index.ejs     # Ana səhifə
│   ├── day.ejs       # Gün detalları
│   └── export.ejs    # Export səhifəsi
├── public/           # Statik fayllar
│   ├── css/
│   │   └── style.css # CSS stilləri
│   └── js/
│       └── script.js # JavaScript
└── README.md         # Bu fayl
```

## 🎯 İstifadə

### Ana Səhifə
- Həftənin bütün günlərinin proqramlarını görə bilərsiniz
- Hər günün kartına klikləyərək detalları görə bilərsiniz
- "Yeni Proqram Əlavə Et" düyməsi ilə yeni proqram əlavə edə bilərsiniz

### Gün Detalları
- `/gun/:day` səhifəsində həmin günün bütün proqramlarını görə bilərsiniz
- Proqramları silə və ya yeni proqram əlavə edə bilərsiniz
- Cədvəl formatında düzgün təşkil edilmiş məlumatlar

### HTML Export
- `/export` səhifəsində HTML faylını yarada bilərsiniz
- CSS və JavaScript seçimləri
- Responsive dizayn seçimi
- Öncədən baxış funksiyası

## 🔧 API Endpointləri

- `GET /api/programs` - Bütün proqramları al
- `GET /api/programs/:day` - Günə görə proqramları al
- `POST /api/programs/:day` - Yeni proqram əlavə et
- `DELETE /api/programs/:day/:index` - Proqramı sil

## 🎨 Dizayn

- Modern gradient arxa fon
- Kart əsaslı layout
- Hover effektləri
- Responsive grid sistem
- Inter font ailəsi
- Gözəl animasiyalar

## ⌨️ Klaviatura Qısayolları

- `Ctrl/Cmd + N` - Yeni proqram əlavə et
- `Escape` - Modal bağla

## 📱 Responsive Dizayn

- Mobil cihazlarda optimal görünüş
- Tablet və desktop üçün uyğunlaşdırılmış
- Touch-friendly interfeys

## 🔮 Gələcək Xüsusiyyətlər

- [ ] Axtarış funksiyası
- [ ] Proqram redaktə etmə
- [ ] PDF export
- [ ] Çoxlu kanal dəstəyi
- [ ] Bildiriş sistemi
- [ ] Offline dəstək

## 🛠️ Texnologiyalar

- **Backend:** Node.js, Express.js
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Template Engine:** EJS
- **Styling:** Custom CSS with Flexbox/Grid
- **Fonts:** Google Fonts (Inter)

## 📄 Lisenziya

MIT License

## 🤝 Töhfə

Bu layihəyə töhfə vermək istəyirsinizsə, pull request göndərin və ya issue yaradın.

---

**Qeyd:** Bu layihə Azərbaycan dilində hazırlanmışdır və Azərbaycan TV proqramları üçün nəzərdə tutulmuşdur.
