# Deployment Checklist

## Before Deploying

- [ ] Database credentials are in `.env` file:
  ```
  DB_HOST=your-rds-instance.amazonaws.com
  DB_PORT=3306
  DB_USER=admin
  DB_PASSWORD=your_password
  DB_NAME=english_grammar
  ```

- [ ] `.env` file is added to `.gitignore`
- [ ] AWS RDS security group allows MySQL (port 3306) from your server IP

## After Deploying to Sevalla

### Step 1: Verify the App Loads
1. Visit your app URL (e.g., `https://awspractice-xzzg3.sevalla.app`)
2. You should see the welcome page with "Master English Grammar"
3. Check browser console for any errors (F12 → Console tab)

### Step 2: Initialize Database
1. Click the **Shield button** (⛔) in bottom right
2. Enter password: `Mu200535@1`
3. If you see the admin panel → Database is initialized ✅
4. If you see a login prompt → Try initializing via debug panel:
   - Look for **Debug Panel** above the Shield button
   - If it shows "DB Status: EMPTY" or "DB Status: OFFLINE"
   - Click the **"Init Database"** button
   - Wait for success message and page refresh

### Step 3: Test the Content
1. After login, check the **Admin Panel**:
   - Should see statistics showing lessons, sections, examples
   - Should be able to expand lessons
2. Close admin panel (View Site button)
3. Try clicking on lessons in the main learning area:
   - Should see sections and examples
   - Should not see "No sections available" message

### Step 4: Test Admin Features
1. Open admin panel again
2. Expand any lesson
3. Click **"+ Add Section"** and add a test section
4. Expand the new section
5. Click **"+ Add"** and add a test example
6. Verify it appears in the list
7. Try editing and deleting it

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Page shows loading indefinitely | Check if API is responding (press F12 → Network tab) |
| "No sections available" in main view | Initialize database using Debug Panel |
| Can't see admin buttons | Try expanding a lesson first (click on lesson card) |
| Database Status shows "OFFLINE" | Check if server and database are running and connected |
| "Cannot read properties of undefined" error | Clear browser cache and refresh page |

## Environment Variables Reference

```env
# Database
DB_HOST=<your-aws-rds-endpoint>
DB_PORT=3306
DB_USER=<your-mysql-username>
DB_PASSWORD=<your-mysql-password>
DB_NAME=english_grammar

# Server
PORT=5000  # Optional, defaults to 5000

# Environment
NODE_ENV=production  # Optional
```

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/init` | GET | Initialize database with default data |
| `/api/grammar` | GET | Fetch all lessons with sections and examples |
| `/api/steps` | POST | Create new lesson |
| `/api/steps/:id` | PUT | Update lesson |
| `/api/steps/:id` | DELETE | Delete lesson |
| `/api/steps/:stepId/sections` | POST | Create section |
| `/api/steps/:stepId/sections/:sectionId` | PUT | Update section |
| `/api/steps/:stepId/sections/:sectionId` | DELETE | Delete section |
| `/api/steps/:stepId/sections/:sectionId/examples` | POST | Add example |
| `/api/steps/:stepId/sections/:sectionId/examples/:index` | PUT | Update example |
| `/api/steps/:stepId/sections/:sectionId/examples/:index` | DELETE | Delete example |
| `/api/reset` | POST | Reset to default data |

## Debug Commands

### Check Database Connection
```bash
# From your server terminal:
curl https://your-app-url/api/grammar
# Should return JSON array of lessons with sections
```

### Initialize Database
```bash
# Navigate to API endpoint in browser:
https://your-app-url/api/init
# Should see: {"success": true, "message": "Database initialized with grammar data"}
```

## Support

If issues persist:
1. Check server logs in Sevalla dashboard
2. Verify database credentials in `.env`
3. Ensure AWS security group allows traffic
4. Clear browser cache (Ctrl+Shift+Delete)
5. Try in a different browser
