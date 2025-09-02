import 'package:assignment/screens/report.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets("report", (WidgetTester tester) async {
    // Executing the actual test
    await tester.pumpWidget(
        ProviderScope(child: MaterialApp(home: Report(post_id: ''))));

    // Checking outputs
    expect(find.text("Add report options"), findsOneWidget);
    expect(find.text("Report"), findsOneWidget);
    expect(find.byIcon(Icons.circle), findsOneWidget);
    expect(find.byIcon(Icons.delete), findsOneWidget);
  });
}
