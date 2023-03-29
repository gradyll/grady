package com.example.jsbridge;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.os.Bundle;
import android.telecom.Call;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.widget.Button;
import android.widget.EditText;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private EditText editeText;
    private Button refresh;
    private Button showBtn;
    private Button showBtn2;
    private MainActivity self = this;
    private NativeSDK nativeSDK = new NativeSDK(this);

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);
        refresh = findViewById(R.id.refresh);
        showBtn = findViewById(R.id.showBtn);
        showBtn2 = findViewById(R.id.showBtn_2);
        editeText = findViewById(R.id.editeText);


        webView.loadUrl("http://192.168.3.148:8080/?timestamp="+ new Date().getTime());
        webView.getSettings().setJavaScriptEnabled(true);
        webView.setWebChromeClient(new WebChromeClient());
        webView.addJavascriptInterface(new NativeBridge(this), "NativeBridge");
//        webView.setWebChromeClient(new WebChromeClient() {
//            @Override
//            public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
//                if(!message.startsWith("JSBridge://")) {
//
//                    return super.onJsAlert(view, url, message, result);
//                }
//
//                String text = message.substring(message.indexOf("=")+1);
//                self.showNativeDialog(text);
//                result.confirm();
//                return true;
//            }
//        });

        showBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String inputValue = editeText.getText().toString();
                self.showWebDialog(inputValue);
            }
        });

        showBtn2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                nativeSDK.getWebEditTextValue(new Callback() {
                    @Override
                    public void invoke(String value) {
                        new AlertDialog.Builder(self).setMessage(value).create().show();
                    }
                });
            }
        });

        refresh.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                webView.loadUrl("http://192.168.3.148:8080/?timestamp="+ new Date().getTime());
            }
        });
    }
    private void showWebDialog(String text) {
        String jsCode = String.format("window.showWebDialog('%s')", text);

        webView.evaluateJavascript(jsCode, null);
    }
//    private void showNativeDialog(String text) {
//        new AlertDialog.Builder(this).setMessage(text).create().show();
//    }

    interface Callback {
        void invoke(String value);
    }



    class NativeSDK {
        private Context ctx;
        private int id = 1;
        private Map<Integer, Callback> callbackMap = new HashMap();
        NativeSDK(Context ctx) {
            this.ctx = ctx;
        }
        void getWebEditTextValue(Callback callback) {
            int callbackId = id++;
            callbackMap.put(callbackId, callback);
            final String jsCode = String.format("window.jssdk.getWebEditTextValue(%s)", callbackId);
            ((MainActivity)ctx).runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    ((MainActivity)ctx).webView.evaluateJavascript(jsCode, null);
                }
            });
        }

        void receiveMessage(int callbackId, String value) {
            if(callbackMap.containsKey(callbackId)) {
                callbackMap.get(callbackId).invoke(value);
            }
        }
    }



    class NativeBridge {
        private Context ctx;
        NativeBridge(Context ctx) {
            this.ctx = ctx;
        }
        @JavascriptInterface
        public void showNativeDialog(String text) {
            new AlertDialog.Builder(ctx).setMessage(text).create().show();
        }
        @JavascriptInterface
        public void getNativeEditTextValue(int callbackId) {
            final MainActivity mainActivity = (MainActivity)ctx;
            String value = mainActivity.editeText.getText().toString();
            final String jsCode = String.format("window.jssdk.recevieMessage(%s,'%s')", callbackId,value);
            mainActivity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    mainActivity.webView.evaluateJavascript(jsCode, null);
                }
            });
        }
        @JavascriptInterface
        public void receiveMessage(int callbackId, String value) {
            ((MainActivity)ctx).nativeSDK.receiveMessage(callbackId, value);
        }
    }
}