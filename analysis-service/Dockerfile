FROM python:3.10-slim

WORKDIR /app

ENV PYTHONPATH=/app

# Non-interactive frontend untuk apt-get untuk menghindari prompt
ENV DEBIAN_FRONTEND=noninteractive

# Update package lists dan instal dependensi sistem
# - git: dibutuhkan oleh beberapa tool python
# - build-essential: dibutuhkan untuk kompilasi beberapa paket
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    build-essential \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Instal solc-select untuk manajemen versi Solidity compiler
RUN pip install solc-select==1.0.3

# Instal versi solc yang umum digunakan. Tambahkan versi lain jika perlu.
RUN solc-select install 0.8.24 && \
    solc-select install 0.8.20 && \
    solc-select install 0.8.10 && \
    solc-select install 0.7.6 && \
    solc-select install 0.6.12

# Set versi default solc
RUN solc-select use 0.8.24

# Instal tool analisis statis
RUN pip install slither-analyzer==0.10.2
RUN pip install mythril==0.24.8

# Salin file requirements.txt terlebih dahulu untuk caching layer Docker
COPY requirements.txt .

# Instal dependensi Python dari requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Salin semua file aplikasi ke dalam working directory
COPY . .

# Expose port yang akan digunakan oleh FastAPI
EXPOSE 8000

# Perintah default untuk menjalankan aplikasi saat container dimulai
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]