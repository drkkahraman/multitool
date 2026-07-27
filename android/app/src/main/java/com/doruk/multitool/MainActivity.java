package com.doruk.multitool;

import android.Manifest;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;
import android.speech.tts.TextToSpeech;
import java.util.Locale;
import org.json.JSONObject;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity implements TextToSpeech.OnInitListener {

    private static final int SPEECH_REQUEST_CODE = 102;
    private TextToSpeech tts;
    private boolean ttsReady = false;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Initialize Android Native TextToSpeech engine
        tts = new TextToSpeech(this, this);

        // Expose AndroidNative interface to JS
        this.bridge.getWebView().addJavascriptInterface(new WebAppInterface(this), "AndroidNative");

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
                    if (notificationManager != null) {
                        notificationManager.createNotificationChannel(channel);
                    }
                }

                NotificationCompat.Builder builder = new NotificationCompat.Builder(mContext, channelId)
                        .setSmallIcon(R.mipmap.ic_launcher)
                        .setContentTitle(title)
                        .setContentText(message)
                        .setPriority(NotificationCompat.PRIORITY_HIGH)
                        .setAutoCancel(true);

                if (notificationManager != null) {
                    notificationManager.notify((int) System.currentTimeMillis(), builder.build());
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
    }
}
