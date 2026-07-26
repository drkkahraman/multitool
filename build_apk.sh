#!/bin/bash
set -e

echo "=== Android APK Build ve SDK Kurulum Scripti ==="

SDK_DIR="/home/doruk/android-sdk"
TMP_DIR="/home/doruk/Desktop/multitool/tmp_sdk"
desktop_apk="/home/doruk/Desktop/multitool.apk"

export JAVA_HOME="/usr/lib/jvm/java-21-openjdk-amd64"
export PATH="$JAVA_HOME/bin:$PATH"

mkdir -p "$SDK_DIR"
mkdir -p "$TMP_DIR"

if [ ! -f "$SDK_DIR/cmdline-tools/latest/bin/sdkmanager" ]; then
    echo "[1/4] Android Command Line Tools indiriliyor..."
    wget -q --show-progress -O "$TMP_DIR/cmdline.zip" "https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip"
    
    echo "[1/4] Ayıklanıyor..."
    mkdir -p "$SDK_DIR/cmdline-tools"
    unzip -q "$TMP_DIR/cmdline.zip" -d "$TMP_DIR"
    
    # cmdline-tools unzips to 'cmdline-tools/' structure. Let's move it to latest.
    mv "$TMP_DIR/cmdline-tools" "$SDK_DIR/cmdline-tools/latest"
    echo "[1/4] Command Line Tools kurulumu tamamlandı."
else
    echo "[1/4] Android Command Line Tools zaten kurulu."
fi

# Clean up tmp download
rm -rf "$TMP_DIR"

echo "[2/4] Lisanslar onaylanıyor..."
yes | "$SDK_DIR/cmdline-tools/latest/bin/sdkmanager" --licenses > /dev/null

echo "[2/4] Gerekli Android Platform paketleri (Android 34, Build-Tools) kuruluyor..."
"$SDK_DIR/cmdline-tools/latest/bin/sdkmanager" "platform-tools" "platforms;android-34" "build-tools;34.0.0" > /dev/null

echo "[2/4] SDK Kurulumu tamamlandı!"

echo "[3/4] local.properties oluşturuluyor..."
echo "sdk.dir=$SDK_DIR" > "/home/doruk/Desktop/multitool/android/local.properties"

echo "[4/4] Gradle ile APK derleme başlatılıyor..."
cd "/home/doruk/Desktop/multitool/android"
chmod +x gradlew
export ANDROID_HOME="$SDK_DIR"
./gradlew assembleDebug

echo "=== APK Derleme Başarıyla Tamamlandı! ==="
cp app/build/outputs/apk/debug/app-debug.apk "$desktop_apk"
echo "APK Masaüstüne Kopyalandı: $desktop_apk"
