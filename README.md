## Cara Menjalankan Proyek

1. Aktifkan virtual environment:
    ```powershell
    venv\Scripts\Activate.ps1
    ```

2. Hentikan container Docker yang sedang berjalan (jika ada):
    ```bash
    docker compose down
    ```

3. Build ulang image Docker:
    ```bash
    docker compose build
    ```

4. Jalankan container Docker:
    ```bash
    docker compose up
    ```

> **Catatan:**  
> Pastikan untuk membaca _notes_ pada service `input` untuk informasi tambahan.
