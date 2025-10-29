# Penjelasan Logika `handleEdit`

Fungsi `handleEdit` bertujuan untuk memperbarui jumlah (kuantitas) barang di dalam keranjang belanja dan secara bersamaan menyesuaikan stok produk yang tersedia.

### Penjelasan Langkah-demi-Langkah:

1.  **Mencari Item & Produk Terkait**

    - Fungsi ini pertama-tama mencari item yang mau diubah di dalam `carts` (state keranjang) berdasarkan `id`-nya.
    - Setelah itu, ia mencari detail produk (terutama info stok) di dalam `products` (state produk) yang sesuai dengan `productId` dari item keranjang tadi.
    - Jika salah satunya tidak ditemukan, fungsi akan berhenti untuk mencegah error.

2.  **Menghitung Perbedaan Kuantitas (`diff`)**

    - Ini adalah bagian paling krusial: `const diff = newQty - findCart.qty;`.
    - `diff` menghitung selisih antara kuantitas **baru** (`newQty`) dan kuantitas **lama** (`findCart.qty`).
    - **Jika `diff` positif (+)**: Artinya pengguna **menambah** jumlah barang (misal: dari 2 menjadi 5, `diff` = 3).
    - **Jika `diff` negatif (-)**: Artinya pengguna **mengurangi** jumlah barang (misal: dari 5 menjadi 3, `diff` = -2).

3.  **Pengecekan Stok**

    - `if (diff > 0 && findProduct.stock < diff)`: Pengecekan ini hanya terjadi jika pengguna **menambah** barang (`diff > 0`).
    - Fungsi akan memeriksa apakah stok yang tersedia (`findProduct.stock`) cukup untuk penambahan tersebut (`diff`).
    - Jika stok kurang, akan muncul peringatan "Stok tidak mencukupi!" dan fungsi berhenti.

4.  **Memperbarui Stok Produk (`setProducts`)**

    - Logika `stock: product.stock - diff` secara cerdas menangani penambahan dan pengurangan stok.
    - **Saat Menambah Barang (diff positif)**: Stok akan berkurang. Contoh: `stock: 10 - 3 = 7`.
    - **Saat Mengurangi Barang (diff negatif)**: Stok akan bertambah kembali. Karena `diff` bernilai negatif, pengurangan dengan nilai negatif menjadi penjumlahan. Contoh: `stock: 7 - (-2)` sama dengan `7 + 2 = 9`. Ini mengembalikan barang ke dalam stok.

5.  **Memperbarui Item Keranjang (`setCarts`)**
    - Terakhir, fungsi ini memperbarui item di dalam keranjang (`carts`).
    - `qty` diubah menjadi `newQty` (kuantitas baru).
    - `total` harga untuk item tersebut dihitung ulang (`harga * kuantitas baru`).

### Kesimpulan

Secara sederhana, fungsi `handleEdit` ini memastikan bahwa setiap kali kuantitas barang di keranjang diubah, stok produk yang bersangkutan juga ikut diperbarui secara akurat—berkurang saat barang ditambahkan ke keranjang, dan bertambah kembali saat barang dikurangi dari keranjang. Logika ini juga mencegah pengguna memesan lebih banyak barang daripada stok yang ada.
