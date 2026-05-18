# 🎯 START HERE - Upload LANsnix to GitHub

**Don't worry about coding! Just follow these simple steps.**

---

## 🎬 Video Tutorial Style Guide

### Option 1: Super Easy (Recommended) ⭐

**Just double-click this file:**
```
setup-git.bat
```

Then follow the prompts. That's it! 🎉

---

### Option 2: Step-by-Step (5 Minutes)

#### Step 1️⃣: Get Git

**Check if you have Git:**
1. Press `Windows Key + R`
2. Type: `cmd`
3. Press Enter
4. Type: `git --version`
5. Press Enter

**If you see a version number** → You have Git! Skip to Step 2

**If you see an error** → Install Git:
1. Go to: https://git-scm.com/download/win
2. Download and run the installer
3. Click "Next" on everything
4. Restart Command Prompt

---

#### Step 2️⃣: Create GitHub Account

1. Go to: https://github.com
2. Click the green "Sign up" button
3. Enter your email
4. Create a password
5. Choose a username (example: `ispawoo`)
6. Verify your email

**Done!** ✅

---

#### Step 3️⃣: Create Repository

1. Go to: https://github.com/new
2. Fill in:
   - **Repository name**: `lansnix`
   - **Description**: `Realtime LAN Discovery & Monitoring Platform`
   - Select: **Public**
   - **DO NOT** check any boxes
3. Click green "Create repository" button

**Done!** ✅

---

#### Step 4️⃣: Upload Your Code

1. Open Command Prompt in LANsnix folder:
   - Right-click in the folder
   - Select "Open in Terminal" or "Open Command Prompt here"

2. Copy and paste these commands ONE BY ONE:

**Command 1:** Initialize Git
```cmd
git init
```
Press Enter. You should see: "Initialized empty Git repository"

**Command 2:** Set your name (replace with YOUR name)
```cmd
git config --global user.name "Your Name"
```
Press Enter.

**Command 3:** Set your email (replace with YOUR email)
```cmd
git config --global user.email "your.email@example.com"
```
Press Enter.

**Command 4:** Add all files
```cmd
git add .
```
Press Enter. (This might take a few seconds)

**Command 5:** Create commit
```cmd
git commit -m "Initial commit: LANsnix v1.0.0"
```
Press Enter. You'll see a list of files.

**Command 6:** Connect to GitHub (replace YOUR-USERNAME)
```cmd
git remote add origin https://github.com/YOUR-USERNAME/lansnix.git
```
Example: `git remote add origin https://github.com/ispawoo/lansnix.git`
Press Enter.

**Command 7:** Set main branch
```cmd
git branch -M main
```
Press Enter.

**Command 8:** Upload to GitHub
```cmd
git push -u origin main
```
Press Enter.

**You'll be asked for:**
- Username: (your GitHub username)
- Password: (your GitHub password)

Type them and press Enter.

**Done!** 🎉

---

#### Step 5️⃣: Verify It Worked

1. Go to: `https://github.com/YOUR-USERNAME/lansnix`
2. You should see all your files!
3. The README should look nice with colors and formatting

**Success!** 🎊

---

## 🔑 If Password Doesn't Work

GitHub might require a "Personal Access Token" instead of password:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: `LANsnix Upload`
4. Check the box: `repo`
5. Scroll down and click "Generate token"
6. **COPY THE TOKEN** (looks like: `ghp_xxxxxxxxxxxx`)
7. Use this token as your password

---

## 🎨 Make It Look Professional

On your GitHub repository page:

1. Click ⚙️ (gear icon) next to "About"
2. Add topics: `network-monitoring`, `golang`, `nextjs`, `docker`, `linux`, `homelab`
3. Click "Save changes"

---

## 📁 Files to Help You

- **SIMPLE_INSTRUCTIONS.txt** - Text version of this guide
- **GITHUB_SETUP_GUIDE.md** - Detailed guide with troubleshooting
- **setup-git.bat** - Automated script (just double-click!)

---

## ❌ Common Problems

### "git is not recognized"
→ Install Git from: https://git-scm.com/download/win
→ Restart Command Prompt

### "Permission denied"
→ Use Personal Access Token instead of password (see above)

### "Repository not found"
→ Make sure you created the repository on GitHub first
→ Check the username in the URL is correct

### "Nothing to commit"
→ You already committed. Skip to: `git push -u origin main`

---

## 🎉 You're Done!

Your project is now on GitHub! 

**Your repository URL:**
```
https://github.com/YOUR-USERNAME/lansnix
```

**Share it on:**
- Reddit: r/selfhosted, r/homelab
- Twitter
- LinkedIn
- Your resume/portfolio

---

## 🔄 Future Updates

When you make changes:

```cmd
git add .
git commit -m "Updated something"
git push
```

---

## 📞 Still Stuck?

1. Read: **GITHUB_SETUP_GUIDE.md**
2. Watch: YouTube "How to push to GitHub"
3. Ask: https://stackoverflow.com

---

**Created by Yasir Ispawoo**

**You got this! 💪**
