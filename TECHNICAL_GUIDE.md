# Technical Guide: Data Flow & Troubleshooting

## How Data Loads

```
App.jsx
  ↓
GrammarContext.jsx (useGrammar hook)
  ↓
fetchGrammarData() called on component mount
  ↓
1. Try to fetch from /api/grammar endpoint
  ├─ Success? Return database data ✅
  └─ Empty or Error? → Load fallback
     ↓
2. Import fallback from ../data/grammarData.js
  ├─ Success? Use fallback data ✅
  └─ Error? Set steps to empty array ❌
  ↓
State updated with steps
  ↓
Components receive steps via context
```

## Data Structure

### Step (Lesson)
```javascript
{
  id: 1,
  title: "Modal Verb: CAN",
  icon: "🎯",
  color: "from-blue-400 to-blue-600",
  sections: [ ... ]
}
```

### Section
```javascript
{
  id: "can-intro",
  title: "What is CAN?",
  pattern: "Optional pattern string",
  content: "Optional content description",
  examples: [ ... ]
}
```

### Example
```javascript
"I can close the door." // Just a string
```

## Debugging Steps

### 1. Check Browser Console (F12)
Look for these messages:
- `✅ Loaded data from database: X steps` → Database is working
- `⚠️ Database empty, loading fallback data...` → Database exists but empty
- `❌ Error loading grammar data from database:` → Database connection failed
- `✅ Loaded fallback data: X steps` → Using local fallback

### 2. Check Network Tab (F12 → Network)
Look for API calls:
- GET `/api/grammar` → Response should be JSON array of steps
- GET `/api/init` → Response should be `{success: true}`

### 3. Expand the Debug Panel
- Click **DEBUG INFO** in bottom right
- Shows current DB status and data counts
- Click **Init Database** if status is EMPTY or OFFLINE

### 4. Check Admin Panel Stats
- Login to admin panel (Shield button)
- Top of panel shows:
  - **Lessons**: Number of steps loaded
  - **Sections**: Total sections across all steps
  - **Examples**: Total examples across all sections

## Common Issues & Solutions

### Issue: Browser shows "Cannot read properties of undefined (reading 'title')"
**Cause**: currentSection is null because step has no sections
**Solution**: 
1. Open Debug Panel
2. Click "Init Database"
3. Refresh page (F5)

### Issue: Admin Panel shows "0 sections" or "0 examples"
**Cause**: Database initialized but empty, or steps not properly loaded
**Solution**:
1. Click on a lesson to expand it
2. Click "Add Section" button
3. Fill in section details and save
4. Can now add examples to that section

### Issue: "No sections available. Please initialize the database."
**Cause**: The current step exists but has no sections
**Solution**:
1. Open Admin Panel (Shield button, password: Mu200535@1)
2. Expand the lesson showing this error
3. Click "Add Section"
4. Add at least one section
5. Refresh the page to see it appear

### Issue: API endpoint returns 500 error
**Cause**: Database connection failed or malformed request
**Solution**:
1. Check database credentials in .env
2. Verify AWS security group allows MySQL traffic
3. Check server logs in Sevalla dashboard
4. Try initializing database via /api/init endpoint

### Issue: Fallback data not loading
**Cause**: grammarData.js file is missing or has syntax error
**Solution**:
1. Check that file exists: `src/data/grammarData.js`
2. Check for JavaScript syntax errors (console will show)
3. Verify it has `export const grammarSteps = [...]`

## Database Schema

```sql
CREATE TABLE steps (
  id INT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  icon VARCHAR(50),
  color VARCHAR(255)
);

CREATE TABLE sections (
  id VARCHAR(255) PRIMARY KEY,
  step_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  pattern TEXT,
  content TEXT,
  FOREIGN KEY (step_id) REFERENCES steps(id) ON DELETE CASCADE
);

CREATE TABLE examples (
  id INT AUTO_INCREMENT PRIMARY KEY,
  section_id VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  display_order INT NOT NULL,
  FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
);
```

## Testing the API

### Test Database Connection
```bash
curl https://your-domain/api/grammar
# Should return JSON array or empty array
```

### Test Database Initialization
```bash
curl https://your-domain/api/init
# Should return {"success": true, "message": "..."}
```

### Test Creating a Lesson (requires authenticated request in production)
```bash
curl -X POST https://your-domain/api/steps \
  -H "Content-Type: application/json" \
  -d '{"title":"New Lesson","icon":"📚","color":"blue"}'
```

## Development Workflow

1. **Make changes to the code**
2. **Build the React app**: `npm run build`
3. **Start the server**: `npm start` (or `node server/index.js`)
4. **Visit**: http://localhost:5000
5. **Check console** (F12) for errors and data loading messages
6. **Test admin panel**: Click Shield button, login with password

## Environment Variables

Required in `.env` for database:
```env
DB_HOST=your-rds-instance.rds.amazonaws.com
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=your_password
DB_NAME=english_grammar
```

Optional:
```env
PORT=5000  # Server port, defaults to 5000
NODE_ENV=production
```

## Component Tree

```
App
├── Header
├── Sidebar
│   └── Steps list (clickable)
├── ContentArea
│   ├── Hero section (if no step selected)
│   ├── Lesson banner
│   ├── Section tabs
│   ├── Pattern card
│   └── Examples list
├── AdminPanel (if admin logged in)
│   ├── Stats
│   ├── Lessons list (expandable)
│   │   ├── Sections list (expandable)
│   │   │   ├── Examples list (expandable)
│   │   │   └── Forms (add/edit/delete)
│   │   └── Forms (add/edit/delete)
├── AdminLogin (if trying to access admin)
└── DebugPanel
    ├── DB Status indicator
    ├── Data counts
    └── Init button (if needed)
```

## Key Files

| File | Purpose |
|------|---------|
| `src/context/GrammarContext.jsx` | Global state management, API calls |
| `src/data/grammarData.js` | Fallback data (lessons with sections/examples) |
| `server/index.js` | Express server, API endpoints |
| `server/db.js` | Database connection setup |
| `src/components/AdminPanel.jsx` | Admin UI for managing content |
| `src/components/DebugPanel.jsx` | Debug information and database init |
| `src/components/ContentArea.jsx` | Main learning interface |

## Performance Tips

- Database queries are fetched once on app load
- Data is cached in React context
- Admin changes trigger state update immediately
- For production, consider:
  - Database indexing on step_id, section_id
  - Pagination for large datasets
  - Caching headers on static content
