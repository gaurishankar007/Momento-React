import 'dart:convert';
import 'dart:developer';
import 'dart:io';

import 'package:column_example/http/http_user.dart';
import 'package:column_example/model/student.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:http/http.dart' as http;

class HttpConnectStudent {
  final baseurl = 'http://10.0.2.2:3000/api/v1/';
  String mytoken = HttpConnectUser.token;

  Future<String> uploadImage(String filepath, String id) async {
    try {
      String route = 'student/' + id + '/photo';
      String url = baseurl + route;
      var request = http.MultipartRequest('PUT', Uri.parse(url));
      //using the token in the headers
      request.headers.addAll({
        'Authorization': 'Bearer $mytoken',
      });
      // need a filename
      
      var ss = filepath.split('/').last;
    // adding the file in the request
      request.files.add(
        http.MultipartFile(
          'file',
          File(filepath).readAsBytes().asStream(),
          File(filepath).lengthSync(),
          filename: ss,
        ),
      );


      var response = await request.send();
      var responseString = await response.stream.bytesToString();
      if (response.statusCode == 200) {
        return responseString;
      }
    } catch (err) {
      log('$err');
    }
    return 'something goes wrong';
  }

  void registerStudentPosts(Student student, File? filepath) async {
    Map<String, dynamic> studentMap = {
      'fullname': student.fullname,
      'age': student.age.toString(),
      'gender': student.gender,
      'address': student.address,
    };
    String tok = 'Bearer $mytoken';
    try {
      final response = await http
          .post(Uri.parse(baseurl + 'student/'), body: studentMap, headers: {
        'Authorization': tok,
      });

      if (response.statusCode == 201) {
        //uploading image after data inserted of student

        if (filepath != null) {
          var jsonData = jsonDecode(response.body);
          uploadImage(filepath.path, jsonData['data']['_id']);
        }
        Fluttertoast.showToast(msg: "Data uploaded successfully");
      }
    } catch (err) {
      log('$err');
    }
  }
}