# 📌 Perbandingan Cara Hitung Poin Reward (Prisma + Transaction)

## 📝 Kasus

Seorang pengguna akan mendapatkan **+10 poin** jika total belanjanya **>= 10.000**. Jika pengguna mengubah pesanannya (misalnya, mengubah kuantitas produk), maka poin reward harus disesuaikan kembali.

---

## 🚩 Cara 1: Cek Total Lama & Total Baru Secara Langsung

Pendekatan ini secara langsung memeriksa nilai total belanja sebelum dan sesudah perubahan, lalu melakukan operasi `decrement` dan `increment` secara terpisah.

### Kode

```javascript
// Cek total lama
if ((oldOrder.total as any) >= 10000) {
  await tx.user.update({
    where: { id: oldOrder.userId },
    data: { point: { decrement: 10 } },
  });
}

// Cek total baru
if (total >= 10000) {
  await tx.user.update({
    where: { id: oldOrder.userId },
    data: { point: { increment: 10 } },
  });
}
```

### ✅ Kelebihan

- **Sederhana:** Logikanya mudah dibaca dan dipahami.
- **Ringkas:** Hanya terdiri dari dua blok `if` yang terpisah.

### ⚠️ Kekurangan

- **Bisa terjadi pembaruan ganda (double update):**
  - **Kasus:** Total belanja lama >= 10.000 dan total belanja baru juga >= 10.000.
  - **Hasil:** Poin akan dikurangi 10, lalu langsung ditambahkan 10 lagi. Meskipun hasil akhirnya benar, ini menyebabkan dua _query_ `update` ke database yang tidak efisien.
- **Logika yang berlebihan:**
  - **Kasus:** Total belanja lama < 10.000 dan total belanja baru juga < 10.000.
  - **Hasil:** Tidak ada _query_ yang dieksekusi, tetapi kedua kondisi `if` tetap harus dievaluasi.

---

## 🚩 Cara 2: Cek Perubahan Status Kelayakan (Eligibility)

Pendekatan ini memeriksa apakah status kelayakan pengguna untuk mendapatkan poin berubah. Poin hanya akan diubah jika ada transisi dari "tidak layak" menjadi "layak", atau sebaliknya.

### Kode

```javascript
const total = (product.price as any) * qty;

const oldEligible = (oldOrder.total as any) >= 10000;
const newEligible = total >= 10000;

if (!oldEligible && newEligible) {
  // dulu belum dapat, sekarang dapat → tambahin poin
  await tx.user.update({
    where: { id: oldOrder.userId },
    data: { point: { increment: 10 } },
  });
} else if (oldEligible && !newEligible) {
  // dulu dapat, sekarang tidak → cabut poin
  await tx.user.update({
    where: { id: oldOrder.userId },
    data: { point: { decrement: 10 } },
  });
}
```

### ✅ Kelebihan

- **Lebih efisien:** Hanya ada satu _query_ `update` jika terjadi perubahan status. Tidak ada operasi yang tidak perlu.
- **Logika lebih jelas:** Pembaruan hanya terjadi saat ada perbedaan kondisi antara sebelum dan sesudah.
- **Aman dari pembaruan ganda.**

### ⚠️ Kekurangan

- Sedikit lebih panjang karena memerlukan variabel boolean tambahan (`oldEligible` & `newEligible`).

---

## 📊 Tabel Perbandingan

| Aspek              | Cara 1 (Langsung)         | Cara 2 (Cek Status)      |
| :----------------- | :------------------------ | :----------------------- |
| **Query Update**   | Bisa 0, 1, atau 2 _query_ | Pasti 0 atau 1 _query_   |
| **Efisiensi**      | ❌ Bisa berlebihan        | ✅ Lebih hemat           |
| **Kemudahan Baca** | ✅ Lebih ringkas          | ⚠️ Sedikit lebih panjang |
| **Keamanan**       | ❌ Rawan _double update_  | ✅ Aman                  |
| **Cocok Untuk**    | Kasus kecil / prototipe   | Produksi / data besar    |

---

## 🎯 Rekomendasi

- **Untuk belajar atau prototipe cepat:** Cara 1 sudah cukup baik dan mudah diimplementasikan.
- **Untuk lingkungan produksi atau yang mementingkan performa:** Cara 2 jauh lebih aman, efisien, dan skalabel.
