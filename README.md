# Assignment Day 22 - Product Detail Page & Fullstack REST API

Repositori ini mengintegrasikan dua halaman Product Detail Page (PDP):
1. **Page 1**: Halaman Product Detail Page statis/hardcoded (Innoxa Unica AJ) dengan data lokal, pemilihan variasi, quantity counter, validasi input, live subtotal, dan drawer minicart.
2. **Page 2**: Halaman Fullstack (Frontend & Backend) dengan database **PostgreSQL** yang menampung katalog produk secara dinamis, state handling (loading & error state), dan endpoint REST API lengkap.

---

## 📁 Struktur Folder Proyek

```text
Assignment-Day22/
├── index.html                   # Portal navigasi utama (akses Page 1 & Page 2)
├── README.md                    # Dokumentasi lengkap proyek
├── link.txt                     # Tautan submission tugas (GitHub & LinkedIn)
├── .gitignore                   # Konfigurasi file yang diabaikan git
│
├── page-1/                      # PAGE 1: Hardcoded Product Detail Page
│   ├── index.html               # Struktur antarmuka PDP data statis
│   ├── css/
│   │   └── style.css            # Styling visual ritel mewah 50ml
│   ├── js/
│   │   └── script.js            # Interaksi lokal (swatches, live subtotal, drawer minicart, validasi)
│   └── img/
│       └── unica.jpeg           # Aset gambar produk Innoxa Unica AJ
│
└── page-2/                      # PAGE 2: Fullstack PDP dengan PostgreSQL
    ├── frontend/                # Client web interaktif dinamis
    │   ├── index.html           # Struktur antarmuka PDP dinamis (dengan Loading & Error State)
    │   ├── css/
    │   │   └── style.css        # Desain visual responsif
    │   ├── js/
    │   │   └── script.js        # Dynamic fetch API, state protection, validasi input, live subtotal
    │   └── img/
    │       ├── unica.jpeg       # Gambar produk Unica AJ
    │       ├── serum.jpeg       # Gambar produk Radiance Serum
    │       └── buah1.jpeg       # Gambar aset pendukung
    │
    └── backend/                 # Server REST API Node.js + Express + PostgreSQL
        ├── .env.example         # Template konfigurasi environment database & port
        ├── package.json         # Manifest dependensi & script backend
        ├── package-lock.json    # Lockfile dependensi npm
        ├── index.js             # Express API server dengan seluruh endpoint CRUD
        ├── db.js                # Koneksi PostgreSQL pool, auto-migrate & helper format
        ├── sql/
        │   ├── schema.sql       # DDL skema tabel products (dengan kolom stock)
        │   └── seed.sql         # DML seed data awal produk (Unica AJ & Serum)
        └── scripts/
            ├── migrate.js       # Script runner mandiri untuk migrasi tabel
            └── seed.js          # Script runner mandiri untuk seeding data awal
```

---

## 🗄️ Struktur Database PostgreSQL (Page 2)

Struktur tabel `products` di database `product_api`:

```sql
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  photo VARCHAR(255) NOT NULL DEFAULT 'unica.jpeg',
  variation JSONB NOT NULL DEFAULT '[]'::jsonb,
  description TEXT,
  more_information TEXT,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  stock INT NOT NULL DEFAULT 15,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Pemetaan Data Kolom ke Respons JSON:
* `id` &rarr; `id` (Integer)
* `name` &rarr; `Name` & `name` (String, contoh: `"Innoxa Unica AJ"`)
* `photo` &rarr; `Photo` & `photo` (String, contoh: `"unica.jpeg"`)
* `variation` &rarr; `Variation` & `variation` (Array of objects, contoh: `[{"size": "50 ml", "price": 94.30}, {"size": "100 ml", "price": 135.70}]`)
* `description` &rarr; `Description` & `description` (Text)
* `more_information` &rarr; `'More Information'` & `more_information` (Text)
* `features` &rarr; `Features` & `features` (Array of objects, contoh: `[{"label": "SKU", "value": "INN-P-55"}, {"label": "Brand", "value": "Innoxa"}, ...]`)
* `stock` &rarr; `Stock` & `stock` (Integer, contoh: `10` atau `15`)

---

## 🚀 Panduan Menjalankan Proyek

### 1. Database PostgreSQL Docker
Pastikan kontainer PostgreSQL Docker sudah berjalan (menggunakan port default `5432` dengan database `product_api`).
Jika menggunakan Docker Compose:
```powershell
docker compose up -d
```
Atau pastikan container PostgreSQL aktif:
```powershell
docker start product_api_postgres
```

### 2. Jalankan Backend Page 2 (PostgreSQL)
Buka terminal dan masuk ke folder `page-2/backend`:
```powershell
cd page-2/backend
npm install
npm start
```
* Server berjalan di: `http://localhost:3000`
* Status endpoint: `http://localhost:3000/api/status`
* Auto-migration & auto-seeding akan otomatis memastikan tabel `products` ada dan terisi data awal!

### 3. Akses Halaman Melalui Browser

#### Opsi A: Lewat Server Backend Langsung (Direkomendasikan)
Saat server backend berjalan di port 3000:
* **Portal Utama**: [http://localhost:3000/](http://localhost:3000/)
* **Page 1 (Hardcoded)**: [http://localhost:3000/page-1/](http://localhost:3000/page-1/)
* **Page 2 (Fullstack)**: [http://localhost:3000/page-2/](http://localhost:3000/page-2/)

#### Opsi B: Lewat VS Code Live Server
* Buka file `index.html` dengan Live Server &rarr; berjalan di `http://localhost:5500/index.html`.
* Buka file `page-1/index.html` dengan Live Server &rarr; berjalan di `http://localhost:5500/page-1/index.html`.
* Buka file `page-2/frontend/index.html` dengan Live Server &rarr; berjalan di `http://localhost:5500/page-2/frontend/index.html`.

---

## 📡 Daftar Endpoint REST API (Page 2)

| Method | Endpoint | Keterangan | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/status` | Cek status server & koneksi PostgreSQL | 200 OK |
| `GET` | `/api/products` | Ambil semua produk dari PostgreSQL | 200 OK |
| `GET` | `/api/products/:id` | Ambil detail satu produk berdasarkan ID | 200 OK / 404 Not Found |
| `POST` | `/api/products` | Tambah produk baru ke PostgreSQL | 201 Created / 400 Bad Request |
| `PUT` | `/api/products/:id` | Update produk di PostgreSQL | 200 OK / 404 Not Found |
| `DELETE`| `/api/products/:id` | Hapus produk dari PostgreSQL | 200 OK / 404 Not Found |

---

## 🤖 Penggunaan AI:
- Pembuatan README
- Review Kode

