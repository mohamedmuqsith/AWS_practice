import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';
import { grammarSteps } from '../src/data/grammarData.js';
import { HfInference } from '@huggingface/inference';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root if it exists (for local dev)
// On hosting platforms, variables are usually injected via process.env automatically.
dotenv.config(); 


const app = express();

// Health Check for Deployment
app.get('/api/health', async (req, res) => {
  let dbStatus = 'checking...';
  try {
    await pool.query('SELECT 1');
    dbStatus = 'connected';
  } catch (err) {
    dbStatus = `error: ${err.message}`;
  }

  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    database: dbStatus,
    env: {
      hasToken: !!process.env.HUGGINGFACE_TOKEN,
      tokenLength: process.env.HUGGINGFACE_TOKEN ? process.env.HUGGINGFACE_TOKEN.length : 0,
      nodeEnv: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 5000
    }
  });
});

app.use(cors());
app.use(express.json());


// Initialize database tables on startup
const initDB = async () => {
  try {
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

    const createChatMessagesTable = `
      CREATE TABLE IF NOT EXISTS chat_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        sender ENUM('user', 'bot') NOT NULL,
        text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await pool.query(createStepsTable);
    await pool.query(createSectionsTable);
    await pool.query(createExamplesTable);
    await pool.query(createChatMessagesTable);
    console.log('Database tables verified/created.');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Initial run
initDB();

// Initialize database route
app.get('/api/init', async (req, res) => {
  try {
    console.log('Starting full database data reset...');
    await initDB();

    // Clear existing data
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    await pool.query('TRUNCATE TABLE examples');
    await pool.query('TRUNCATE TABLE sections');
    await pool.query('TRUNCATE TABLE steps');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Existing data cleared.');

    // Insert grammar data
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

    console.log('Database initialized successfully!');
    res.json({ success: true, message: 'Database initialized with grammar data' });
  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).json({ error: 'Failed to initialize database', details: error.message });
  }
});

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
  // Use a more robust ID generation: stepId + slug + random string or just let DB handle it?
  // Given the current schema uses VARCHAR PRIMARY KEY, we'll prefix with stepId.
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const sectionId = `${stepId}-${slug}-${Math.random().toString(36).substring(2, 7)}`;
  
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

// ===== CHAT AI ENDPOINTS =====
const SYSTEM_PROMPT = `You are a helpful and expert English Grammar Tutor. Your goal is to help users learn English.
- Use the provided context from the app's grammar database if available.
- If the user asks a question in Tamil, explain it in Tamil but provide English examples.
- If the user asks in English, respond in English.
- Be encouraging, patient, and provide clear examples.
- You can correct the user's grammar mistakes.
- Keep responses concise and formatted for a chat interface.`;

// Helper to search local database for relevant grammar info
async function searchLocalGrammar(query) {
  try {
    const keywords = query.toLowerCase().split(' ').filter(w => w.length > 3);
    if (keywords.length === 0) return null;

    // Search for sections that match keywords in title or pattern
    let sql = 'SELECT s.title, s.pattern, s.content, st.title as lesson_title FROM sections s JOIN steps st ON s.step_id = st.id WHERE ';
    const conditions = keywords.map(() => '(s.title LIKE ? OR s.pattern LIKE ? OR st.title LIKE ?)').join(' OR ');
    const params = keywords.flatMap(k => [`%${k}%`, `%${k}%`, `%${k}%`]);

    const [sections] = await pool.query(sql + conditions + ' LIMIT 1', params);
    
    if (sections.length > 0) {
      const section = sections[0];
      // Get examples for this section
      const [examples] = await pool.query('SELECT content FROM examples WHERE section_id = ? LIMIT 3', [section.id]);
      return {
        ...section,
        examples: examples.map(e => e.content)
      };
    }
    return null;
  } catch (error) {
    console.error('Local search error:', error);
    return null;
  }
}

app.get('/api/chat/history/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC', [sessionId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

app.post('/api/chat', async (req, res) => {
  const { sessionId, message } = req.body;

  try {
    // 1. Save user message
    await pool.query('INSERT INTO chat_messages (session_id, sender, text) VALUES (?, ?, ?)', [sessionId, 'user', message]);

    // 2. Search local database for context
    const localData = await searchLocalGrammar(message);
    let contextPrompt = "";
    if (localData) {
      contextPrompt = `\n\nCONTEXT FROM OUR DATABASE:\nLesson: ${localData.lesson_title}\nSection: ${localData.title}\nPattern: ${localData.pattern || 'N/A'}\nExplanation: ${localData.content || 'N/A'}\nExamples: ${localData.examples?.join(', ') || 'N/A'}`;
    }

    // 3. Prepare AI Prompt for Hugging Face (ChatML format)
    const [history] = await pool.query('SELECT sender, text FROM chat_messages WHERE session_id = ? ORDER BY created_at DESC LIMIT 6', [sessionId]);
    const chatHistory = history.reverse().map(h => ({
      role: h.sender === 'user' ? 'user' : 'assistant',
      content: h.text
    }));

    let botText = "";
    
    // 4. Try Hugging Face API
    const token = (process.env.HUGGINGFACE_TOKEN || '').trim();
    if (token) {
      try {
        const hf = new HfInference(token);
        const response = await hf.chatCompletion({
          model: "mistralai/Mistral-7B-Instruct-v0.2",
          messages: [
            { role: "system", content: SYSTEM_PROMPT + contextPrompt },
            ...chatHistory
          ],
          max_tokens: 1024,
          temperature: 0.7,
        });

        if (response.choices?.[0]?.message?.content) {
          botText = response.choices[0].message.content;
        } else {
          console.error('Hugging Face Response empty or malformed:', response);
        }
      } catch (aiError) {
        console.error('AI Call Error:', aiError.message);
        try {
          if (aiError.httpResponse && typeof aiError.httpResponse.text === 'function') {
            const errBody = await aiError.httpResponse.text();
            console.error('Error Body:', errBody);
          }
        } catch (innerErr) {
          console.error('Could not parse error body');
        }
      }
    } else {
      console.error('AI Call skipped: No HUGGINGFACE_TOKEN found in process.env');
    }

    // 5. Fallback: If AI fails OR limit reached, use local data directly
    if (!botText) {
      if (localData) {
        botText = `I'm currently in offline mode (AI limit reached). Here is what I found in our Grammar Lessons about "${localData.title}":\n\n${localData.content || 'Please refer to the lesson area.'}\n\nPattern: ${localData.pattern || 'N/A'}\n\nExample: ${localData.examples?.[0] || 'Check the lesson examples!'}`;
      } else {
        botText = "I'm currently in offline mode and couldn't find a specific match in our lessons. Please try again later or browse the lessons sidebar!";
      }
    }

    // 6. Save and return bot response
    await pool.query('INSERT INTO chat_messages (session_id, sender, text) VALUES (?, ?, ?)', [sessionId, 'bot', botText]);
    res.json({ text: botText });

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Failed to process chat' });
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
const frontendPath = path.resolve(__dirname, '../dist');
console.log('Serving frontend from:', frontendPath);
app.use(express.static(frontendPath));

app.use((req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
