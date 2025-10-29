# Prisma: Increment & Decrement

Dokumen ini menjelaskan perilaku operasi `increment` dan `decrement` di Prisma, terutama saat berhadapan dengan nilai negatif.

## Konsep Inti

Di Prisma, `increment` dan `decrement` adalah operasi atomik yang digunakan untuk memodifikasi field numerik di database Anda. Perilakunya didasarkan pada aritmatika sederhana:

- **`increment`**: Menambahkan nilai ke sebuah field.

  - `increment: 10` setara dengan `field = field + 10`.
  - `increment: -10` setara dengan `field = field - 10`.

- **`decrement`**: Mengurangi nilai dari sebuah field.
  - `decrement: 10` setara dengan `field = field - 10`.
  - `decrement: -10` setara dengan `field = field - (-10)`, yang menghasilkan `field = field + 10`.

**Peringatan:** Meskipun menggunakan nilai negatif dengan `decrement` secara matematis berhasil, hal itu dapat membuat kode menjadi membingungkan dan kurang dapat dibaca. Sebaiknya gunakan `increment` untuk penambahan dan `decrement` untuk pengurangan demi menjaga kode tetap jelas dan semantik.

---

## Contoh 1: Memperbarui Stok Produk

Bayangkan Anda sedang memperbarui pesanan dan perlu menyesuaikan stok produk berdasarkan perbedaan kuantitas (`diffQty`).

- Jika `diffQty` positif, Anda perlu mengurangi stok.
- Jika `diffQty` negatif, Anda perlu menambah stok.

### Pendekatan Berisiko

Bergantung pada perilaku matematis `decrement` bisa jadi tidak jelas:

```typescript
// Jika diffQty bernilai -5, kode ini justru akan MENAMBAH stok sebanyak 5.
// Ini membingungkan bagi developer lain.
await tx.product.update({
  where: { id: oldOrder.productId, deletedAt: null },
  data: {
    stock: {
      decrement: diffQty,
    },
  },
});
```

### Pendekatan yang Direkomendasikan (Aman)

Gunakan pengecekan kondisional untuk secara eksplisit memakai `increment` atau `decrement`. Ini membuat tujuan kode Anda menjadi jelas.

```typescript
if (diffQty > 0) {
  // Kurangi stok karena kuantitas pesanan baru lebih tinggi.
  await tx.product.update({
    where: { id: oldOrder.productId, deletedAt: null },
    data: {
      stock: {
        decrement: diffQty,
      },
    },
  });
} else if (diffQty < 0) {
  // Tambah stok karena kuantitas pesanan baru lebih rendah.
  await tx.product.update({
    where: { id: oldOrder.productId, deletedAt: null },
    data: {
      stock: {
        increment: Math.abs(diffQty), // Gunakan Math.abs untuk kejelasan
      },
    },
  });
}
```

---

## Contoh 2: Memperbarui Poin Pengguna

Prinsip yang sama berlaku saat memodifikasi poin pengguna berdasarkan status kelayakan (`eligibility`).

### Logika

- Jika pengguna menjadi layak (`!oldEligible && newEligible`), mereka mendapatkan 10 poin.
- Jika pengguna tidak lagi layak (`oldEligible && !newEligible`), mereka kehilangan 10 poin, tetapi hanya jika saldo poin mereka lebih dari 0.

### Implementasi

Kode ini dengan benar menggunakan `increment` untuk menambah poin dan `decrement` untuk menguranginya. Kode ini juga menyertakan _guard_ untuk mencegah saldo poin menjadi negatif.

```typescript
// Pengguna menjadi layak, berikan poin.
if (!oldEligible && newEligible) {
  await tx.user.update({
    where: { id: oldOrder.userId, deletedAt: null },
    data: {
      point: {
        increment: 10,
      },
    },
  });
}
// Pengguna tidak lagi layak, cabut poin jika ada.
else if (oldEligible && !newEligible && user?.point && user.point > 0) {
  await tx.user.update({
    where: { id: oldOrder.userId, deletedAt: null },
    data: {
      point: {
        decrement: 10,
      },
    },
  });
}
```

## Praktik Terbaik

Untuk memastikan kode Anda dapat dibaca, mudah dipelihara, dan bebas dari perilaku tak terduga, selalu gunakan:

- **`increment`** untuk operasi penambahan.
- **`decrement`** untuk operasi pengurangan.

Hindari penggunaan angka negatif dengan operator ini. Sebaliknya, gunakan logika kondisional untuk memilih operator yang benar sesuai dengan aturan bisnis Anda.
