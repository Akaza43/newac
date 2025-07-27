# Setup Supabase untuk News Page

## 1. Install Dependencies
Package `@supabase/supabase-js` sudah diinstall. Jika belum, jalankan:
```bash
npm install @supabase/supabase-js
```

## 2. Setup Environment Variables
Buat file `.env.local` di root project dan tambahkan:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## 3. Setup Database Table
Buat table `news` di Supabase dengan struktur:
```sql
CREATE TABLE news (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 4. Fitur yang Sudah Ditambahkan
- ✅ Integrasi Supabase client
- ✅ State management untuk data Supabase
- ✅ useEffect untuk fetch data dari Supabase
- ✅ Loading state untuk Supabase
- ✅ Error handling untuk Supabase
- ✅ Menghapus dependensi data lokal

## 5. Cara Kerja
- Data dari Supabase akan diambil saat komponen dimuat
- Semua data berita sekarang berasal dari Supabase
- Berita terbaru akan muncul di atas (ordered by createdAt desc)
- Jika Supabase error, aplikasi akan menampilkan array kosong 