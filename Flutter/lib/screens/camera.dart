import 'dart:async';
import 'dart:io';
import 'package:assignment/api/base_urls.dart';
import 'package:flutter/foundation.dart' as foundation;

import 'package:assignment/api/http/http_user.dart';
import 'package:assignment/api/http/http_watch.dart';
import 'package:assignment/api/http/http_post.dart';
import 'package:assignment/api/model/post.dart';
import 'package:assignment/screens/riverpod/theme.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:motion_toast/motion_toast.dart';
import 'package:motion_toast/resources/arrays.dart';
import 'package:proximity_sensor/proximity_sensor.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

class Camera extends StatefulWidget {
  const Camera({Key? key}) : super(key: key);

  @override
  _CameraState createState() => _CameraState();
}

class _CameraState extends State<Camera> {
  final themeController =
      StateNotifierProvider<ThemeNotifier, bool>((_) => ThemeNotifier());
  int activeNav = 2;

  late StreamSubscription<dynamic> _streamSubscription;

  Future<void> listenSensor() async {
    FlutterError.onError = (FlutterErrorDetails details) {
      if (foundation.kDebugMode) {
        FlutterError.dumpErrorToConsole(details);
      }
    };
    _streamSubscription = ProximitySensor.events.listen((int event) {
      if (event > 0) {
        fromCamera();
      }
    });
  }

  late Future<Map> getUser;
  List<File> posts = [];
  int activatedIndex = 0;
  String caption = "", description = "";
  List<String> tag_friend_id = [];
  List<String> tag_friend_name = [];
  List<String> tag_friend_profile_pic = [];

  String profilePicUrl = BaseUrl.profilePicUrl;

  void fromCamera() async {
    final image = await ImagePicker().pickImage(source: ImageSource.camera);
    if (image == null) {
      return;
    }
    setState(() {
      posts.add(File(image.path));
    });
  }

  void fromGallery() async {
    final images = await ImagePicker().pickMultiImage();
    if (images == null) {
      return;
    }
    if (images.length > 12) {
      return MotionToast.error(
        position: MOTION_TOAST_POSITION.top,
        animationType: ANIMATION.fromTop,
        toastDuration: Duration(seconds: 2),
        description: "A post can have up to 12 images only.",
      ).show(context);
    }
    setState(() {
      images.forEach((singleImage) {
        posts.add(File(singleImage.path));
      });
    });
  }

  Future<List> getUserFollowers() async {
    final res = await HttpConnectWatch().getWatchers();
    return res;
  }

  @override
  void initState() {
    super.initState();
    getUser = HttpConnectUser().getUser();
    listenSensor();
  }

  @override
  void dispose() {
    super.dispose();
    _streamSubscription.cancel();
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
        body: SafeArea(
          child: posts.isEmpty
              ? Center(
                  child: CircleAvatar(
                    radius: _screenWidth * .5,
                    backgroundColor: Colors.deepPurpleAccent[700],
                    child: CircleAvatar(
                      radius: _screenWidth * .47,
                      backgroundColor: backColor,
                      child: SingleChildScrollView(
                        child: Column(
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceAround,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                ElevatedButton(
                                  onPressed: () {
                                    fromCamera();
                                  },
                                  child: Row(
                                    children: [
                                      Icon(
                                        Icons.camera,
                                        size: _screenWidth > 250 ? 35 : 10,
                                        color: Colors.white,
                                      ),
                                      SizedBox(
                                        width: _screenWidth * .03,
                                      ),
                                      Text(
                                        "Camera",
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontSize: _screenWidth > 250 ? 15 : 7,
                                        ),
                                      )
                                    ],
                                  ),
                                  style: ElevatedButton.styleFrom(
                                    padding: EdgeInsets.symmetric(
                                        horizontal: 20, vertical: 8),
                                    primary: Colors.deepPurpleAccent[700],
                                    elevation: 5,
                                    shadowColor: Colors.deepPurpleAccent,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(20),
                                    ),
                                  ),
                                ),
                                Container(
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(10),
                                    color: Colors.deepPurpleAccent[700],
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.deepPurpleAccent,
                                        spreadRadius: 1,
                                        blurRadius: 20,
                                        offset: Offset(1, 1),
                                      ),
                                    ],
                                  ),
                                  height: _screenWidth > 250 ? 100 : 60,
                                  width: _screenWidth > 250 ? 20 : 10,
                                ),
                                ElevatedButton(
                                  onPressed: () async {
                                    fromGallery();
                                  },
                                  child: Row(
                                    children: [
                                      Icon(
                                        Icons.photo_album,
                                        size: _screenWidth > 250 ? 35 : 10,
                                        color: Colors.white,
                                      ),
                                      SizedBox(
                                        width: _screenWidth * .03,
                                      ),
                                      Text(
                                        "Gallery",
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontSize: _screenWidth > 250 ? 15 : 7,
                                        ),
                                      )
                                    ],
                                  ),
                                  style: ElevatedButton.styleFrom(
                                    padding: EdgeInsets.symmetric(
                                        horizontal: 20, vertical: 8),
                                    primary: Colors.deepPurpleAccent[700],
                                    elevation: 5,
                                    shadowColor: Colors.deepPurpleAccent,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(20),
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
                                borderRadius: BorderRadius.circular(20),
                                color: Colors.deepPurpleAccent[700],
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.deepPurpleAccent,
                                    spreadRadius: 1,
                                    blurRadius: 20,
                                    offset: Offset(1, 1),
                                  ),
                                ],
                              ),
                              width: _screenWidth * .45,
                              height: _screenWidth > 250 ? 50 : 30,
                              child: Center(
                                  child: Container(
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(20),
                                  color: backColor,
                                ),
                                height: _screenWidth > 250 ? 25 : 15,
                                width: _screenWidth * .40,
                              )),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                )
              : SingleChildScrollView(
                  child: Column(
                    children: [
                      SizedBox(
                        height: 5,
                      ),
                      CarouselSlider(
                        items: posts.map((i) {
                          return Builder(builder: (BuildContext context) {
                            return Image(
                              width: _screenWidth,
                              image: FileImage(i),
                              fit: BoxFit.cover,
                            );
                          });
                        }).toList(),
                        options: CarouselOptions(
                          initialPage: 0, // shows the first image
                          viewportFraction: 1, // shows one image at a time
                          enableInfiniteScroll:
                              false, // makes carousel scrolling only from first image to last image, disables loop scrolling
                          onPageChanged: ((indexCar, reason) {
                            setState(() {
                              activatedIndex = indexCar;
                            });
                          }),
                        ),
                      ),
                      SizedBox(
                        height: 5,
                      ),
                      AnimatedSmoothIndicator(
                        activeIndex: activatedIndex,
                        count: posts.length,
                        effect: WormEffect(
                          dotColor: textColor,
                          activeDotColor: Colors.deepPurpleAccent,
                          dotHeight: 9,
                          dotWidth: 9,
                        ),
                      ),
                      Padding(
                        padding: EdgeInsets.symmetric(
                          horizontal: _screenWidth * .03,
                        ),
                        child: Column(
                          children: [
                            SizedBox(
                              height: 20,
                            ),
                            TextFormField(
                              onChanged: (value) {
                                caption = value.trim();
                              },
                              textCapitalization: TextCapitalization.words,
                              style: TextStyle(
                                color: textColor,
                              ),
                              decoration: InputDecoration(
                                labelText: "Caption",
                                labelStyle: TextStyle(
                                  color: textColor,
                                  fontFamily: "Laila-Bold",
                                ),
                                hintText: "Enter post's caption.....",
                                hintStyle: TextStyle(
                                  color: textColor,
                                ),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(10),
                                  borderSide: BorderSide(
                                    width: 2,
                                    style: BorderStyle.solid,
                                  ),
                                ),
                                enabledBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(10),
                                  borderSide: BorderSide(
                                    color: textColor,
                                    width: 2,
                                    style: BorderStyle.solid,
                                  ),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(10),
                                  borderSide: BorderSide(
                                    color: textColor,
                                    width: 2,
                                    style: BorderStyle.solid,
                                  ),
                                ),
                              ),
                            ),
                            SizedBox(
                              height: 20,
                            ),
                            TextFormField(
                              maxLines: 3,
                              onChanged: (value) {
                                description = value.trim();
                              },
                              keyboardType: TextInputType.multiline,
                              textCapitalization: TextCapitalization.sentences,
                              style: TextStyle(
                                color: textColor,
                              ),
                              decoration: InputDecoration(
                                labelText: "Description",
                                labelStyle: TextStyle(
                                  color: textColor,
                                  fontFamily: "Laila-Bold",
                                ),
                                hintText: "Enter post's description.....",
                                hintStyle: TextStyle(
                                  color: textColor,
                                ),
                                helperText: "Optional",
                                helperStyle: TextStyle(
                                  color: textColor,
                                ),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(10),
                                  borderSide: BorderSide(
                                    width: 2,
                                    style: BorderStyle.solid,
                                  ),
                                ),
                                enabledBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(10),
                                  borderSide: BorderSide(
                                    color: textColor,
                                    width: 2,
                                    style: BorderStyle.solid,
                                  ),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(10),
                                  borderSide: BorderSide(
                                    color: textColor,
                                    width: 2,
                                    style: BorderStyle.solid,
                                  ),
                                ),
                              ),
                            ),
                            SizedBox(
                              height: 10,
                            ),
                            ElevatedButton(
                              onPressed: () {
                                showModalBottomSheet(
                                  backgroundColor: Colors.transparent,
                                  context: context,
                                  builder: (builder) => SingleChildScrollView(
                                    child: Container(
                                      padding: EdgeInsets.only(
                                        top: 5,
                                        left: _screenWidth * .05,
                                        right: 5,
                                      ),
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
                                      child: Column(
                                        children: [
                                          Container(
                                            decoration: BoxDecoration(
                                              borderRadius:
                                                  BorderRadius.circular(5),
                                              color:
                                                  Colors.deepPurpleAccent[700],
                                            ),
                                            height: 5,
                                            width: _screenWidth * .20,
                                          ),
                                          Container(
                                            height: 250,
                                            child: FutureBuilder<List>(
                                              future: getUserFollowers(),
                                              builder: (context, snapshot) {
                                                if (snapshot.hasData) {
                                                  return ListView.builder(
                                                    itemCount:
                                                        snapshot.data!.length,
                                                    itemBuilder:
                                                        (context, index) =>
                                                            ListTile(
                                                      contentPadding:
                                                          EdgeInsets.zero,
                                                      minVerticalPadding: 1,
                                                      leading: CircleAvatar(
                                                        radius: 20,
                                                        backgroundImage: NetworkImage(
                                                            profilePicUrl +
                                                                snapshot.data![
                                                                            index]
                                                                        [
                                                                        "follower"]
                                                                    [
                                                                    "profile_pic"]),
                                                      ),
                                                      title: Text(
                                                        snapshot.data![index]
                                                                ["follower"]
                                                            ["username"],
                                                        style: TextStyle(
                                                            fontSize: 15,
                                                            color: textColor,
                                                            fontFamily:
                                                                "Laila-bold"),
                                                      ),
                                                      onTap: () {
                                                        if (!tag_friend_id
                                                            .contains(snapshot
                                                                            .data![
                                                                        index]
                                                                    ["follower"]
                                                                ["_id"])) {
                                                          setState(
                                                            () {
                                                              tag_friend_id.add(
                                                                  snapshot.data![
                                                                              index]
                                                                          [
                                                                          "follower"]
                                                                      ["_id"]);
                                                              tag_friend_name.add(
                                                                  snapshot.data![
                                                                              index]
                                                                          [
                                                                          "follower"]
                                                                      [
                                                                      "username"]);
                                                              tag_friend_profile_pic.add(
                                                                  snapshot.data![
                                                                              index]
                                                                          [
                                                                          "follower"]
                                                                      [
                                                                      "profile_pic"]);
                                                            },
                                                          );
                                                          Navigator.pop(
                                                              context);
                                                        }
                                                      },
                                                    ),
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
                                                  child:
                                                      const CircularProgressIndicator(
                                                    color: Colors.deepPurple,
                                                  ),
                                                );
                                              },
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                );
                              },
                              child: Text(
                                "Tag Watchers",
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
                            tag_friend_id.isEmpty
                                ? SizedBox(
                                    height: 20,
                                  )
                                : Column(
                                    children: [
                                      SizedBox(
                                        height: 10,
                                      ),
                                      Container(
                                        alignment: Alignment.topLeft,
                                        child: Text(
                                          "Tagged Watchers",
                                          style: TextStyle(
                                            color: textColor,
                                            fontFamily: "Laila-Bold",
                                            fontSize: 20,
                                          ),
                                        ),
                                      ),
                                      SingleChildScrollView(
                                        child: Container(
                                          padding: EdgeInsets.symmetric(
                                              horizontal: 5),
                                          decoration: BoxDecoration(
                                            color: backColor,
                                            border: Border.all(
                                              color: textColor,
                                              width: 2,
                                            ),
                                            borderRadius:
                                                BorderRadius.circular(10),
                                          ),
                                          height: 200,
                                          child: ListView.builder(
                                            itemCount: tag_friend_name.length,
                                            itemBuilder: (context, index) =>
                                                ListTile(
                                              contentPadding: EdgeInsets.zero,
                                              minVerticalPadding: 1,
                                              leading: CircleAvatar(
                                                radius: 20,
                                                backgroundImage: NetworkImage(
                                                    profilePicUrl +
                                                        tag_friend_profile_pic[
                                                            index]),
                                              ),
                                              title: Text(
                                                tag_friend_name[index],
                                                style: TextStyle(
                                                    fontSize: 15,
                                                    color: textColor,
                                                    fontFamily: "Laila-bold"),
                                              ),
                                              trailing: IconButton(
                                                onPressed: () {
                                                  setState(() {
                                                    tag_friend_id
                                                        .removeAt(index);
                                                    tag_friend_name
                                                        .removeAt(index);
                                                    tag_friend_profile_pic
                                                        .removeAt(index);
                                                  });
                                                },
                                                icon: Icon(
                                                  Icons.delete,
                                                  size: 20,
                                                  color: Colors.red,
                                                ),
                                              ),
                                            ),
                                          ),
                                        ),
                                      ),
                                      SizedBox(
                                        height: 5,
                                      ),
                                      ElevatedButton(
                                        onPressed: () {
                                          setState(() {
                                            tag_friend_id.clear();
                                            tag_friend_name.clear();
                                            tag_friend_profile_pic.clear();
                                          });
                                        },
                                        child: Text(
                                          "Cancel Tagging",
                                          style: TextStyle(
                                            fontSize: 15,
                                          ),
                                        ),
                                        style: ElevatedButton.styleFrom(
                                          primary: Colors.deepPurpleAccent[700],
                                          elevation: 10,
                                          shadowColor: Colors.deepPurpleAccent,
                                          shape: RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(20),
                                          ),
                                        ),
                                      )
                                    ],
                                  ),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                TextButton(
                                  onPressed: () {
                                    Navigator.pop(context);
                                    Navigator.pushNamed(context, "/camera");
                                  },
                                  child: Text(
                                    "Cancel",
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
                                    if (caption == "") {
                                      return MotionToast.error(
                                        position: MOTION_TOAST_POSITION.top,
                                        animationType: ANIMATION.fromTop,
                                        toastDuration: Duration(seconds: 2),
                                        description:
                                            "Give a caption to your post.",
                                      ).show(context);
                                    }
                                    final res = await HttpConnectPost()
                                        .postImage(AddPost(
                                      caption: caption,
                                      description: description,
                                      images: posts,
                                      taggedFriend: tag_friend_id,
                                    ));

                                    if (res["message"] == "Post uploaded") {
                                      Navigator.pushNamed(context, "/camera");
                                      MotionToast.success(
                                        position: MOTION_TOAST_POSITION.top,
                                        animationType: ANIMATION.fromTop,
                                        toastDuration: Duration(seconds: 2),
                                        description:
                                            "Your post has been uploaded",
                                      ).show(context);
                                    } else {
                                      MotionToast.error(
                                        position: MOTION_TOAST_POSITION.top,
                                        animationType: ANIMATION.fromTop,
                                        toastDuration: Duration(seconds: 2),
                                        description: res["message"],
                                      ).show(context);
                                    }
                                  },
                                  child: Text(
                                    "Post",
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
                      SizedBox(
                        height: 20,
                      ),
                    ],
                  ),
                ),
        ),
        bottomNavigationBar: Container(
          decoration: BoxDecoration(
            boxShadow: [
              BoxShadow(
                color: textColor,
                spreadRadius: 1,
                blurRadius: 5,
                offset: Offset(0, 1), // changes position of shadow
              ),
            ],
          ),
          child: BottomNavigationBar(
            items: <BottomNavigationBarItem>[
              BottomNavigationBarItem(
                icon: Icon(Icons.home),
                label: "",
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.search),
                label: "",
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.camera),
                label: "",
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.notifications),
                label: "",
              ),
              BottomNavigationBarItem(
                icon: CircleAvatar(
                  radius: 18,
                  backgroundColor: (activeNav == 4)
                      ? Colors.deepPurpleAccent[700]
                      : textColor,
                  child: FutureBuilder<Map>(
                      future: getUser,
                      builder: (context, snapshot) {
                        if (snapshot.hasData) {
                          return CircleAvatar(
                            radius: 16,
                            backgroundImage: NetworkImage(profilePicUrl +
                                snapshot.data!["userData"]["profile_pic"]),
                          );
                        }
                        return CircleAvatar(
                          radius: 16,
                        );
                      }),
                ),
                label: "",
              ),
            ],
            currentIndex: activeNav,
            type: BottomNavigationBarType.fixed,
            selectedFontSize: 0,
            unselectedFontSize: 0,
            backgroundColor: backColor,
            iconSize: 35,
            selectedItemColor: Colors.deepPurpleAccent[700],
            unselectedItemColor: textColor,
            onTap: (int navIndex) {
              if (navIndex == 0 && activeNav != navIndex) {
                Navigator.pushNamed(context, "/home");
              } else if (navIndex == 1 && activeNav != navIndex) {
                Navigator.pushNamed(context, "/search");
              } else if (navIndex == 3 && activeNav != navIndex) {
                Navigator.pushNamed(context, "/notification");
              } else if (navIndex == 4 && activeNav != navIndex) {
                Navigator.pushNamed(context, "/profile");
              }
            },
          ),
        ),
      );
    });
  }
}
