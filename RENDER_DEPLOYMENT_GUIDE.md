# 24/7 BOT DEPLOYMENT GUIDE - RENDER

## QUICK SUMMARY
Your bot will run **FOREVER 24/7** on Render.com (completely free). No more sleeping!

---

## STEP 1: UPLOAD ALL BOT FILES TO GITHUB (20-30 minutes)

Go to: https://github.com/alexaterflix-tech/alexia-bot

### PART A: Files Already Uploaded (Verify they exist)
- ✅ package.json
- ✅ index.js
- ✅ config.json
- ✅ render.yaml
- ✅ Procfile
- ✅ account.txt
- ✅ .npmrc

### PART B: CRITICAL FILES - Copy/Paste Method

For EACH file below:
1. Open Replit → Open the file
2. Select ALL (Ctrl+A) → Copy (Ctrl+C)
3. Go to GitHub → Click "Add file" → "Create new file"
4. Type the filename
5. Paste the content (Ctrl+V)
6. Click "Commit changes"

**FILES TO UPLOAD:**
1. Goat.js
2. utils.js
3. updater.js
4. versions.json
5. .gitignore
6. fca-config.json
7. Copyright.txt

### PART C: FOLDER FILES - Create by Path

For each file path, GitHub will auto-create folders:

**logger/ folder files:**
- logger/log.js
- logger/logColor.js
- logger/loading.js

**scripts/cmds/ folder files** (Upload each):
- scripts/cmds/aigen.js
- scripts/cmds/cards.js
- scripts/cmds/trade.js
- scripts/cmds/cardshop.js
- scripts/cmds/yugioh.js
- (and all other .js files in this folder)

**scripts/data/ folder files:**
- scripts/data/cardsDatabase.js
- (and all other .js files in this folder)

**scripts/events/ folder files:**
- All .js files from scripts/events/

**bot/login/ folder files:**
- All .js files from bot/login/

**bot/handler/ folder files:**
- All .js files from bot/handler/

**dashboard/routes/ folder files:**
- All .js files from dashboard/routes/

**database/connectDB/ folder files:**
- All .js files from database/connectDB/

---

## STEP 2: VERIFY ON GITHUB

Go to: https://github.com/alexaterflix-tech/alexia-bot

Check that all folders and files are there (should show ~100+ files)

---

## STEP 3: DEPLOY ON RENDER

1. Go to your Render deployment: https://dashboard.render.com
2. Select **"alexia-bot"** service
3. Click **"Redeploy"** button
4. Wait 3-5 minutes (watch the logs)
5. Status changes to **"Live"** ✅

---

## STEP 4: YOUR BOT IS LIVE 24/7! 🚀

Your bot now runs FOREVER without stopping!
- ✅ Completely free
- ✅ Automatic restarts if it crashes
- ✅ No sleep, no offline periods
- ✅ Facebook Messenger working perfectly

---

## TROUBLESHOOTING

**If Render shows error about package.json:**
- Make sure package.json is at ROOT level (not in a subfolder)
- All other files should be at root or in proper subfolders

**If bot doesn't connect to Facebook:**
- Check account.txt has valid Facebook cookies
- Cookies auto-refresh every 24 hours

**Need help?**
All bot commands still work: *aigen, *cards, *trade, etc.
