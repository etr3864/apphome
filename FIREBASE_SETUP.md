# 🔥 הגדרת Firebase - מדריך מלא

## ✅ מה כבר נעשה

הקוד כבר מוכן! נשאר רק להגדיר את Firebase Console.

## 📋 שלבי ההגדרה

### 1️⃣ Firestore Database

נכנסים ל-[Firebase Console](https://console.firebase.google.com/):
1. לחצו על הפרויקט שלכם: **apphouse-e4914**
2. בתפריט צד, לחצו על **"Firestore Database"**
3. לחצו על **"Create database"**
4. בחרו **"Start in production mode"** (נשנה את ה-rules אחר כך)
5. בחרו location: `europe-west1` (הכי קרוב לישראל)
6. לחצו **"Enable"**

---

### 2️⃣ Authentication

1. בתפריט צד, לחצו על **"Authentication"**
2. לחצו **"Get started"**
3. בטאב **"Sign-in method"**, לחצו על **"Email/Password"**
4. הפעילו את **"Email/Password"** (הסליידר הראשון)
5. **אל תפעילו** את "Email link" (הסליידר השני)
6. לחצו **"Save"**

---

### 3️⃣ Firestore Rules

חזרו ל-**Firestore Database** ולחצו על טאב **"Rules"**.

העתיקו והדביקו את הקוד הבא:

\`\`\`
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isHouseholdMember(householdId) {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.householdId == householdId;
    }
    
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if isAuthenticated() && request.auth.uid == userId;
    }
    
    // Households collection
    match /households/{householdId} {
      allow read, write: if isHouseholdMember(householdId);
    }
    
    // Transactions
    match /transactions/{householdId}/items/{transactionId} {
      allow read, create, update, delete: if isHouseholdMember(householdId);
    }
    
    // Assets
    match /assets/{householdId}/items/{assetId} {
      allow read, create, update, delete: if isHouseholdMember(householdId);
    }
    
    // Liabilities
    match /liabilities/{householdId}/items/{liabilityId} {
      allow read, create, update, delete: if isHouseholdMember(householdId);
    }
  }
}
\`\`\`

לחצו **"Publish"**.

---

## 🚀 מעולה! זה הכל!

עכשיו תוכלו:

1. **להריץ את האפליקציה:**
\`\`\`bash
npm run dev
\`\`\`

2. **להירשם** עם מייל וסיסמה
3. **לשתף** את האפליקציה עם האשה שלך:
   - היא תירשם עם המייל שלה
   - אתה תוסיף אותה למשק הבית (ניתן לממש את זה אחר כך)

---

## 💾 מיגרציה מ-LocalStorage

אם יש לך נתונים ב-LocalStorage מהגרסה הקודמת:

1. פתחו את ה-Console בדפדפן (F12)
2. הקלידו:

\`\`\`javascript
// Import the migration function
import { migrateFromLocalStorage } from './src/lib/firebase/migration';

// Run migration (replace 'YOUR_HOUSEHOLD_ID' with your actual household ID)
await migrateFromLocalStorage('YOUR_HOUSEHOLD_ID');
\`\`\`

---

## 🔐 אבטחה

- ✅ כל משתמש רואה רק את הנתונים של משק הבית שלו
- ✅ אף אחד לא יכול לגשת לנתונים של משק בית אחר
- ✅ הסיסמאות מוצפנות ומאובטחות ע"י Firebase

---

## 📊 מבנה הדאטהבייס

```
Firestore
├── users/
│   └── {userId}
│       ├── id
│       ├── email
│       ├── name
│       ├── householdId
│       └── role
│
├── households/
│   └── {householdId}
│       ├── id
│       ├── name
│       ├── currency
│       ├── initialBalance
│       ├── openaiApiKey
│       └── ownerIds[]
│
├── transactions/
│   └── {householdId}/
│       └── items/
│           └── {transactionId}
│
├── assets/
│   └── {householdId}/
│       └── items/
│           └── {assetId}
│
└── liabilities/
    └── {householdId}/
        └── items/
            └── {liabilityId}
```

---

## 🎯 יתרונות

1. **Real-time sync** - שינויים מתעדכנים מיידית בכל המכשירים
2. **Multi-user** - גם אתה וגם האשה שלך יכולים להשתמש במקביל
3. **Backup** - הנתונים שמורים בענן
4. **Security** - אבטחה ברמה גבוהה מאוד
5. **Offline support** - Firebase תומך בעבודה אופליין (ניתן להוסיף)

---

**נהנה? ⭐️ תנו כוכב לפרויקט!**

