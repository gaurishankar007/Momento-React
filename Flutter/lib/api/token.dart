import 'package:assignment/api/http/http_user.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Token {
  void setToken(String token) async {
    final pref = await SharedPreferences.getInstance();
    pref.setString("token", token);
  }

  Future<String> getToken() async {
    final pref = await SharedPreferences.getInstance();
    String token = pref.getString("token") ?? "";
    HttpConnectUser.token = token;
    return token;
  }

  void removeToken() async {
    final pref = await SharedPreferences.getInstance();
    pref.remove("token");
  }
}
