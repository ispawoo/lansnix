# 🚀 How to Upload LANsnix to GitHub

**Don't worry! This is super easy. Just follow these steps and copy-paste the commands.**

---

## Step 1: Create a GitHub Account (if you don't have one)

1. Go to https://github.com
2. Click "Sign up"
3. Follow the instructions
4. Verify your email

---

## Step 2: Install Git (if not installed)

### Windows:
1. Download from: https://git-scm.com/download/win
2. Run the installer
3. Click "Next" on everything (default settings are fine)

### Check if Git is installed:
Open Command Prompt and type:
```cmd
git --version
```

If you see a version number, Git is installed! ✅

---

## Step 3: Configure Git (One-time setup)

Open Command Prompt in the LANsnix folder and run these commands:

**Replace with YOUR information:**

```cmd
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Example:
```cmd
git config --global user.name "Yasir Ispawoo"
git config --global user.email "yasir@example.com"
```

---

## Step 4: Initialize Git Repository

In the LANsnix folder, run:

```cmd
git init
```

You should see: `Initialized empty Git repository`

---

## Step 5: Add All Files

```cmd
git add .
```

This adds all your files to Git.

---

## Step 6: Create First Commit

```cmd
git commit -m "Initial commit: LANsnix v1.0.0 - Realtime LAN Monitoring Platform"
```

You should see a list of files being committed.

---

## Step 7: Create GitHub Repository

1. Go to https://github.com/new
2. Fill in:
   - **Repository name**: `lansnix`
   - **Description**: `Realtime LAN Discovery & Monitoring Platform - Your Network. Visualized.`
   - **Public** (so others can see it)
   - **DO NOT** check "Add README" (we already have one)
3. Click "Create repository"

---

## Step 8: Connect to GitHub

GitHub will show you commands. Use these:

**Replace `yourusername` with your actual GitHub username:**

```cmd
git remote add origin https://github.com/yourusername/lansnix.git
git branch -M main
git push -u origin main
```

Example if your username is "ispawoo":
```cmd
git remote add origin https://github.com/ispawoo/lansnix.git
git branch -M main
git push -u origin main
```

---

## Step 9: Enter GitHub Credentials

When prompted:
- **Username**: Your GitHub username
- **Password**: Your GitHub password OR Personal Access Token

### If password doesn't work, create a Personal Access Token:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: "LANsnix Upload"
4. Check: `repo` (all repo permissions)
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)
7. Use this token as your password

---

## Step 10: Verify Upload

1. Go to: `https://github.com/yourusername/lansnix`
2. You should see all your files! 🎉

---

## 🎨 Step 11: Add Topics (Optional but Recommended)

On your GitHub repository page:
1. Click the ⚙️ gear icon next to "About"
2. Add topics:
   - `network-monitoring`
   - `lan-scanner`
   - `device-discovery`
   - `golang`
   - `nextjs`
   - `docker`
   - `linux`
   - `self-hosted`
   - `homelab`
   - `cybersecurity`
3. Click "Save changes"

---

## 📸 Step 12: Add Screenshots (Later)

1. Take screenshots of your dashboard
2. Save them in `docs/screenshots/`
3. Run:
```cmd
git add docs/screenshots/
git commit -m "Add screenshots"
git push
```

---

## 🔄 Future Updates

When you make changes:

```cmd
git add .
git commit -m "Description of changes"
git push
```

---

## ❌ Troubleshooting

### "Git is not recognized"
- Restart Command Prompt after installing Git
- Or restart your computer

### "Permission denied"
- Use Personal Access Token instead of password
- Make sure you're using the correct username

### "Repository not found"
- Check the repository name is correct
- Make sure you created the repository on GitHub first

### "Failed to push"
- Check your internet connection
- Verify your credentials
- Try: `git push -f origin main` (only for first push)

---

## 🎉 You're Done!

Your project is now on GitHub! Share the link:
```
https://github.com/yourusername/lansnix
```

---

## 📞 Need Help?

If you get stuck:
1. Copy the error message
2. Search on Google: "git [your error message]"
3. Or ask on: https://stackoverflow.com

---

**Created by Yasir Ispawoo**

Good luck! 🚀
