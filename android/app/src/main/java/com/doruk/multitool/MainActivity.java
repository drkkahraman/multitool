package com.doruk.multitool;

import android.Manifest;
import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;
import android.speech.tts.TextToSpeech;
import java.util.Locale;
import org.json.JSONObject;
import com.getcapacitor.BridgeActivity;
import android.util.Log;
import android.widget.Toast;

import com.startapp.sdk.adsbase.StartAppSDK;
import com.startapp.sdk.adsbase.StartAppAd;
import com.startapp.sdk.adsbase.Ad;
import com.startapp.sdk.adsbase.adlisteners.AdEventListener;
import com.startapp.sdk.adsbase.adlisteners.AdDisplayListener;
import com.startapp.sdk.adsbase.adlisteners.VideoListener;

public class MainActivity extends BridgeActivity implements TextToSpeech.OnInitListener {

    private static final int SPEECH_REQUEST_CODE = 102;
    private TextToSpeech tts;
    private boolean ttsReady = false;

    public static final String EXEMPT_AD_ID = "c7c4deb6-6980-4bc0-bf54-27c15f612e66";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Start.io Ads SDK Initialization
        try {
            StartAppSDK.init(this, "206953182", false);
            StartAppAd.disableSplash();
            long now = System.currentTimeMillis();
            StartAppSDK.setUserConsent(this, "pas", now, true);
            StartAppSDK.setUserConsent(this, "pns", now, true);
        } catch (Exception e) {
            Log.e("StartIo", "Start.io init/consent failed: " + e.getMessage());
        }

        // Initialize Android Native TextToSpeech engine
        tts = new TextToSpeech(this, this);

        // Expose AndroidNative interface to JS
        this.bridge.getWebView().addJavascriptInterface(new WebAppInterface(this), "AndroidNative");

        WebSettings webSettings = this.bridge.getWebView().getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);

        // Grant WebChromeClient permissions for audio/media capture
        this.bridge.getWebView().setWebChromeClient(new android.webkit.WebChromeClient() {
            @Override
            public void onPermissionRequest(final android.webkit.PermissionRequest request) {
                request.grant(request.getResources());
            }
        });

        // Request Notification Permission on Android 13+ (API 33+)
        requestNotificationPermissionNative();
    }

    @Override
    public void onPause() {
        super.onPause();
        // Prevent WebView from freezing JS setInterval timers when app is backgrounded
        if (this.bridge != null && this.bridge.getWebView() != null) {
            this.bridge.getWebView().resumeTimers();
        }
    }

    @Override
    public void onStop() {
        super.onStop();
        if (this.bridge != null && this.bridge.getWebView() != null) {
            this.bridge.getWebView().resumeTimers();
        }
    }

    @Override
    public void onInit(int status) {
        if (status == TextToSpeech.SUCCESS) {
            ttsReady = true;
            tts.setLanguage(new Locale("tr", "TR"));
            tts.setOnUtteranceProgressListener(new android.speech.tts.UtteranceProgressListener() {
                @Override
                public void onStart(String utteranceId) {}

                @Override
                public void onDone(String utteranceId) {
                    if (bridge != null && bridge.getWebView() != null) {
                        bridge.getWebView().post(() -> {
                            bridge.getWebView().evaluateJavascript(
                                "window.onNativeSpeechEnd && window.onNativeSpeechEnd();",
                                null
                            );
                        });
                    }
                }

                @Override
                public void onError(String utteranceId) {
                    if (bridge != null && bridge.getWebView() != null) {
                        bridge.getWebView().post(() -> {
                            bridge.getWebView().evaluateJavascript(
                                "window.onNativeSpeechEnd && window.onNativeSpeechEnd();",
                                null
                            );
                        });
                    }
                }
            });
        }
    }

    @Override
    public void onDestroy() {
        if (tts != null) {
            tts.stop();
            tts.shutdown();
        }
        super.onDestroy();
    }

    public void speakInternal(String text, String lang) {
        if (tts != null) {
            Locale locale = new Locale("tr", "TR");
            if ("en-US".equalsIgnoreCase(lang) || "en".equalsIgnoreCase(lang)) locale = Locale.US;
            else if ("de-DE".equalsIgnoreCase(lang) || "de".equalsIgnoreCase(lang)) locale = Locale.GERMANY;
            else if ("es-ES".equalsIgnoreCase(lang) || "es".equalsIgnoreCase(lang)) locale = new Locale("es", "ES");
            else if ("fr-FR".equalsIgnoreCase(lang) || "fr".equalsIgnoreCase(lang)) locale = Locale.FRANCE;
            else if ("it-IT".equalsIgnoreCase(lang) || "it".equalsIgnoreCase(lang)) locale = Locale.ITALY;

            tts.setLanguage(locale);
            tts.setSpeechRate(0.7f);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "multitool_tts");
            } else {
                tts.speak(text, TextToSpeech.QUEUE_FLUSH, null);
            }
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, android.content.Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == SPEECH_REQUEST_CODE && resultCode == RESULT_OK && data != null) {
            java.util.ArrayList<String> results = data.getStringArrayListExtra(android.speech.RecognizerIntent.EXTRA_RESULTS);
            if (results != null && !results.isEmpty()) {
                String spokenText = results.get(0);
                this.bridge.getWebView().post(() -> {
                    this.bridge.getWebView().evaluateJavascript(
                        "window.onNativeSpeechResult && window.onNativeSpeechResult(" + JSONObject.quote(spokenText) + ");",
                        null
                    );
                });
            }
        }
    }

    public void requestNotificationPermissionNative() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.POST_NOTIFICATIONS}, 101);
            }
        }
    }

    public class WebAppInterface {
        Context mContext;

        WebAppInterface(Context c) {
            mContext = c;
        }

        @JavascriptInterface
        public void requestNotificationPermission() {
            MainActivity.this.runOnUiThread(() -> MainActivity.this.requestNotificationPermissionNative());
        }

        @JavascriptInterface
        public void sendLocalNotification(String title, String message) {
            try {
                NotificationManager notificationManager = (NotificationManager) mContext.getSystemService(Context.NOTIFICATION_SERVICE);
                String channelId = "multitool_notifications";

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    NotificationChannel channel = new NotificationChannel(
                        channelId,
                        "Multitool AI Bildirimleri",
                        NotificationManager.IMPORTANCE_HIGH
                    );
                    channel.setDescription("Multitool Asistan Hatırlatıcıları");
                    channel.enableVibration(true);
                    channel.enableLights(true);
                    channel.setLockscreenVisibility(android.app.Notification.VISIBILITY_PUBLIC);
                    if (notificationManager != null) {
                        notificationManager.createNotificationChannel(channel);
                    }
                }

                Intent intent = new Intent(mContext, MainActivity.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                int pendingFlags = Build.VERSION.SDK_INT >= Build.VERSION_CODES.M
                        ? PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT
                        : PendingIntent.FLAG_UPDATE_CURRENT;
                PendingIntent pendingIntent = PendingIntent.getActivity(mContext, (int) System.currentTimeMillis(), intent, pendingFlags);

                NotificationCompat.Builder builder = new NotificationCompat.Builder(mContext, channelId)
                        .setSmallIcon(R.mipmap.ic_launcher)
                        .setContentTitle(title)
                        .setContentText(message)
                        .setPriority(NotificationCompat.PRIORITY_MAX)
                        .setDefaults(NotificationCompat.DEFAULT_ALL)
                        .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                        .setContentIntent(pendingIntent)
                        .setAutoCancel(true);

                if (notificationManager != null) {
                    notificationManager.notify((int) System.currentTimeMillis(), builder.build());
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        @JavascriptInterface
        public void scheduleLocalNotification(int id, String title, String message, long triggerAtMillis) {
            try {
                AlarmManager alarmManager = (AlarmManager) mContext.getSystemService(Context.ALARM_SERVICE);
                Intent intent = new Intent(mContext, NotificationReceiver.class);
                intent.putExtra("title", title);
                intent.putExtra("message", message);
                intent.putExtra("notificationId", id);

                int pendingFlags = Build.VERSION.SDK_INT >= Build.VERSION_CODES.M
                        ? PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT
                        : PendingIntent.FLAG_UPDATE_CURRENT;

                PendingIntent pendingIntent = PendingIntent.getBroadcast(mContext, id, intent, pendingFlags);

                if (alarmManager != null) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAtMillis, pendingIntent);
                    } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                        alarmManager.setExact(AlarmManager.RTC_WAKEUP, triggerAtMillis, pendingIntent);
                    } else {
                        alarmManager.set(AlarmManager.RTC_WAKEUP, triggerAtMillis, pendingIntent);
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        @JavascriptInterface
        public void cancelLocalNotification(int id) {
            try {
                AlarmManager alarmManager = (AlarmManager) mContext.getSystemService(Context.ALARM_SERVICE);
                Intent intent = new Intent(mContext, NotificationReceiver.class);
                int pendingFlags = Build.VERSION.SDK_INT >= Build.VERSION_CODES.M
                        ? PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT
                        : PendingIntent.FLAG_UPDATE_CURRENT;
                PendingIntent pendingIntent = PendingIntent.getBroadcast(mContext, id, intent, pendingFlags);
                if (alarmManager != null) {
                    alarmManager.cancel(pendingIntent);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        @JavascriptInterface
        public void openUrl(String url) {
            MainActivity.this.runOnUiThread(() -> {
                try {
                    android.content.Intent intent = new android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse(url));
                    intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
                    mContext.startActivity(intent);
                } catch (Exception e) {
                    e.printStackTrace();
                    android.widget.Toast.makeText(mContext, "Link açılamadı: " + e.getMessage(), android.widget.Toast.LENGTH_SHORT).show();
                }
            });
        }

        @JavascriptInterface
        public void saveImageToGallery(String base64Data, String filename) {
            MainActivity.this.runOnUiThread(() -> {
                try {
                    String cleanBase64 = base64Data;
                    if (cleanBase64.contains(",")) {
                        cleanBase64 = cleanBase64.split(",")[1];
                    }
                    byte[] imageBytes = android.util.Base64.decode(cleanBase64, android.util.Base64.DEFAULT);

                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                        android.content.ContentValues values = new android.content.ContentValues();
                        values.put(android.provider.MediaStore.Images.Media.DISPLAY_NAME, filename);
                        values.put(android.provider.MediaStore.Images.Media.MIME_TYPE, "image/jpeg");
                        values.put(android.provider.MediaStore.Images.Media.RELATIVE_PATH, android.os.Environment.DIRECTORY_PICTURES + "/Multitool");

                        android.net.Uri uri = getContentResolver().insert(android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
                        if (uri != null) {
                            java.io.OutputStream out = getContentResolver().openOutputStream(uri);
                            if (out != null) {
                                out.write(imageBytes);
                                out.close();
                            }
                            android.widget.Toast.makeText(mContext, "Görsel Galeriye Kaydedildi!", android.widget.Toast.LENGTH_LONG).show();
                        }
                    } else {
                        java.io.File imagesDir = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_PICTURES);
                        java.io.File multitoolDir = new java.io.File(imagesDir, "Multitool");
                        if (!multitoolDir.exists()) multitoolDir.mkdirs();
                        java.io.File imageFile = new java.io.File(multitoolDir, filename);
                        java.io.FileOutputStream out = new java.io.FileOutputStream(imageFile);
                        out.write(imageBytes);
                        out.close();
                        android.widget.Toast.makeText(mContext, "Görsel Kaydedildi: " + imageFile.getName(), android.widget.Toast.LENGTH_LONG).show();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    android.widget.Toast.makeText(mContext, "Görsel kaydedilemedi: " + e.getMessage(), android.widget.Toast.LENGTH_SHORT).show();
                }
            });
        }

        @JavascriptInterface
        public void startSpeechRecognition(String lang) {
            MainActivity.this.runOnUiThread(() -> {
                try {
                    if (ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.RECORD_AUDIO)
                            != PackageManager.PERMISSION_GRANTED) {
                        ActivityCompat.requestPermissions(MainActivity.this, new String[]{Manifest.permission.RECORD_AUDIO}, 103);
                    }

                    android.content.Intent intent = new android.content.Intent(android.speech.RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
                    intent.putExtra(android.speech.RecognizerIntent.EXTRA_LANGUAGE_MODEL, android.speech.RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
                    intent.putExtra(android.speech.RecognizerIntent.EXTRA_LANGUAGE, (lang != null && !lang.isEmpty()) ? lang : "tr-TR");
                    intent.putExtra(android.speech.RecognizerIntent.EXTRA_PROMPT, "Multitool - Konuşun...");

                    MainActivity.this.startActivityForResult(intent, SPEECH_REQUEST_CODE);
                } catch (Exception e) {
                    e.printStackTrace();
                    android.widget.Toast.makeText(mContext, "Ses tanıma başlatılamadı: " + e.getMessage(), android.widget.Toast.LENGTH_SHORT).show();
                }
            });
        }

        @JavascriptInterface
        public void speakText(String text, String lang) {
            MainActivity.this.runOnUiThread(() -> {
                try {
                    if (tts == null || !ttsReady) {
                        tts = new TextToSpeech(mContext, status -> {
                            if (status == TextToSpeech.SUCCESS) {
                                ttsReady = true;
                                speakInternal(text, lang);
                            }
                        });
                    } else {
                        speakInternal(text, lang);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
        }

        @JavascriptInterface
        public void stopSpeech() {
            MainActivity.this.runOnUiThread(() -> {
                if (tts != null) {
                    tts.stop();
                }
            });
        }

        @JavascriptInterface
        public void showUnityInterstitialAd() {
            showStartIoAd();
        }

        private void showLoadedStartIoAd(StartAppAd startAd) {
            startAd.showAd(new AdDisplayListener() {
                @Override
                public void adHidden(Ad ad) {
                    dispatchJsEvent("startio-reward-earned");
                    dispatchJsEvent("startio-ad-closed");
                }

                @Override
                public void adDisplayed(Ad ad) {
                    dispatchJsEvent("startio-ad-shown");
                }

                @Override
                public void adClicked(Ad ad) {}

                @Override
                public void adNotDisplayed(Ad ad) {
                    Log.w("StartIo", "Start.io ad not displayed, granting reward fallback.");
                    dispatchJsEvent("startio-reward-earned");
                    dispatchJsEvent("startio-ad-closed");
                }
            });
        }

        @JavascriptInterface
        public void showUnityRewardedAd() {
            MainActivity.this.runOnUiThread(() -> {
                try {
                    StartAppAd rewardedAd = new StartAppAd(MainActivity.this);
                    rewardedAd.setVideoListener(new VideoListener() {
                        @Override
                        public void onVideoCompleted() {
                            Log.d("StartIo", "Start.io Video completed.");
                            dispatchJsEvent("startio-reward-earned");
                        }
                    });

                    // 1. Önce REWARDED_VIDEO modunda reklam yükle
                    rewardedAd.loadAd(StartAppAd.AdMode.REWARDED_VIDEO, new AdEventListener() {
                        @Override
                        public void onReceiveAd(Ad ad) {
                            Log.d("StartIo", "Start.io REWARDED_VIDEO loaded.");
                            showLoadedStartIoAd(rewardedAd);
                        }

                        @Override
                        public void onFailedToReceiveAd(Ad ad) {
                            Log.w("StartIo", "Start.io REWARDED_VIDEO no-fill, trying AUTOMATED mode...");
                            // 2. REWARDED_VIDEO dolgusu yoksa AUTOMATED modunda (Video / Interstitial) dene
                            StartAppAd fallbackAd = new StartAppAd(MainActivity.this);
                            fallbackAd.setVideoListener(new VideoListener() {
                                @Override
                                public void onVideoCompleted() {
                                    dispatchJsEvent("startio-reward-earned");
                                }
                            });
                            fallbackAd.loadAd(StartAppAd.AdMode.FULLPAGE, new AdEventListener() {
                                @Override
                                public void onReceiveAd(Ad ad2) {
                                    Log.d("StartIo", "Start.io AUTOMATED ad loaded.");
                                    showLoadedStartIoAd(fallbackAd);
                                }

                                @Override
                                public void onFailedToReceiveAd(Ad ad2) {
                                    Log.w("StartIo", "Start.io direct showAd fallback...");
                                    // 3. Doğrudan StartAppAd.showAd göster
                                    boolean shown = StartAppAd.showAd(MainActivity.this);
                                    if (!shown) {
                                        Log.e("StartIo", "No Start.io ads available at all. Granting reward fallback.");
                                        MainActivity.this.runOnUiThread(() -> {
                                            Toast.makeText(MainActivity.this, "Reklam servisi yanıt vermedi, 2 saatlik reklamsız modunuz aktifleştirildi!", Toast.LENGTH_SHORT).show();
                                        });
                                    }
                                    dispatchJsEvent("startio-reward-earned");
                                    dispatchJsEvent("startio-ad-closed");
                                }
                            });
                        }
                    });
                } catch (Exception e) {
                    Log.e("StartIo", "showRewarded failed: " + e.getMessage());
                    dispatchJsEvent("startio-reward-earned");
                    dispatchJsEvent("startio-ad-closed");
                }
            });
        }

        @JavascriptInterface
        public void showStartIoAd() {
            MainActivity.this.runOnUiThread(() -> {
                try {
                    StartAppAd.showAd(MainActivity.this);
                } catch (Exception e) {
                    Log.e("StartIo", "showAd failed: " + e.getMessage());
                }
            });
        }

        @JavascriptInterface
        public boolean isAdExempt() {
            return false;
        }

        @JavascriptInterface
        public String getExemptDeviceId() {
            return EXEMPT_AD_ID;
        }

        private void dispatchJsEvent(String eventName) {
            MainActivity.this.runOnUiThread(() -> {
                try {
                    String script = "window.dispatchEvent(new CustomEvent('" + eventName + "'));";
                    MainActivity.this.bridge.getWebView().evaluateJavascript(script, null);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
        }
    }
}
