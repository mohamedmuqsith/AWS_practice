import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { grammarSteps } from '../src/data/grammarData.js';
import pool from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

async function seed() {
  console.log('Connecting to AWS RDS MySQL to initialize database...');

  // 1. Create a connection without database specified to create the DB
  const tempConn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  console.log('Creating database if not exists...');
  await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
  await tempConn.end();

  console.log('Database created. Connecting to pool...');
  
  // 2. Create tables
  const createStepsTable = `
    CREATE TABLE IF NOT EXISTS steps (
      id INT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      icon VARCHAR(50),
      color VARCHAR(255)
    )
  `;

  const createSectionsTable = `
    CREATE TABLE IF NOT EXISTS sections (
      id VARCHAR(255) PRIMARY KEY,
      step_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      pattern TEXT,
      content TEXT,
      FOREIGN KEY (step_id) REFERENCES steps(id) ON DELETE CASCADE
    )
  `;

  const createExamplesTable = `
    CREATE TABLE IF NOT EXISTS examples (
      id INT AUTO_INCREMENT PRIMARY KEY,
      section_id VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      display_order INT NOT NULL,
      FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
    )
  `;

  await pool.query(createStepsTable);
  await pool.query(createSectionsTable);
  await pool.query(createExamplesTable);
  
  console.log('Tables created. Clearing existing data...');
  await pool.query('SET FOREIGN_KEY_CHECKS = 0');
  await pool.query('TRUNCATE TABLE examples');
  await pool.query('TRUNCATE TABLE sections');
  await pool.query('TRUNCATE TABLE steps');
  await pool.query('SET FOREIGN_KEY_CHECKS = 1');

  console.log('Inserting default data...');
  
  for (const step of grammarSteps) {
    await pool.query('INSERT INTO steps (id, title, icon, color) VALUES (?, ?, ?, ?)', [
      step.id,
      step.title,
      step.icon || '📚',
      step.color || 'from-orange-400 to-orange-600'
    ]);

    if (step.sections) {
      for (const section of step.sections) {
        await pool.query('INSERT INTO sections (id, step_id, title, pattern, content) VALUES (?, ?, ?, ?, ?)', [
          section.id,
          step.id,
          section.title,
          section.pattern || null,
          section.content || null
        ]);

        if (section.examples) {
          for (let i = 0; i < section.examples.length; i++) {
            await pool.query('INSERT INTO examples (section_id, content, display_order) VALUES (?, ?, ?)', [
              section.id,
              section.examples[i],
              i
            ]);
          }
        }
      }
    }
  }

  console.log('Database seeded successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
