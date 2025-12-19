# ⚠️ Java Version Issue & Fix

## 🔴 **The Problem**

You have **Java 25** installed, which is:
- ✅ Very modern (latest release!)
- ❌ Too new for Spring Boot 3
- ❌ Not supported by Gradle's Groovy compiler

**Error:** `Unsupported class file major version 69` (Java 25)

---

## ✅ **The Solution**

You need **Java 21 (LTS)** or **Java 17 (LTS)** to run Spring Boot applications.

### **Option 1: Install Java 21 (Recommended)** ⭐

1. **Download Java 21:**
   ```
   https://adoptium.net/temurin/releases/?version=21
   ```

2. **Install it** (you can keep Java 25 installed too)

3. **Run the backend:**
   ```bash
   cd vveluniverse/backend
   run-with-java21.bat
   ```

### **Option 2: Set JAVA_HOME Temporarily**

If you already have Java 21 installed somewhere:

```bash
# Find your Java 21 installation
dir "C:\Program Files\Eclipse Adoptium\" /b

# Set JAVA_HOME for this terminal session
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.x.x
gradlew.bat bootRun
```

### **Option 3: Use Java 17 (Also works)**

Download Java 17 LTS:
```
https://adoptium.net/temurin/releases/?version=17
```

---

## 🎯 **Which Java Version to Use?**

| Version | Status | Spring Boot 3 | Recommended |
|---------|--------|---------------|-------------|
| Java 25 | Latest | ❌ Too new | ❌ No |
| **Java 21** | **LTS** | ✅ Perfect | ⭐ **YES** |
| **Java 17** | **LTS** | ✅ Perfect | ✅ Yes |
| Java 11 | LTS | ❌ Too old | ❌ No |

**LTS** = Long Term Support (stable, production-ready)

---

## 📝 **Why Java 25 Doesn't Work?**

Java 25 uses **bytecode version 69**, which:
1. Groovy (used by Gradle) doesn't fully support yet
2. Some Spring Boot libraries haven't updated
3. It's brand new (just released!) - give it 3-6 months

---

## ✅ **After Installing Java 21**

### **Check your Java version:**
```bash
java -version
# Should show: openjdk version "21.x.x"
```

### **Start the backend:**
```bash
cd vveluniverse\backend
gradlew.bat bootRun
```

Or use:
```bash
start-java-backend.bat
```

---

## 🔧 **Keep Both Java Versions**

You can have multiple Java versions installed!

1. **System Java** (Java 25) for general use
2. **Project Java** (Java 21) for Spring Boot
3. Use `JAVA_HOME` to switch between them

---

## 💡 **Quick Test**

After installing Java 21:

```bash
cd vveluniverse\backend
gradlew.bat --version
```

Should show:
```
Launcher JVM:  21.x.x (instead of 25.0.1)
```

Then try:
```bash
gradlew.bat bootRun
```

---

## 🚀 **Once It's Running**

Open: http://localhost:8080/api/auth/status

You should see:
```json
{
  "success": true,
  "message": "Authentication endpoint is working"
}
```

---

## 📚 **More Info**

- Spring Boot Java Support: https://docs.spring.io/spring-boot/system-requirements.html
- Adoptium Java Downloads: https://adoptium.net/
- Gradle Java Compatibility: https://docs.gradle.org/current/userguide/compatibility.html

---

**TL;DR:** Install Java 21, keep Java 25 for other projects, use `JAVA_HOME` to switch. 🎯

