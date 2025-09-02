import 'dart:convert';
import 'dart:developer';
import 'dart:io';

import 'package:assignment/api/http/http_user.dart';
import 'package:assignment/api/model/user.dart';
import 'package:http/http.dart';

import '../base_urls.dart';

class HttpConnectProfile {
  String baseurl = BaseUrl.baseUrl;
  String token = HttpConnectUser.token;

  Future<Map> getPersonalInfo() async {
    final bearerToken = {
      HttpHeaders.authorizationHeader: 'Bearer $token',
    };

    final response =
        await get(Uri.parse(baseurl + "profile/get/my"), headers: bearerToken);

    //json serializing inline
    final responseData = jsonDecode(response.body) as Map;
    return responseData;
  }

  Future<Map> getPersonalOther(String? user_id) async {
    try {
      final bearerToken = {
        HttpHeaders.authorizationHeader: 'Bearer $token',
      };

      final response = await post(Uri.parse(baseurl + "profile/get/other"),
          body: {"user_id": user_id!}, headers: bearerToken);

      //json serializing inline
      final responseData = jsonDecode(response.body) as Map;
      return responseData;
    } catch (err) {
      log('$err');
    }
    return {"message": "Error Occurred."};
  }

  Future<Map> addPersonalInfo(PersonalInfoRegister pInfo) async {
    try {
      Map<String, dynamic> userData = {
        "first_name": pInfo.firstName,
        "last_name": pInfo.lastName,
        "gender": pInfo.gender,
        "birthday": pInfo.birthDate,
        "biography": pInfo.biography,
      };

      final bearerToken = {
        HttpHeaders.authorizationHeader: 'Bearer $token',
      };

      final response = await put(Uri.parse(baseurl + "profile/update"),
          body: userData, headers: bearerToken);

      //json serializing inline
      final responseData = jsonDecode(response.body) as Map;

      return responseData;
    } catch (err) {
      log('$err');
    }
    return {"message": "Error Occurred."};
  }
}
