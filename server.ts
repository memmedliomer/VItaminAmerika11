import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
//k
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Turso Client
const dbUrl = process.env.TURSO_DATABASE_URL;
const dbToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({
  url: dbUrl || 'file:local.db',
  authToken: dbToken,
});

// Initialize Database
async function initDb() {
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);
    await client.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        categoryId TEXT,
        imageUrl TEXT,
        FOREIGN KEY (categoryId) REFERENCES categories(id)
      )
    `);
    await client.execute(`
      CREATE TABLE IF NOT EXISTS promo_codes (
        code TEXT PRIMARY KEY,
        discountPercent INTEGER NOT NULL
      )
    `);
    await client.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customerName TEXT NOT NULL,
        customerSurname TEXT NOT NULL,
        phone TEXT NOT NULL,
        total REAL NOT NULL,
        date TEXT NOT NULL,
        items TEXT NOT NULL
      )
    `);

    // Initial data if empty
    const cats = await client.execute('SELECT COUNT(*) as count FROM categories');
    if (Number(cats.rows[0].count) === 0) {
      await client.execute("INSERT INTO categories (id, name) VALUES ('1', 'Vitaminlər'), ('2', 'Minerallar'), ('3', 'Omeqa-3')");
    }

    const prods = await client.execute('SELECT COUNT(*) as count FROM products');
    if (Number(prods.rows[0].count) === 0) {
      await client.execute(`
        INSERT INTO products (id, name, price, description, categoryId, imageUrl) VALUES 
        ('1', 'Vitamin C 1000mg', 25, 'İmmunitet sistemini gücləndirir. Gündə 1 tablet.', '1', 'https://picsum.photos/seed/vitaminc/400/400'),
        ('2', 'Omeqa-3 Balıq Yağı', 45, 'Ürək və beyin sağlamlığı üçün. Gündə 2 kapsul.', '3', 'https://picsum.photos/seed/omega3/400/400'),
        ('3', 'Maqnezium Sitrat', 30, 'Əzələ və sinir sistemi üçün. Gündə 1 tablet.', '2', 'https://picsum.photos/seed/magnesium/400/400')
      `);
    }

    const promos = await client.execute('SELECT COUNT(*) as count FROM promo_codes');
    if (Number(promos.rows[0].count) === 0) {
      await client.execute("INSERT INTO promo_codes (code, discountPercent) VALUES ('YENI10', 10)");
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

initDb();

// API Routes
app.get('/api/products', async (req, res) => {
  try {
    const result = await client.execute('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/products', async (req, res) => {
  const { id, name, price, description, categoryId, imageUrl } = req.body;
  try {
    await client.execute({
      sql: 'INSERT INTO products (id, name, price, description, categoryId, imageUrl) VALUES (?, ?, ?, ?, ?, ?)',
      args: [id, name, price, description, categoryId, imageUrl]
    });
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, description, categoryId, imageUrl } = req.body;
  try {
    await client.execute({
      sql: 'UPDATE products SET name = ?, price = ?, description = ?, categoryId = ?, imageUrl = ? WHERE id = ?',
      args: [name, price, description, categoryId, imageUrl, id]
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await client.execute({
      sql: 'DELETE FROM products WHERE id = ?',
      args: [id]
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const result = await client.execute('SELECT * FROM categories');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.post('/api/categories', async (req, res) => {
  const { id, name } = req.body;
  try {
    await client.execute({
      sql: 'INSERT INTO categories (id, name) VALUES (?, ?)',
      args: [id, name]
    });
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add category' });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await client.execute({
      sql: 'DELETE FROM categories WHERE id = ?',
      args: [id]
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

app.get('/api/promos', async (req, res) => {
  try {
    const result = await client.execute('SELECT * FROM promo_codes');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch promo codes' });
  }
});

app.post('/api/promos', async (req, res) => {
  const { code, discountPercent } = req.body;
  try {
    await client.execute({
      sql: 'INSERT INTO promo_codes (code, discountPercent) VALUES (?, ?)',
      args: [code, discountPercent]
    });
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add promo code' });
  }
});

app.delete('/api/promos/:code', async (req, res) => {
  const { code } = req.params;
  try {
    await client.execute({
      sql: 'DELETE FROM promo_codes WHERE code = ?',
      args: [code]
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete promo code' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const result = await client.execute('SELECT * FROM orders ORDER BY date DESC');
    const orders = result.rows.map(row => ({
      ...row,
      items: JSON.parse(row.items as string)
    }));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.post('/api/orders', async (req, res) => {
  const { id, customerName, customerSurname, phone, total, date, items } = req.body;
  try {
    await client.execute({
      sql: 'INSERT INTO orders (id, customerName, customerSurname, phone, total, date, items) VALUES (?, ?, ?, ?, ?, ?, ?)',
      args: [id, customerName, customerSurname, phone, total, date, JSON.stringify(items)]
    });
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add order' });
  }
});

// Vite middleware for development
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
