import 'dart:convert';
import 'dart:io';

import 'package:assignment/api/http/http_user.dart';
import 'package:http/http.dart';

import '../base_urls.dart';

class HttpConnectLike {
  String baseurl = BaseUrl.baseUrl;
  String token = HttpConnectUser.token;

  Future<List> getLikes(String? post_id) async {
    final bearerToken = {
      HttpHeaders.authorizationHeader: 'Bearer $token',
    };

    final response = await post(Uri.parse(baseurl + "likes/get"),
        body: {"post_id": post_id}, headers: bearerToken);

    //json serializing inline
    final responseData = jsonDecode(response.body);
    return responseData;
  }

  Future<Map> checkLike(String? post_id) async {
    final bearerToken = {
      HttpHeaders.authorizationHeader: 'Bearer $token',
    };

    final response = await post(Uri.parse(baseurl + "like/find"),
        body: {"post_id": post_id}, headers: bearerToken);

    //json serializing inline
    final responseData = jsonDecode(response.body) as Map;
    return responseData;
  }

  Future<Map> likePost(String? post_id) async {
    final bearerToken = {
      HttpHeaders.authorizationHeader: 'Bearer $token',
    };

    final response = await post(Uri.parse(baseurl + "like/post"),
        body: {"post_id": post_id}, headers: bearerToken);

    //json serializing inline
    final responseData = jsonDecode(response.body) as Map;
    return responseData;
  }
}
