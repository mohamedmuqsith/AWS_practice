# Admin Panel Guide

## Accessing the Admin Panel

1. **Open the app** in your browser (e.g., `https://awspractice-xzzg3.sevalla.app`)
2. **Click the Shield button** 🛡️ in the bottom right corner
3. **Enter the password**: `Mu200535@1`
4. Click **Sign In**

## Understanding the Dashboard

After logging in, you'll see:
- **Stats Bar**: Shows total Lessons, Sections, and Examples
- **Lessons List**: All lessons with expand/collapse functionality
- **Add Lesson Button**: Create new lessons

## Adding Sections to a Lesson

1. Click on a **lesson card** to expand it
   - You'll see the lesson icon and title
   - Shows how many sections and examples exist
2. Inside the expanded lesson, click **"+ Add Section"** button
3. Fill in the form:
   - **Title**: Name of the section (e.g., "What is CAN?")
   - **Pattern**: Grammar pattern (e.g., "Subject + CAN + Base Verb")
4. Click **Save**
5. The section now appears in the list below

## Adding Examples to a Section

1. Click on a **section** to expand it
2. Inside the expanded section, click **"+ Add"** button
3. Type an example sentence (e.g., "I can close the door.")
4. Press **Enter** or click the Save button
5. Example appears in the list below

## Editing Content

- **Lesson Title**: Click the Edit icon (✏️) on the lesson card
- **Section Title**: Click the Edit icon inside the section
- **Example**: Click the Edit icon next to the example
- Press Enter to save or click the Save button

## Deleting Content

- **Lesson**: Click the Trash icon (🗑️) on the lesson card
- **Section**: Click the Trash icon inside the section
- **Example**: Click the Trash icon next to the example

## Debug Panel

In the **bottom right** (above the Shield button):
- **DB Status**: Shows if database is connected
  - 🟢 Green = Connected with data
  - 🔴 Red = Error or offline
  - 🟠 Orange = Empty database
- **Data Counts**: Shows current Steps, Sections, Examples
- **Init Database Button**: Appears if database is empty

## Initializing the Database

If you see "0 sections" or the sections aren't loading:

1. Click the **Debug Panel** (bottom right)
2. Click **"Init Database"** button
3. Wait for the confirmation message
4. The page will refresh automatically

## Tips & Troubleshooting

### Issue: "No sections available" message
- **Solution**: The lesson needs sections. Click the lesson to expand it, then click "Add Section"

### Issue: Added sections but not showing
- **Solution**: Click the lesson again to refresh the expanded view

### Issue: Debug panel shows "0 sections"
- **Solution**: Use the "Init Database" button to populate with default data

### Issue: Can't see "Add Section" button
- **Solution**: Make sure you've clicked on the lesson card to expand it first

## Admin Actions

- **Reset**: Click "Reset" in the header to restore all lessons to default
- **View Site**: Click "View Site" to go back to the learning interface
- **Logout**: Click "Logout" to exit admin panel

---

**Password Reminder**: `Mu200535@1`
