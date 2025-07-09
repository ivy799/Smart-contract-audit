# Hybrid Smart Contract Analyzer (Dockerized)

Proyek ini menyediakan layanan API untuk melakukan analisis keamanan smart contract secara komprehensif dengan menggabungkan dua pendekatan yang berjalan secara paralel:
1.  **Analisis Statis**: Menggunakan tool standar industri seperti Slither dan Mythril untuk mendeteksi kerentanan umum berbasis pola.
2.  **Analisis Kontekstual (KAG)**: Menggunakan Large Language Model (LLM) yang diperkuat dengan *Knowledge-Augmented Generation* (KAG), di mana LLM diberi pemahaman mendalam tentang struktur kontrak melalui Abstract Syntax Tree (AST) dan metadata lainnya.

Semua dependensi dibungkus dalam sebuah container Docker untuk kemudahan setup dan portabilitas.

## Struktur Proyek

-   `main.py`: Titik masuk utama aplikasi FastAPI.
-   `static_analyzer.py`: Modul untuk menjalankan Slither dan Mythril.
-   `llm_analyzer.py`: Modul untuk analisis KAG dengan Gemini API.
-   `Dockerfile`: Resep untuk membangun image Docker aplikasi.
-   `docker-compose.yml`: Cara mudah untuk menjalankan container aplikasi.
-   `requirements.txt`: Daftar dependensi Python.
-   `.env`: File untuk menyimpan API key (jangan di-commit ke Git).
-   `README.md`: Dokumentasi ini.

## Cara Menjalankan

### 1. Prasyarat

-   [Docker](https://docs.docker.com/get-docker/) terinstal dan berjalan di sistem Anda.
-   [Docker Compose](https://docs.docker.com/compose/install/) (biasanya sudah termasuk dalam Docker Desktop).

### 2. Setup

a. **Clone Repositori** (jika ini adalah repo git) atau simpan semua file dari Canvas ke dalam satu direktori.

b. **Konfigurasi API Keys**
   - Buat file bernama `.env` di direktori root proyek.
   - Tambahkan baris berikut ke `.env` dan ganti dengan API key Anda:
     ```
     ETHERSCAN_API_KEY="GANTI_DENGAN_API_KEY_ETHERSCAN_ANDA"
     GEMINI_API_KEY="GANTI_DENGAN_API_KEY_GEMINI_ANDA"
     ```
   - Dapatkan API key dari [Etherscan](https://etherscan.io/myapikey) dan [Google AI Studio](https://aistudio.google.com/app/apikey).

### 3. Build dan Jalankan Container

Buka terminal di direktori root proyek dan jalankan perintah berikut:

```bash
docker-compose up --build
```

-   `--build`: Perintah ini akan memaksa Docker untuk membangun image dari `Dockerfile` saat pertama kali dijalankan atau jika `Dockerfile` berubah.
-   Tunggu hingga proses build selesai dan Anda melihat log dari Uvicorn yang menandakan server sudah berjalan.

Server akan dapat diakses di `http://localhost:8000`.

### 4. Kirim Request untuk Analisis

Gunakan `curl` atau tool API lainnya untuk mengirim request `POST` ke endpoint `/analyze`. Body dari request haruslah file JSON yang strukturnya sama dengan `response_baru.json` yang Anda miliki.

**Contoh menggunakan `curl`:**
```bash
curl -X POST "http://localhost:8000/analyze" \
-H "Content-Type: application/json" \
--data-binary "@path/to/your/response_baru.json"
```
*Ganti `@path/to/your/response_baru.json` dengan path sebenarnya ke file JSON Anda.*

### 5. Menghentikan Aplikasi

Tekan `Ctrl + C` di terminal tempat `docker-compose` berjalan. Untuk membersihkan container dan network, jalankan:
```bash
docker-compose down
```

## Alur Kerja API

1.  **POST `/analyze`**: Anda mengirimkan konten JSON lengkap ke endpoint ini.
2.  **Ekstraksi & Pengambilan Kode**: Server mengekstrak `token_address` dan `solidity_version` dari metadata JSON.
3.  **Pengambilan Source Code**: Server menggunakan Etherscan API untuk mengambil kode sumber kontrak.
4.  **Analisis Paralel**:
    -   Sebuah *task* dikirim ke `static_analyzer.py` dengan *source code* dan versi solc yang sesuai.
    -   Sebuah *task* lain dikirim ke `llm_analyzer.py` dengan *seluruh JSON input* sebagai basis pengetahuan (KAG).
5.  **Respons**: Setelah kedua *task* selesai, server akan menggabungkan hasilnya ke dalam satu objek JSON dan mengirimkannya kembali sebagai respons.
