const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Middleware for JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234', // Replace with your MySQL password
    database: 'findstore' // Replace with your database name
});

// Connect to the MySQL database
connection.connect((error) => {
    if (error) {
        console.error('Error connecting to the database:', error);
        return;
    }
    console.log('Connected to the database');
});

// Create a new store
app.post('/stores', (req, res) => {
    const { store_ID, StoreName, StoreItem } = req.body;
    connection.query('INSERT INTO stores (store_ID, StoreName, StoreItem) VALUES (?, ?, ?)', [store_ID, StoreName, StoreItem], (error) => {
        if (error) {
            res.status(500).json({ error: 'Error creating store' });
        } else {
            res.status(200).json({ message: 'Store created successfully' });
        }
    });
});

// Read all stores
app.get('/stores', (req, res) => {
    connection.query('SELECT * FROM stores', (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error fetching stores' });
        } else {
            res.status(200).json(results);
        }
    });
});

// Update a store
app.put('/stores/:id', (req, res) => {
    const { id } = req.params;
    const { store_ID, StoreName, StoreItem } = req.body;

    let query = 'UPDATE stores SET ';
    let params = [];
    if (store_ID) {
        query += 'store_ID = ?, ';
        params.push(store_ID);
    }
    if (StoreName) {
        query += 'StoreName = ?, ';
        params.push(StoreName);
    }
    if (StoreItem) {
        query += 'StoreItem = ?, ';
        params.push(StoreItem);
    }
    query = query.slice(0, -2); // Remove trailing comma and space
    query += ' WHERE store_ID = ?';
    params.push(id);

    connection.query(query, params, (error) => {
        if (error) {
            res.status(500).json({ error: 'Error updating store' });
        } else {
            res.status(200).json({ message: 'Store updated successfully' });
        }
    });
});

// Delete a store
app.delete('/stores/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM stores WHERE store_ID = ?', [id], (error) => {
        if (error) {
            res.status(500).json({ error: 'Error deleting store' });
        } else {
            res.status(200).json({ message: 'Store deleted successfully' });
        }
    });
});

// Serve static HTML files from the 'public' directory
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/admin.html`);
});
