import 'dart:convert';
import 'dart:developer';
import 'dart:io';

import 'package:assignment/api/http/http_user.dart';
import 'package:http/http.dart';

import '../base_urls.dart';

class HttpConnectReport {
  String baseurl = BaseUrl.baseUrl;
  String token = HttpConnectUser.token;

  Future<Map> report(String? post_id, List<String> report_for) async {
    try {
      Map<String, dynamic> reportData = {
        "post_id": post_id,
      };
      for (int i = 0; i < report_for.length; i++) {
        reportData["report_for[$i]"] = report_for[i];
      }
      final bearerToken = {
        HttpHeaders.authorizationHeader: 'Bearer $token',
      };

      final response = await post(Uri.parse(baseurl + "report/post"),
          body: reportData, headers: bearerToken);

      //json serializing inline
      final responseData = jsonDecode(response.body) as Map;
      return responseData;
    } catch (error) {
      log("$error");
    }
    return {"message": "Error occurred! something went wrong."};
  }
}
