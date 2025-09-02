import 'dart:io';

import 'package:assignment/api/base_urls.dart';
import 'package:assignment/api/http/http_user.dart';
import 'package:assignment/screens/riverpod/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:motion_toast/motion_toast.dart';
import 'package:motion_toast/resources/arrays.dart';

class ProfileSetting extends StatefulWidget {
  const ProfileSetting({Key? key}) : super(key: key);

  @override
  _ProfileSettingState createState() => _ProfileSettingState();
}

class _ProfileSettingState extends State<ProfileSetting> {
  final themeController =
      StateNotifierProvider<ThemeNotifier, bool>((_) => ThemeNotifier());
  File? profilePicture = null;
  String profilePictureName = "";
  String profilePictureUrl = BaseUrl.profilePicUrl;

  late Future<Map> getProfile;

  @override
  void initState() {
    super.initState();
    getProfile = HttpConnectUser().getUser();
  }

  @override
  Widget build(BuildContext context) {
    final _screenWidth = MediaQuery.of(context).size.width;
    return Consumer(builder: (context, ref, child) {
      Color backColor =
          ref.watch(themeController) ? Colors.black : Colors.white;
      Color textColor =
          ref.watch(themeController) ? Colors.white : Colors.black87;
      return Scaffold(
        backgroundColor: backColor,
        appBar: AppBar(
          iconTheme: IconThemeData(
            color: textColor,
          ),
          backgroundColor: backColor,
          title: Text(
            "Profile Picture",
            style: TextStyle(
              color: textColor,
              fontSize: 20,
            ),
          ),
          centerTitle: true,
          shape: Border(
            bottom: BorderSide(
              color: textColor,
              width: .1,
            ),
          ),
          elevation: 2,
          shadowColor: textColor,
        ),
        body: SingleChildScrollView(
          child: Center(
            child: FutureBuilder<Map>(
                future: getProfile,
                builder: (context, snapshot) {
                  if (snapshot.hasData) {
                    return Column(
                      children: [
                        SizedBox(
                          height: 20,
                        ),
                        (profilePicture == null)
                            ? CircleAvatar(
                                radius: _screenWidth * .43,
                                backgroundColor: Colors.deepPurpleAccent[700],
                                child: CircleAvatar(
                                  radius: _screenWidth * .40,
                                  backgroundImage: NetworkImage(
                                      profilePictureUrl +
                                          snapshot.data!["userData"]
                                              ["profile_pic"]),
                                ),
                              )
                            : CircleAvatar(
                                radius: _screenWidth * .43,
                                backgroundColor: Colors.deepPurpleAccent[700],
                                child: CircleAvatar(
                                  radius: _screenWidth * .40,
                                  backgroundImage: FileImage(profilePicture!),
                                ),
                              ),
                        SizedBox(
                          height: 5,
                        ),
                        Column(
                          children: [
                            ElevatedButton(
                              onPressed: () async {
                                showModalBottomSheet(
                                  isScrollControlled: true,
                                  context: context,
                                  backgroundColor: Colors.transparent,
                                  builder: (builder) => Container(
                                    padding: EdgeInsets.only(top: 5),
                                    decoration: BoxDecoration(
                                      color: backColor,
                                      borderRadius: new BorderRadius.only(
                                        topLeft: const Radius.circular(25.0),
                                        topRight: const Radius.circular(25.0),
                                      ),
                                      boxShadow: [
                                        BoxShadow(
                                          color: textColor,
                                          spreadRadius: 1,
                                          blurRadius: 2,
                                          offset: Offset(0,
                                              1), // changes position of shadow
                                        ),
                                      ],
                                    ),
                                    height: 80,
                                    width: _screenWidth,
                                    child: Column(
                                      children: [
                                        Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.spaceAround,
                                          children: [
                                            ElevatedButton(
                                              onPressed: () async {
                                                final image =
                                                    await ImagePicker()
                                                        .pickImage(
                                                            source: ImageSource
                                                                .camera);
                                                if (image == null) {
                                                  return;
                                                }
                                                setState(() {
                                                  profilePicture =
                                                      File(image.path);
                                                  profilePictureName = image
                                                      .path
                                                      .split("/")
                                                      .last;
                                                });
                                                Navigator.pop(context);
                                              },
                                              child: Row(
                                                children: [
                                                  Icon(
                                                    Icons.camera,
                                                    size: 30,
                                                    color: Colors.white,
                                                  ),
                                                  SizedBox(
                                                    width: _screenWidth * .03,
                                                  ),
                                                  Text(
                                                    "Camera",
                                                    style: TextStyle(
                                                      color: Colors.white,
                                                      fontSize: 15,
                                                    ),
                                                  )
                                                ],
                                              ),
                                              style: ElevatedButton.styleFrom(
                                                padding: EdgeInsets.symmetric(
                                                    horizontal: 15,
                                                    vertical: 5),
                                                primary: Colors
                                                    .deepPurpleAccent[700],
                                                elevation: 5,
                                                shadowColor:
                                                    Colors.deepPurpleAccent,
                                                shape: RoundedRectangleBorder(
                                                  borderRadius:
                                                      BorderRadius.circular(20),
                                                ),
                                              ),
                                            ),
                                            Container(
                                              decoration: BoxDecoration(
                                                borderRadius:
                                                    BorderRadius.circular(3),
                                                color: Colors
                                                    .deepPurpleAccent[700],
                                              ),
                                              height: 55,
                                              width: 4,
                                            ),
                                            ElevatedButton(
                                              onPressed: () async {
                                                final image =
                                                    await ImagePicker()
                                                        .pickImage(
                                                            source: ImageSource
                                                                .gallery);
                                                if (image == null) {
                                                  return;
                                                }
                                                setState(() {
                                                  profilePicture =
                                                      File(image.path);
                                                  profilePictureName = image
                                                      .path
                                                      .split("/")
                                                      .last;
                                                });
                                                Navigator.pop(context);
                                              },
                                              child: Row(
                                                children: [
                                                  Icon(
                                                    Icons.photo_album,
                                                    size: 30,
                                                    color: Colors.white,
                                                  ),
                                                  SizedBox(
                                                    width: _screenWidth * .03,
                                                  ),
                                                  Text(
                                                    "Gallery",
                                                    style: TextStyle(
                                                      color: Colors.white,
                                                      fontSize: 15,
                                                    ),
                                                  )
                                                ],
                                              ),
                                              style: ElevatedButton.styleFrom(
                                                padding: EdgeInsets.symmetric(
                                                    horizontal: 15,
                                                    vertical: 5),
                                                primary: Colors
                                                    .deepPurpleAccent[700],
                                                elevation: 5,
                                                shadowColor:
                                                    Colors.deepPurpleAccent,
                                                shape: RoundedRectangleBorder(
                                                  borderRadius:
                                                      BorderRadius.circular(20),
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                        SizedBox(
                                          height: 10,
                                        ),
                                        Container(
                                          decoration: BoxDecoration(
                                            borderRadius:
                                                BorderRadius.circular(3),
                                            color: Colors.deepPurpleAccent[700],
                                          ),
                                          width: _screenWidth * .30,
                                          height: 5,
                                        ),
                                      ],
                                    ),
                                  ),
                                );
                              },
                              child: Icon(
                                Icons.upload_outlined,
                                size: 40,
                              ),
                              style: ElevatedButton.styleFrom(
                                primary: Colors.deepPurpleAccent[700],
                                elevation: 10,
                                shadowColor: Colors.deepPurpleAccent,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(20),
                                ),
                              ),
                            ),
                            Text(
                              profilePictureName,
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                color: textColor,
                                fontSize: 15,
                              ),
                            )
                          ],
                        ),
                        SizedBox(
                          height: 10,
                        ),
                        ElevatedButton(
                          onPressed: () async {
                            if (profilePicture != null) {
                              final res = await HttpConnectUser()
                                  .addProfile(profilePicture);
                              if (res["message"] ==
                                  "New profile picture added.") {
                                Navigator.pop(context);
                                MotionToast.success(
                                  position: MOTION_TOAST_POSITION.top,
                                  animationType: ANIMATION.fromTop,
                                  toastDuration: Duration(seconds: 2),
                                  description: res["message"],
                                ).show(context);
                              } else {
                                MotionToast.error(
                                  position: MOTION_TOAST_POSITION.top,
                                  animationType: ANIMATION.fromTop,
                                  toastDuration: Duration(seconds: 2),
                                  description: res["message"],
                                ).show(context);
                              }
                            } else {
                              MotionToast.error(
                                position: MOTION_TOAST_POSITION.top,
                                animationType: ANIMATION.fromTop,
                                toastDuration: Duration(seconds: 1),
                                description: "Select a profile picture first.",
                              ).show(context);
                            }
                          },
                          child: Text(
                            "Change Profile Picture",
                            style: TextStyle(
                              fontSize: 15,
                            ),
                          ),
                          style: ElevatedButton.styleFrom(
                            primary: Colors.deepPurpleAccent[700],
                            elevation: 10,
                            shadowColor: Colors.deepPurpleAccent,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                        ),
                      ],
                    );
                  } else if (snapshot.hasError) {
                    return Center(
                      child: Text(
                        "${snapshot.error}",
                        style: TextStyle(
                          color: textColor,
                          fontSize: 15,
                        ),
                      ),
                    );
                  }
                  return Center(
                      child: CircularProgressIndicator(
                    color: Colors.deepPurple,
                  ));
                }),
          ),
        ),
      );
    });
  }
}
