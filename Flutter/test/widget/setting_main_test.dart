import 'package:assignment/screens/setting/setting_main.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets("setting", (WidgetTester tester) async {
    // Executing the actual test
    await tester.pumpWidget(
        ProviderScope(child: MaterialApp(home: Setting())));

    // Checking outputs
    expect(find.byIcon(Icons.dark_mode_sharp), findsOneWidget);
    expect(find.text("Dark Theme"), findsOneWidget);
  });
}
