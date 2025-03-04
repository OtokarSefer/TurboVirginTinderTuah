async function createUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = 'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)';
  con.query(sql, [email, hashedPassword, 'Cooler name'], (err, result) => {
    if (err) throw err;
    console.log(`User ${email} created successfully!`);
    con.end();
  });
}

createUser('tester@example.com', 'password123456');
