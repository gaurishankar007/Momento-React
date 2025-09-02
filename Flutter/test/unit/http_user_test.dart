import 'package:assignment/api/http/http_user.dart';
import 'package:assignment/api/model/user.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';

import 'http_user_test.mocks.dart';

@GenerateMocks([HttpConnectUser])
void main() {
  final MockHttpConnectUser _mockHttpUser = MockHttpConnectUser();
  final HttpConnectUser _httpConnectUser = HttpConnectUser();

  group("MockUserHttp", () {
    test("registration", () async {
      UserRegister userData = UserRegister(
        username: "john003",
        password: "John@12",
        email: "john58@gmail.com",
        phone: "9874563210",
      );

      when(_mockHttpUser.registerUser(userData)).thenAnswer(
          (_) async => {"message": "Your account has been created."});

      expect(await _httpConnectUser.registerUser(userData), isA<Map>());
    });

    test("login", () async {
      UserLogin userData = UserLogin(
        usernameEmail: "john003",
        password: "John@12",
      );

      when(_mockHttpUser.loginUser(userData)).thenAnswer(
          (_) async => {"message": "Your account has been created."});

      expect(await _httpConnectUser.loginUser(userData), isA<Map>());
    });

    test("changePassword", () async {
      ChangePassword passwordData = ChangePassword(
        currentPassword: "nishan@254",
        newPassword: "rana@555",
      );

      when(_mockHttpUser.changePassword(passwordData)).thenAnswer(
          (_) async => {"message": "Your username has been changed."});

      expect(await _httpConnectUser.changePassword(passwordData), isA<Map>());
    });

    test("changeUsername", () async {
      when(_mockHttpUser.changeUsername("nishan003")).thenAnswer(
          (_) async => {"message": "Your username has been changed."});

      expect(await _httpConnectUser.changeUsername("nishan003"), isA<Map>());
    });

    test("changeEmail", () async {
      when(_mockHttpUser.changeEmail("nishan23@gmail.com")).thenAnswer(
          (_) async => {"message": "Your email has been changed."});

      expect(
          await _httpConnectUser.changeEmail("nishan23@gmail.com"), isA<Map>());
    });
  });
}
