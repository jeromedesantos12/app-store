# 💫 Infinite Scroll Pagination — Penjelasan Singkat & Inti Logika

## 🧩 Tujuan

Biar user bisa scroll terus tanpa halaman pindah (no page=2, page=3, dll). Alur datanya:

1. Client ambil batch pertama (`limit=10`).
2. Server balikin data + `nextCursor` (id item terakhir).
3. Saat user scroll ke bawah → client kirim request baru dengan `cursor=nextCursor`.
4. Server mulai ambil data setelah id itu.
5. Ulangi terus sampai `hasNextPage = false`.

---

## 🧠 Struktur Query (Server)

```ts
const take = Number(req.query.limit) || 10;
const cursor = req.query.cursor as string | undefined;
const search = req.query.search as string | undefined;

const users = await prisma.user.findMany({
  where: {
    deletedAt: null,
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    }),
  },
  orderBy: {
    createdAt: "desc",
  },
  take: take + 1, // ambil lebih satu untuk cek apakah masih ada data berikutnya
  ...(cursor && { cursor: { id: cursor }, skip: 1 }), // skip item yg jadi cursor
});
```

---

## 💬 Bagian yang ditanya

```ts
const nextItem = users.pop();
nextCursor = nextItem!.id;
```

### Penjelasan

- `take + 1` artinya ambil 11 data kalau limit 10.
- Kalau hasilnya 11 data, berarti masih ada page berikutnya.
- Kirim hanya 10 ke client, jadi `pop()` untuk mengambil data ke-11 (objek terakhir).
- `nextCursor` diisi dengan `id` dari item ke-11 itu.

Karena `users.pop()` mengembalikan 1 objek (bukan array), maka dipakai `nextItem!.id`, bukan `users.id`.

---

## 🧾 Contoh Response JSON

```json
{
  "data": [
    /* ...10 items... */
  ],
  "pagination": {
    "nextCursor": "uuid-dari-item-ke-11",
    "hasNextPage": true
  }
}
```

Jika jumlah data kurang dari `limit + 1`:

```json
{ "pagination": { "hasNextPage": false } }
```

---

## 🔍 Tentang Search

Search bisa disatukan dengan infinite scroll. Jika user ketik “Remito”, query tetap pakai `cursor` dengan tambahan filter `where` yang sama di setiap request.

Contoh:

```
GET /users?search=remito&limit=10&cursor=abc123
```

Artinya: ambil 10 user setelah id `abc123` yang mengandung kata “remito” di nama atau email.

Pastikan filter `where` konsisten selama proses (client tidak mengubah search term di tengah jalan).

---

## ✨ Kesimpulan

- limit: banyak data per batch
- cursor: titik terakhir batch sebelumnya
- take + 1: cek ada data lanjut
- pop(): buang item ke-11 dan simpan id-nya jadi nextCursor
- hasNextPage: true jika masih ada data lanjut
- search: bisa nyatu dengan pagination lewat filter `where`
