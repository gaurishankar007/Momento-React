import 'package:assignment/screens/registration/address.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets("address registration form", (WidgetTester tester) async {
    // Finding the required widgets
    final textForms = find.byType(TextFormField);
    final textButtons = find.byType(TextButton);
    final elevatedButton = find.byType(ElevatedButton);

    // Executing the actual test
    await tester.pumpWidget(ProviderScope(child: MaterialApp(home: Address())));

    // Checking outputs
    expect(textForms, findsNWidgets(6));
    expect(textButtons, findsNWidgets(3));
    expect(elevatedButton, findsOneWidget);
  });
}
