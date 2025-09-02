import 'dart:io';

import 'package:assignment/api/http/http_user.dart';
import 'package:assignment/screens/riverpod/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:motion_toast/motion_toast.dart';
import 'package:motion_toast/resources/arrays.dart';

class AddProfilePicture extends StatefulWidget {
  const AddProfilePicture({Key? key}) : super(key: key);

  @override
  _AddProfilePictureState createState() => _AddProfilePictureState();
}

class _AddProfilePictureState extends State<AddProfilePicture> {
  final themeController =
      StateNotifierProvider<ThemeNotifier, bool>((_) => ThemeNotifier());
  File? profilePicture = null;
  String profilePictureName = "defaultProfile.jpg";

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
            "WatchMe",
            style: TextStyle(
              color: textColor,
              fontSize: 30,
              fontFamily: "BerkshireSwash-Regular",
            ),
          ),
          centerTitle: true,
          shape: Border(
            bottom: BorderSide(
              color: textColor,
              width: .1,
            ),
          ),
          elevation: 0,
        ),
        body: SingleChildScrollView(
          child: Padding(
            padding: EdgeInsets.only(
              top: _screenWidth * 0.03,
              left: _screenWidth * 0.03,
              right: _screenWidth * 0.03,
            ),
            child: Column(
              children: [
                Text(
                  "Add a Profile Picture",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: textColor,
                    fontSize: 25,
                    fontFamily: "Laila-Bold",
                  ),
                ),
                SizedBox(
                  height: 10,
                ),
                (profilePicture == null)
                    ? CircleAvatar(
                        radius: _screenWidth * .25,
                        backgroundImage:
                            AssetImage("images/defaultProfile.png"),
                      )
                    : CircleAvatar(
                        radius: _screenWidth * .25,
                        backgroundImage: FileImage(profilePicture!),
                      ),
                SizedBox(
                  height: 20,
                ),
                Column(
                  children: [
                    ElevatedButton(
                      key: ValueKey("ButtonSelectProfile"),
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
                                  offset: Offset(
                                      0, 1), // changes position of shadow
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
                                        final image = await ImagePicker()
                                            .pickImage(
                                                source: ImageSource.camera);
                                        if (image == null) {
                                          return;
                                        }
                                        setState(() {
                                          profilePicture = File(image.path);
                                          profilePictureName =
                                              image.path.split("/").last;
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
                                            horizontal: 15, vertical: 5),
                                        primary: Colors.deepPurpleAccent[700],
                                        elevation: 5,
                                        shadowColor: Colors.deepPurpleAccent,
                                        shape: RoundedRectangleBorder(
                                          borderRadius:
                                              BorderRadius.circular(20),
                                        ),
                                      ),
                                    ),
                                    Container(
                                      decoration: BoxDecoration(
                                        borderRadius: BorderRadius.circular(3),
                                        color: Colors.deepPurpleAccent[700],
                                      ),
                                      height: 55,
                                      width: 4,
                                    ),
                                    ElevatedButton(
                                      onPressed: () async {
                                        final image = await ImagePicker()
                                            .pickImage(
                                                source: ImageSource.gallery);
                                        if (image == null) {
                                          return;
                                        }
                                        setState(() {
                                          profilePicture = File(image.path);
                                          profilePictureName =
                                              image.path.split("/").last;
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
                                              color: backColor,
                                              fontSize: 15,
                                            ),
                                          )
                                        ],
                                      ),
                                      style: ElevatedButton.styleFrom(
                                        padding: EdgeInsets.symmetric(
                                            horizontal: 15, vertical: 5),
                                        primary: Colors.deepPurpleAccent[700],
                                        elevation: 5,
                                        shadowColor: Colors.deepPurpleAccent,
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
                                    borderRadius: BorderRadius.circular(3),
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
                      child: Text(
                        "Select a profile picture",
                        style: TextStyle(
                          fontSize: 15,
                        ),
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
                  height: 15,
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    TextButton(
                      onPressed: () {
                        Navigator.pushNamed(context, "/add-cover");
                      },
                      child: Text(
                        "Skip",
                        style: TextStyle(
                          color: Colors.deepPurpleAccent[700],
                          fontSize: 20,
                          shadows: const [
                            Shadow(
                              color: Colors.deepPurpleAccent,
                              offset: Offset(3, 4),
                              blurRadius: 20,
                            ),
                          ],
                        ),
                      ),
                    ),
                    ElevatedButton(
                      onPressed: () async {
                        if (profilePicture != null) {
                          final res = await HttpConnectUser()
                              .addProfile(profilePicture);
                          if (res["message"] == "New profile picture added.") {
                            Navigator.pushNamed(context, "/add-cover");
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
                        "Next",
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
                ),
              ],
            ),
          ),
        ),
      );
    });
  }
}
