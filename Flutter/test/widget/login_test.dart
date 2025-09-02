import 'package:assignment/screens/login/login.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets("login form", (WidgetTester tester) async {
    // Finding the required widgets
    final uEForm = find.byKey(ValueKey("UsernameEmailLogin"));
    final pForm = find.byKey(ValueKey("PasswordLogin"));
    final lButton = find.byKey(ValueKey("ButtonLogin"));

    // Executing the actual test
    await tester.pumpWidget(ProviderScope(child: MaterialApp(home: LoginUser())));
    await tester.enterText(uEForm, "gaurisharma358@gmail.com");
    await tester.enterText(pForm, "gauri@254");
    await tester.tap(lButton);
    await tester.pump();

    // Checking outputs
    expect(find.text("gaurisharma358@gmail.com"), findsOneWidget);
    expect(find.text("gauri@254"), findsOneWidget);
  });
}
