import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(express.json());

// Get all grammar data
app.get('/api/grammar', async (req, res) => {
  try {
    const [stepsRows] = await pool.query('SELECT * FROM steps ORDER BY id ASC');
    const [sectionsRows] = await pool.query('SELECT * FROM sections');
    const [examplesRows] = await pool.query('SELECT * FROM examples ORDER BY display_order ASC');

    const steps = stepsRows.map(step => {
      const stepSections = sectionsRows.filter(sec => sec.step_id === step.id).map(sec => {
        const secExamples = examplesRows.filter(ex => ex.section_id === sec.id).map(ex => ex.content);
        return {
          id: sec.id,
          title: sec.title,
          pattern: sec.pattern,
          content: sec.content,
          examples: secExamples
        };
      });

      return {
        id: step.id,
        title: step.title,
        icon: step.icon,
        color: step.color,
        sections: stepSections
      };
    });

    res.json(steps);
  } catch (error) {
    console.error('Error fetching grammar data:', error);
    res.status(500).json({ error: 'Failed to fetch grammar data' });
  }
});

// Add a step
app.post('/api/steps', async (req, res) => {
  const { title, icon, color } = req.body;
  try {
    const [rows] = await pool.query('SELECT MAX(id) as maxId FROM steps');
    const newId = (rows[0].maxId || 0) + 1;
    await pool.query('INSERT INTO steps (id, title, icon, color) VALUES (?, ?, ?, ?)', [newId, title, icon, color]);
    res.json({ id: newId, title, icon, color, sections: [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add step' });
  }
});

// Update a step
app.put('/api/steps/:id', async (req, res) => {
  const { title, icon, color } = req.body;
  const { id } = req.params;
  try {
    const updates = [];
    const values = [];
    if (title) { updates.push('title = ?'); values.push(title); }
    if (icon) { updates.push('icon = ?'); values.push(icon); }
    if (color) { updates.push('color = ?'); values.push(color); }
    if (updates.length > 0) {
      values.push(id);
      await pool.query(`UPDATE steps SET ${updates.join(', ')} WHERE id = ?`, values);
    }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update step' });
  }
});

// Delete a step
app.delete('/api/steps/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM steps WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete step' });
  }
});

// Add a section
app.post('/api/steps/:stepId/sections', async (req, res) => {
  const { stepId } = req.params;
  const { title, pattern, content } = req.body;
  const sectionId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  try {
    await pool.query('INSERT INTO sections (id, step_id, title, pattern, content) VALUES (?, ?, ?, ?, ?)', [sectionId, stepId, title, pattern, content]);
    res.json({ id: sectionId, title, pattern, content, examples: [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add section' });
  }
});

// Update a section
app.put('/api/steps/:stepId/sections/:sectionId', async (req, res) => {
  const { sectionId } = req.params;
  const { title, pattern, content } = req.body;
  try {
    const updates = [];
    const values = [];
    if (title) { updates.push('title = ?'); values.push(title); }
    if (pattern !== undefined) { updates.push('pattern = ?'); values.push(pattern); }
    if (content !== undefined) { updates.push('content = ?'); values.push(content); }
    if (updates.length > 0) {
      values.push(sectionId);
      await pool.query(`UPDATE sections SET ${updates.join(', ')} WHERE id = ?`, values);
    }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update section' });
  }
});

// Delete a section
app.delete('/api/steps/:stepId/sections/:sectionId', async (req, res) => {
  try {
    await pool.query('DELETE FROM sections WHERE id = ?', [req.params.sectionId]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete section' });
  }
});

// Add an example
app.post('/api/steps/:stepId/sections/:sectionId/examples', async (req, res) => {
  const { sectionId } = req.params;
  const { content } = req.body;
  try {
    const [rows] = await pool.query('SELECT MAX(display_order) as maxOrder FROM examples WHERE section_id = ?', [sectionId]);
    const nextOrder = (rows[0].maxOrder !== null ? rows[0].maxOrder : -1) + 1;
    await pool.query('INSERT INTO examples (section_id, content, display_order) VALUES (?, ?, ?)', [sectionId, content, nextOrder]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add example' });
  }
});

// Update an example
// We use the array index (display_order) to identify the example to update
app.put('/api/steps/:stepId/sections/:sectionId/examples/:exampleIndex', async (req, res) => {
  const { sectionId, exampleIndex } = req.params;
  const { content } = req.body;
  try {
    const [rows] = await pool.query('SELECT id FROM examples WHERE section_id = ? ORDER BY display_order ASC LIMIT 1 OFFSET ?', [sectionId, parseInt(exampleIndex)]);
    if (rows.length === 0) return res.status(404).json({ error: 'Example not found' });
    await pool.query('UPDATE examples SET content = ? WHERE id = ?', [content, rows[0].id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update example' });
  }
});

// Delete an example
app.delete('/api/steps/:stepId/sections/:sectionId/examples/:exampleIndex', async (req, res) => {
  const { sectionId, exampleIndex } = req.params;
  try {
    const [rows] = await pool.query('SELECT id FROM examples WHERE section_id = ? ORDER BY display_order ASC LIMIT 1 OFFSET ?', [sectionId, parseInt(exampleIndex)]);
    if (rows.length === 0) return res.status(404).json({ error: 'Example not found' });
    await pool.query('DELETE FROM examples WHERE id = ?', [rows[0].id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete example' });
  }
});

// Reset database
app.post('/api/reset', async (req, res) => {
  try {
    // You could call a script or run the drop tables here, 
    // but for safety we might just return success or run a truncate
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset database' });
  }
});

// Serve static React build files in production
const frontendPath = path.join(__dirname, '../dist');
app.use(express.static(frontendPath));

app.use((req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
