import 'dart:convert';
import 'dart:developer';
import 'dart:io';

import 'package:assignment/api/model/user.dart';
import 'package:http/http.dart' as http;
import 'package:http/http.dart';

import '../base_urls.dart';

class HttpConnectUser {
  String baseurl = BaseUrl.baseUrl;
  static String token = "";

  Future<Map> registerUser(UserRegister user) async {
    try {
      Map<String, dynamic> userData = {
        "username": user.username,
        "password": user.password,
        "email": user.email,
        "phone": user.phone,
      };

      final response =
          await post(Uri.parse(baseurl + "user/register"), body: userData);

      //json serializing inline
      final responseData = jsonDecode(response.body) as Map;
      return responseData;
    } catch (err) {
      log('$err');
    }
    return {"message": "Error Occurred."};
  }

  Future<Map> loginUser(UserLogin user) async {
    try {
      Map<String, dynamic> userData = {
        "username_email": user.usernameEmail,
        "password": user.password,
      };

      final response =
          await post(Uri.parse(baseurl + "user/login"), body: userData);

      //json serializing inline
      final responseData = jsonDecode(response.body) as Map;
      return responseData;
    } catch (err) {
      log('$err');
    }
    return {"message": "Error Occurred."};
  }

  Future<Map> addProfile(File? profilePicture) async {
    if (profilePicture == null) {
      return {"message": "File not selected."};
    }

    try {
      var request = http.MultipartRequest(
          'PUT', Uri.parse(baseurl + "user/changeProfile"));

      //using the token in the headers
      request.headers.addAll({
        'Authorization': 'Bearer $token',
      });

      // Open a byte stream
      var stream = profilePicture.readAsBytes().asStream();

      // Get the file length
      var length = profilePicture.lengthSync();

      // Get the filename
      var profilePictureName = profilePicture.path.split('/').last;

      // Adding the file in the request
      request.files.add(
        http.MultipartFile(
          'profile',
          stream,
          length,
          filename: profilePictureName,
        ),
      );

      var response = await request.send();
      var responseString = await response.stream.bytesToString();
      final responseData = jsonDecode(responseString) as Map;
      return responseData;
    } catch (err) {
      log('$err');
    }
    return {"message": "Error occurred. Something went wrong."};
  }

  Future<Map> addCover(File? coverPicture) async {
    if (coverPicture == null) {
      return {"message": "File not selected."};
    }
    try {
      var request =
          http.MultipartRequest('PUT', Uri.parse(baseurl + "user/changeCover"));

      //using the token in the headers
      request.headers.addAll({
        'Authorization': 'Bearer $token',
      });

      // need a filename
      var coverPictureName = coverPicture.path.split('/').last;

      // adding the image in the request
      request.files.add(
        http.MultipartFile(
          'cover',
          coverPicture.readAsBytes().asStream(),
          coverPicture.lengthSync(),
          filename: coverPictureName,
        ),
      );

      var response = await request.send();
      var responseString = await response.stream.bytesToString();
      final responseData = jsonDecode(responseString) as Map;
      return responseData;
    } catch (err) {
      log('$err');
    }
    return {"message": "Error Occurred. Something went wrong."};
  }

  Future<Map> generateResetToken(passResetToken user) async {
    try {
      Map<String, dynamic> userData = {
        "email": user.email,
        "newPass": user.newPassword,
      };

      final response = await post(
          Uri.parse(baseurl + "user/generatePassResetToken"),
          body: userData);

      //json serializing inline
      final responseData = jsonDecode(response.body) as Map;

      return responseData;
    } catch (err) {
      log('$err');
    }
    return {"message": "Error Occurred."};
  }

  Future<Map> resetPassword(String resetToken) async {
    try {
      final response =
          await put(Uri.parse(baseurl + "user/passReset/" + resetToken));

      //json serializing inline
      final responseData = jsonDecode(response.body) as Map;

      return responseData;
    } catch (err) {
      log('$err');
    }
    return {"message": "Error Occurred."};
  }

  Future<Map> getUser() async {
    final bearerToken = {
      HttpHeaders.authorizationHeader: 'Bearer $token',
    };

    final response =
        await get(Uri.parse(baseurl + "user/checkType"), headers: bearerToken);

    //json serializing inline
    final responseData = jsonDecode(response.body) as Map;
    return responseData;
  }

  Future<Map> getUserOther(String? user_id) async {
    try {
      final bearerToken = {
        HttpHeaders.authorizationHeader: 'Bearer $token',
      };

      final response = await post(Uri.parse(baseurl + "user/other"),
          body: {"user_id": user_id!}, headers: bearerToken);

      //json serializing inline
      final responseData = jsonDecode(response.body) as Map;
      return responseData;
    } catch (err) {
      log('$err');
    }
    return {"message": "Error Occurred."};
  }

  Future<Map> changePassword(ChangePassword passwordData) async {
    try {
      Map<String, dynamic> passData = {
        "currPassword": passwordData.currentPassword,
        "newPassword": passwordData.newPassword,
      };

      final bearerToken = {
        HttpHeaders.authorizationHeader: 'Bearer $token',
      };

      final response = await put(Uri.parse(baseurl + "user/changePassword"),
          body: passData, headers: bearerToken);

      //json serializing inline
      final responseData = jsonDecode(response.body) as Map;
      return responseData;
    } catch (err) {
      log('$err');
    }
    return {"message": "Error Occurred."};
  }

  Future<Map> changeUsername(String username) async {
    try {
      Map<String, dynamic> userData = {
        "username": username,
      };

      final bearerToken = {
        HttpHeaders.authorizationHeader: 'Bearer $token',
      };

      final response = await put(Uri.parse(baseurl + "user/changeUsername"),
          body: userData, headers: bearerToken);

      //json serializing inline
      final responseData = jsonDecode(response.body) as Map;
      return responseData;
    } catch (err) {
      log('$err');
    }
    return {"message": "Error Occurred."};
  }

  Future<Map> changeEmail(String email) async {
    try {
      Map<String, dynamic> userData = {
        "email": email,
      };

      final bearerToken = {
        HttpHeaders.authorizationHeader: 'Bearer $token',
      };

      final response = await put(Uri.parse(baseurl + "user/changeEmail"),
          body: userData, headers: bearerToken);

      //json serializing inline
      final responseData = jsonDecode(response.body) as Map;
      return responseData;
    } catch (err) {
      log('$err');
    }
    return {"message": "Error Occurred."};
  }

  Future<Map> changePhone(String phone) async {
    try {
      Map<String, dynamic> userData = {
        "phone": phone,
      };

      final bearerToken = {
        HttpHeaders.authorizationHeader: 'Bearer $token',
      };

      final response = await put(Uri.parse(baseurl + "user/changePhone"),
          body: userData, headers: bearerToken);

      //json serializing inline
      final responseData = jsonDecode(response.body) as Map;
      return responseData;
    } catch (err) {
      log('$err');
    }
    return {"message": "Error Occurred."};
  }

  Future<List> getByUsername(String parameter) async {
    final bearerToken = {
      HttpHeaders.authorizationHeader: 'Bearer $token',
    };

    final response = await post(Uri.parse(baseurl + "user/search/username"),
        body: {"parameter": parameter}, headers: bearerToken);

    //json serializing inline
    final responseData = jsonDecode(response.body);
    return responseData;
  }

  Future<List> getByEmail(String parameter) async {
    final bearerToken = {
      HttpHeaders.authorizationHeader: 'Bearer $token',
    };

    final response = await post(Uri.parse(baseurl + "user/search/email"),
        body: {"parameter": parameter}, headers: bearerToken);

    //json serializing inline
    final responseData = jsonDecode(response.body);
    return responseData;
  }
}
