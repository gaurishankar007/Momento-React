import 'dart:convert';
import 'dart:developer';
import 'dart:io';

import 'package:assignment/api/base_urls.dart';
import 'package:assignment/api/http/http_comment.dart';
import 'package:assignment/api/http/http_user.dart';
import 'package:assignment/api/model/post.dart';
import 'package:assignment/api/response/response_f_post.dart';
import 'package:assignment/api/response/response_post.dart';
import 'package:assignment/floor/database/database_instance.dart';
import 'package:assignment/floor/entity/offline_posts.dart';
import 'package:http/http.dart' as http;
import 'package:http/http.dart';

class HttpConnectPost {
  String baseurl = BaseUrl.baseUrl;
  String token = HttpConnectUser.token;

  Future<Map> postImage(AddPost postData) async {
    try {
      // Making multipart request
      var request =
          http.MultipartRequest('POST', Uri.parse(baseurl + "post/add"));

      // Adding headers
      request.headers.addAll({
        'Authorization': 'Bearer $token',
      });

      // Adding forms data
      Map<String, String> postDetail = {
        "caption": "${postData.caption}",
        "description": "${postData.description}",
      };
      request.fields.addAll(postDetail);
      for (int i = 0; i < postData.taggedFriend!.length; i++) {
        request.fields
            .addAll({"tag_friend[${i}]": "${postData.taggedFriend![i]}"});
      }

      // Adding images
      List<MultipartFile> multipartList = [];
      for (int i = 0; i < postData.images!.length; i++) {
        multipartList.add(http.MultipartFile(
          'images',
          postData.images![i].readAsBytes().asStream(),
          postData.images![i].lengthSync(),
          filename: postData.images![i].path.split('/').last,
        ));
      }
      request.files.addAll(multipartList);

      final response = await request.send();
      var responseString = await response.stream.bytesToString();
      final responseData = jsonDecode(responseString) as Map;
      return responseData;
    } catch (err) {
      log('$err');
    }
    return {"message": "Error Occurred."};
  }

  Future<GetFollowedPosts> getFollowedPost() async {
    final bearerToken = {
      HttpHeaders.authorizationHeader: 'Bearer $token',
    };

    final response = await get(Uri.parse(baseurl + "posts/get/followedUser"),
        headers: bearerToken);

    //json serializing inline
    final responseData = GetFollowedPosts.fromJson(jsonDecode(response.body));

    // Deleting offline saved data
    final database = await DatabaseInstance.instance.getDatabaseInstance();
    await database.offlinePostDao.deletePosts();

    // Offline Saving
    if (responseData.followedPosts.length > 0) {
      List<OfflinePost> offlinePosts = [];

      for (int i = 0; i < responseData.followedPosts.length; i++) {
        String comment = "";

        if (responseData.commented[i]) {
          final res = await HttpConnectComment()
              .findComment(responseData.followedPosts[i].id!);
          comment = res["commentData"]["comment"];
        }

        offlinePosts.add(OfflinePost(
          id: responseData.followedPosts[i].id!,
          postUser: responseData.followedPosts[i].user_id!["username"]!,
          liked: responseData.liked[i],
          liker: responseData.followedPosts[i].like_num!,
          commenter: responseData.followedPosts[i].comment_num!,
          caption: responseData.followedPosts[i].caption!,
          description: responseData.followedPosts[i].description!,
          commented: responseData.commented[i],
          comment: comment,
        ));
      }

      await database.offlinePostDao.savePosts(offlinePosts);
    }

    // Return data received from the Api
    return responseData;
  }

  Future<List> getPosts() async {
    final bearerToken = {
      HttpHeaders.authorizationHeader: 'Bearer $token',
    };

    final response =
        await get(Uri.parse(baseurl + "posts/get/my"), headers: bearerToken);

    //json serializing inline
    final responseData = jsonDecode(response.body);
    return responseData;
  }

  Future<List> getOtherPosts(String? user_id) async {
    final bearerToken = {
      HttpHeaders.authorizationHeader: 'Bearer $token',
    };

    final response = await post(Uri.parse(baseurl + "posts/get/other"),
        body: {"user_id": user_id!}, headers: bearerToken);

    //json serializing inline
    final responseData = jsonDecode(response.body);
    return responseData;
  }

  Future<List> getTaggedPosts() async {
    final bearerToken = {
      HttpHeaders.authorizationHeader: 'Bearer $token',
    };

    final response = await get(Uri.parse(baseurl + "posts/get/tagged"),
        headers: bearerToken);

    //json serializing inline
    final responseData = jsonDecode(response.body);
    return responseData;
  }

  Future<List> getOtherTaggedPosts(String? user_id) async {
    final bearerToken = {
      HttpHeaders.authorizationHeader: 'Bearer $token',
    };

    final response = await post(Uri.parse(baseurl + "posts/get/tagged/other"),
        body: {"user_id": user_id!}, headers: bearerToken);

    //json serializing inline
    final responseData = jsonDecode(response.body);
    return responseData;
  }

  Future<GetPost> getSinglePost(String? post_id) async {
    final bearerToken = {
      HttpHeaders.authorizationHeader: 'Bearer $token',
    };

    final response = await post(Uri.parse(baseurl + "post/get/single"),
        body: {"post_id": post_id!}, headers: bearerToken);

    //json serializing inline
    final responseData = GetPost.fromJson(jsonDecode(response.body));
    return responseData;
  }

  Future<Map> getSinglePostLC(String? post_id) async {
    final bearerToken = {
      HttpHeaders.authorizationHeader: 'Bearer $token',
    };

    final response = await post(Uri.parse(baseurl + "post/get/single/lc"),
        body: {"post_id": post_id!}, headers: bearerToken);

    //json serializing inline
    final responseData = jsonDecode(response.body) as Map;
    return responseData;
  }

  Future<Map> updatePost(UpdatedPost postData) async {
    Map<String, dynamic> postDetail = {
      "post_id": postData.post_id,
      "caption": postData.caption,
      "description": postData.description,
    };

    for (int i = 0; i < postData.taggedFriend!.length; i++) {
      postDetail["tag_friend[${i}]"] = "${postData.taggedFriend![i]}";
    }

    final bearerToken = {
      HttpHeaders.authorizationHeader: 'Bearer $token',
    };

    final response = await put(Uri.parse(baseurl + "post/edit"),
        body: postDetail, headers: bearerToken);

    //json serializing inline
    final responseData = jsonDecode(response.body);
    return responseData;
  }

  Future<Map> deletePost(String? post_id) async {
    final bearerToken = {
      HttpHeaders.authorizationHeader: 'Bearer $token',
    };

    final response = await delete(Uri.parse(baseurl + "post/delete"),
        body: {"post_id": post_id!}, headers: bearerToken);

    //json serializing inline
    final responseData = jsonDecode(response.body);
    return responseData;
  }
}
