# Logic Math.max() dan Math.min()

## Math.max() pada Tombol Kurang (-)

Pada tombol kurang, kodenya adalah `setEditingQty((prev) => Math.max(1, prev - 1))`.

`prev - 1` : Ini adalah nilai kuantitas yang baru setelah dikurangi 1.

`Math.max(1, ...)` : Fungsi ini akan membandingkan dua nilai, yaitu 1 dan hasil dari pengurangan (`prev - 1`), lalu akan mengambil nilai terbesar di antara keduanya.

### Contoh

Jika `editingQty` saat ini 3:

`prev - 1` = 3 - 1 = 2.

`Math.max(1, 2)` akan memilih 2. Jadi, `editingQty` menjadi 2.

Jika `editingQty` saat ini 1:

`prev - 1` = 1 - 1 = 0.

`Math.max(1, 0)` akan memilih 1. Jadi, `editingQty` tetap 1.

Dengan cara ini, kamu mencegah kuantitas turun di bawah 1, karena `Math.max()` akan selalu memastikan nilai minimalnya adalah 1.

## Math.min() pada Tombol Tambah (+)

Pada tombol tambah, kodenya adalah `setEditingQty((prev) => Math.min(prev + 1, availableStock))`.

`prev + 1` : Ini adalah nilai kuantitas yang baru setelah ditambah 1.

`Math.min(..., availableStock)` : Fungsi ini akan membandingkan dua nilai, yaitu hasil dari penambahan (`prev + 1`) dan nilai `availableStock`, lalu akan mengambil nilai terkecil di antara keduanya.

### Contoh

Jika `editingQty` saat ini 5 dan `availableStock` adalah 10:

`prev + 1` = 5 + 1 = 6.

`Math.min(6, 10)` akan memilih 6. Jadi, `editingQty` menjadi 6.

Jika `editingQty` saat ini 10 dan `availableStock` adalah 10:

`prev + 1` = 10 + 1 = 11.

`Math.min(11, 10)` akan memilih 10. Jadi, `editingQty` tetap 10.

Dengan cara ini, kamu mencegah kuantitas melebihi stok yang tersedia, karena `Math.min()` akan selalu memastikan nilai maksimalnya adalah `availableStock`.
