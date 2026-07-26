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
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Expose AndroidNative interface to JS
        this.bridge.getWebView().addJavascriptInterface(new WebAppInterface(this), "AndroidNative");

        // Request Notification Permission on Android 13+ (API 33+)
        requestNotificationPermissionNative();
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
    }
}
