import 'package:assignment/screens/registration/profile_pic.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets("profilePic upload", (WidgetTester tester) async {
    // Finding the required widgets
    final sPButton = find.byKey(ValueKey("ButtonSelectProfile"));

    // Executing the actual test
    await tester.pumpWidget(
        ProviderScope(child: MaterialApp(home: AddProfilePicture())));

    // Checking outputs
    expect(find.text("Select a profile picture"), findsOneWidget);

    // Executing the actual test
    await tester.tap(sPButton);
    await tester.pump();

    // Checking outputs
    expect(find.text("Camera"), findsOneWidget);
    expect(find.byIcon(Icons.camera), findsOneWidget);
    expect(find.text("Gallery"), findsOneWidget);
    expect(find.byIcon(Icons.photo_album), findsOneWidget);
  });
}
