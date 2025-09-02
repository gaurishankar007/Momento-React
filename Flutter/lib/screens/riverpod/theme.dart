import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ThemeNotifier extends StateNotifier<bool> {
  ThemeNotifier() : super(false) {
    loadTheme();
  }

  void loadTheme() async {
    final prefs = await SharedPreferences.getInstance();
    state = prefs.getBool("dark") ?? false;
  }

  void darkTheme() async {
    final prefs = await SharedPreferences.getInstance();
    prefs.setBool("dark", true);
    state = true;
  }

  void lightTheme() async {
    final prefs = await SharedPreferences.getInstance();
    prefs.setBool("dark", false);
    state = false;
  }
}
