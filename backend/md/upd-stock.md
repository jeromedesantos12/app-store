# 📌 Perbandingan Cara Update Stock Saat Edit Order (Prisma)

## 📝 Kasus

Saat pengguna mengubah kuantitas (qty) pada sebuah pesanan, stok produk harus disesuaikan secara otomatis.

- Jika kuantitas baru **lebih banyak**, maka stok produk **berkurang**.
- Jika kuantitas baru **lebih sedikit**, maka stok produk **bertambah** kembali.

---

## 🚩 Cara 1: Menggunakan Selisih Kuantitas (`diffQty`)

Pendekatan ini menghitung selisih antara kuantitas baru dan lama, lalu menggunakan selisih tersebut untuk memperbarui stok.

### Kode

```javascript
const diffQty = qty - oldOrder.qty;

// Validasi stok hanya jika kuantitas bertambah
if (diffQty > 0 && product.stock < diffQty) {
  throw appError("Insufficient stock!", 400);
}

if (diffQty > 0) {
  // Kuantitas bertambah → stok berkurang
  await tx.product.update({
    where: { id: oldOrder.productId },
    data: { stock: { decrement: diffQty } },
  });
} else if (diffQty < 0) {
  // Kuantitas berkurang → stok bertambah
  await tx.product.update({
    where: { id: oldOrder.productId },
    data: { stock: { increment: Math.abs(diffQty) } },
  });
}
```

### ✅ Kelebihan

- **Ringkas & Efisien:** Cukup menghitung selisih (`diffQty`) satu kali.
- **Satu Query Update:** Selalu menghasilkan maksimal satu query `update` ke database (jika ada perubahan).

### ⚠️ Kekurangan

- **Validasi Stok Perlu Perhatian:** Logika validasi `product.stock < diffQty` harus ditempatkan dengan benar (hanya saat `diffQty > 0`) agar tidak salah memblokir pengurangan kuantitas.

---

## 🚩 Cara 2: Membandingkan Kuantitas Lama vs. Baru Secara Eksplisit

Pendekatan ini secara eksplisit membandingkan apakah kuantitas baru lebih besar atau lebih kecil dari kuantitas lama, lalu menjalankan logika yang terpisah untuk setiap kasus.

### Kode

```javascript
if (qty > oldOrder.qty) {
  const tambah = qty - oldOrder.qty;
  if (product.stock < tambah) {
    throw appError("Insufficient stock!", 400);
  }
  await tx.product.update({
    where: { id: oldOrder.productId },
    data: { stock: { decrement: tambah } },
  });
} else if (qty < oldOrder.qty) {
  const kurang = oldOrder.qty - qty;
  await tx.product.update({
    where: { id: oldOrder.productId },
    data: { stock: { increment: kurang } },
  });
}
```

### ✅ Kelebihan

- **Sangat Jelas (Eksplisit):** Alur logikanya sangat mudah dibaca dan dipahami, bahkan oleh developer junior.
- **Validasi Stok Intuitif:** Pengecekan stok ditempatkan secara alami di dalam blok kondisi penambahan kuantitas, sehingga mengurangi risiko kesalahan logika.

### ⚠️ Kekurangan

- **Lebih Verbose:** Membutuhkan deklarasi variabel terpisah (`tambah`, `kurang`) dan kode yang sedikit lebih panjang.

---

## 📊 Tabel Perbandingan

| Aspek                    | Cara 1 (`diffQty`)                               | Cara 2 (Eksplisit)                    |
| :----------------------- | :----------------------------------------------- | :------------------------------------ |
| **Keringkasan Kode**     | ✅ Sangat ringkas                                | ❌ Lebih panjang                      |
| **Keterbacaan**          | ⚠️ Perlu memahami `diffQty` bisa positif/negatif | ✅ Sangat jelas dan mudah dibaca      |
| **Logika Validasi Stok** | Perlu kehati-hatian dalam penempatan kondisi     | Lebih natural dan intuitif            |
| **Cocok Untuk**          | Developer berpengalaman, proyek solo/kecil       | Tim besar, mengutamakan _readability_ |

---

## 🎯 Rekomendasi

- **Untuk efisiensi dan keringkasan kode:** **Cara 1 (`diffQty`)** adalah pilihan yang sangat baik.
- **Untuk proyek tim besar yang mengutamakan keterbacaan:** **Cara 2 (Eksplisit)** lebih aman dan mudah dipahami oleh semua anggota tim.
