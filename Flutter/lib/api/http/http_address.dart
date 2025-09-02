import 'dart:convert';
import 'dart:developer';
import 'dart:io';

import 'package:assignment/api/http/http_user.dart';
import 'package:assignment/api/model/user.dart';
import 'package:http/http.dart';

import '../base_urls.dart';

class HttpConnectAddress {
  String baseurl = BaseUrl.baseUrl;
  String token = HttpConnectUser.token;

  Future<Map> getAddressInfo() async {
    final bearerToken = {
      HttpHeaders.authorizationHeader: 'Bearer $token',
    };

    final response =
        await get(Uri.parse(baseurl + "address/get/my"), headers: bearerToken);

    //json serializing inline
    final responseData = jsonDecode(response.body) as Map;
    return responseData;
  }

  Future<Map> getAddressOther(String? user_id) async {
    try {
      final bearerToken = {
        HttpHeaders.authorizationHeader: 'Bearer $token',
      };

      final response = await post(Uri.parse(baseurl + "address/get/other"),
          body: {"user_id": user_id}, headers: bearerToken);

      //json serializing inline
      final responseData = jsonDecode(response.body) as Map;
      return responseData;
    } catch (err) {
      log('$err');
    }
    return {"message": "Error Occurred."};
  }

  Future<Map> addAddress(AddressRegister address) async {
    try {
      Map<String, dynamic> userData = {
        "pCountry": address.pCountry,
        "pState": address.pState,
        "pCity": address.pCity,
        "pStreet": address.pStreet,
        "tCountry": address.tCountry,
        "tState": address.tState,
        "tCity": address.tCity,
        "tStreet": address.tStreet,
      };

      final bearerToken = {
        HttpHeaders.authorizationHeader: 'Bearer $token',
      };

      final response = await put(Uri.parse(baseurl + "address/update"),
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
