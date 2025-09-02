import 'dart:async';

import 'package:assignment/api/http/http_address.dart';
import 'package:assignment/api/http/http_post.dart';
import 'package:assignment/api/http/http_profile.dart';
import 'package:assignment/api/http/http_user.dart';
import 'package:assignment/api/http/http_watch.dart';
import 'package:assignment/api/base_urls.dart';
import 'package:assignment/screens/post/post_edit.dart';
import 'package:assignment/screens/post/post_view.dart';
import 'package:assignment/screens/riverpod/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sensors_plus/sensors_plus.dart';

class ProfileMain extends StatefulWidget {
  const ProfileMain({Key? key}) : super(key: key);

  @override
  _ProfileMainState createState() => _ProfileMainState();
}

class _ProfileMainState extends State<ProfileMain> {
  final _streamSubscriptions = <StreamSubscription<dynamic>>[];

  final themeController =
      StateNotifierProvider<ThemeNotifier, bool>((_) => ThemeNotifier());
  int activeNav = 4;
  String profileUrl = BaseUrl.profilePicUrl;
  String coverUrl = BaseUrl.coverPicUrl;
  String postUrl = BaseUrl.postUrl;

  late Future<Map> getUser;
  late Future<Map> userProfile;
  late Future<Map> userAddress;
  late Future<List> userPosts;

  String watchersNum = "0";
  String watchingNum = "0";
  String postsNum = "0";
  String taggedPostsNum = "0";
  bool postsMy = true;

  Future setUserNum() async {
    final res = await HttpConnectWatch().getUserNum();
    setState(() {
      watchersNum = res["followers"];
      watchingNum = res["followed_users"];
      postsNum = res["postsNum"];
      taggedPostsNum = res["taggedPostsNum"];
    });
  }

  @override
  void initState() {
    super.initState();
    getUser = HttpConnectUser().getUser();
    setUserNum();
    userProfile = HttpConnectProfile().getPersonalInfo();
    userAddress = HttpConnectAddress().getAddressInfo();
    userPosts = HttpConnectPost().getPosts();

    _streamSubscriptions.add(
      accelerometerEvents.listen(
        (AccelerometerEvent event) {
          setState(() {
            if (event.x > 10) {
              if (postsMy) {
                postsMy = false;
                userPosts = HttpConnectPost().getTaggedPosts();
              } else {
                postsMy = true;
                userPosts = HttpConnectPost().getPosts();
              }
            }
          });
        },
      ),
    );
  }

  @override
  void dispose() {
    super.dispose();
    for (final subscription in _streamSubscriptions) {
      subscription.cancel();
    }
  }

  @override
  Widget build(BuildContext context) {
    final _screenWidth = MediaQuery.of(context).size.width;
    return Consumer(
      builder: (context, ref, child) {
        Color backColor =
            ref.watch(themeController) ? Colors.black : Colors.white;
        Color textColor =
            ref.watch(themeController) ? Colors.white : Colors.black87;
        return Scaffold(
          backgroundColor: backColor,
          body: SafeArea(
            child: SingleChildScrollView(
              padding: EdgeInsets.symmetric(
                horizontal: _screenWidth * .025,
                vertical: _screenWidth * .025,
              ),
              child: Column(
                children: [
                  FutureBuilder<Map>(
                    future: getUser,
                    builder: (context, snapshot) {
                      if (snapshot.hasData) {
                        return Column(
                          children: [
                            Stack(
                              alignment: Alignment.bottomCenter,
                              children: [
                                CircleAvatar(
                                  radius: _screenWidth * .20,
                                  backgroundColor: Colors.deepPurpleAccent[700],
                                ),
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  crossAxisAlignment: CrossAxisAlignment.end,
                                  children: [
                                    TextButton(
                                      onPressed: () {},
                                      onLongPress: () {
                                        Navigator.pop(context);
                                        Navigator.pushNamed(
                                            context, "/watchers");
                                      },
                                      child: Column(
                                        children: [
                                          Text(
                                            watchersNum,
                                            style: TextStyle(
                                              color: textColor,
                                              fontSize:
                                                  _screenWidth > 250 ? 25 : 15,
                                              fontFamily: "Laila-Bold",
                                            ),
                                          ),
                                          Text(
                                            "Watchers",
                                            style: TextStyle(
                                              color: textColor,
                                              fontSize:
                                                  _screenWidth > 250 ? 15 : 8,
                                              fontFamily: "Laila-Bold",
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    TextButton(
                                      onPressed: () {},
                                      onLongPress: () {
                                        Navigator.pop(context);
                                        Navigator.pushNamed(
                                            context, "/watching");
                                      },
                                      child: Column(
                                        children: [
                                          Text(
                                            watchingNum,
                                            style: TextStyle(
                                              color: textColor,
                                              fontSize:
                                                  _screenWidth > 250 ? 25 : 15,
                                              fontFamily: "Laila-Bold",
                                            ),
                                          ),
                                          Text(
                                            "Watching",
                                            style: TextStyle(
                                              color: textColor,
                                              fontSize:
                                                  _screenWidth > 250 ? 15 : 8,
                                              fontFamily: "Laila-Bold",
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                                Container(
                                  padding: EdgeInsets.only(
                                    bottom: _screenWidth * .20,
                                  ),
                                  child: ClipRRect(
                                    borderRadius: BorderRadius.circular(5),
                                    child: Image(
                                      width: _screenWidth * .95,
                                      fit: BoxFit.cover,
                                      image: NetworkImage(
                                        coverUrl +
                                            snapshot.data!["userData"]
                                                ["cover_pic"],
                                      ),
                                    ),
                                  ),
                                ),
                                Container(
                                  padding: EdgeInsets.only(
                                    bottom: _screenWidth * .01,
                                  ),
                                  child: CircleAvatar(
                                    radius: _screenWidth * .19,
                                    backgroundImage: NetworkImage(
                                      profileUrl +
                                          snapshot.data!["userData"]
                                              ["profile_pic"],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            Text(
                              snapshot.data!["userData"]["username"],
                              style: TextStyle(
                                color: textColor,
                                fontSize: _screenWidth > 250 ? 20 : 10,
                                fontFamily: "Laila-Bold",
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
                      return CircleAvatar(
                        radius: 50,
                        backgroundColor: Colors.deepPurpleAccent[700],
                      );
                    },
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      ElevatedButton.icon(
                        onPressed: () {
                          showModalBottomSheet(
                            backgroundColor: Colors.transparent,
                            context: context,
                            builder: (builder) => SingleChildScrollView(
                              child: Container(
                                padding: EdgeInsets.symmetric(
                                  vertical: 5,
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
                                      offset: Offset(
                                          0, 1), // changes position of shadow
                                    ),
                                  ],
                                ),
                                child: Column(
                                  children: [
                                    Container(
                                      decoration: BoxDecoration(
                                        borderRadius: BorderRadius.circular(5),
                                        color: Colors.deepPurpleAccent[700],
                                      ),
                                      height: 5,
                                      width: _screenWidth * .20,
                                    ),
                                    Container(
                                      padding: EdgeInsets.symmetric(
                                          horizontal: _screenWidth * .01),
                                      height: 200,
                                      child: FutureBuilder<Map>(
                                        future: userProfile,
                                        builder: (context, snapshot) {
                                          if (snapshot.hasData) {
                                            return SingleChildScrollView(
                                              child: Column(
                                                children: [
                                                  SizedBox(height: 10),
                                                  Row(
                                                    mainAxisAlignment:
                                                        MainAxisAlignment
                                                            .center,
                                                    children: [
                                                      Text(
                                                        "First Name: ",
                                                        style: TextStyle(
                                                          color: textColor,
                                                          fontSize: 15,
                                                          fontFamily:
                                                              "Laila-Bold",
                                                        ),
                                                      ),
                                                      SizedBox(width: 5),
                                                      Flexible(
                                                        child: Text(
                                                          snapshot.data![
                                                                  "userProfile"]
                                                              ["first_name"],
                                                          style: TextStyle(
                                                            color: textColor,
                                                            fontSize: 15,
                                                          ),
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                  SizedBox(height: 10),
                                                  Row(
                                                    mainAxisAlignment:
                                                        MainAxisAlignment
                                                            .center,
                                                    children: [
                                                      Text(
                                                        "Last Name: ",
                                                        style: TextStyle(
                                                          color: textColor,
                                                          fontSize: 15,
                                                          fontFamily:
                                                              "Laila-Bold",
                                                        ),
                                                      ),
                                                      SizedBox(width: 5),
                                                      Flexible(
                                                        child: Text(
                                                          snapshot.data![
                                                                  "userProfile"]
                                                              ["last_name"],
                                                          style: TextStyle(
                                                            color: textColor,
                                                            fontSize: 15,
                                                          ),
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                  SizedBox(height: 10),
                                                  Row(
                                                    mainAxisAlignment:
                                                        MainAxisAlignment
                                                            .center,
                                                    children: [
                                                      Text(
                                                        "Gender: ",
                                                        style: TextStyle(
                                                          color: textColor,
                                                          fontSize: 15,
                                                          fontFamily:
                                                              "Laila-Bold",
                                                        ),
                                                      ),
                                                      SizedBox(width: 5),
                                                      Flexible(
                                                        child: Text(
                                                          snapshot.data![
                                                                  "userProfile"]
                                                              ["gender"],
                                                          style: TextStyle(
                                                            color: textColor,
                                                            fontSize: 15,
                                                          ),
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                  SizedBox(height: 10),
                                                  Row(
                                                    mainAxisAlignment:
                                                        MainAxisAlignment
                                                            .center,
                                                    children: [
                                                      Text(
                                                        "Birthday: ",
                                                        style: TextStyle(
                                                          color: textColor,
                                                          fontSize: 15,
                                                          fontFamily:
                                                              "Laila-Bold",
                                                        ),
                                                      ),
                                                      SizedBox(width: 5),
                                                      Flexible(
                                                        child: Text(
                                                          snapshot.data!["userProfile"]
                                                                      [
                                                                      "birthday"] ==
                                                                  null
                                                              ? ""
                                                              : snapshot.data![
                                                                      "userProfile"]
                                                                      [
                                                                      "birthday"]
                                                                  .split("T")
                                                                  .first,
                                                          style: TextStyle(
                                                            color: textColor,
                                                            fontSize: 15,
                                                          ),
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                  SizedBox(height: 10),
                                                  Row(
                                                    mainAxisAlignment:
                                                        MainAxisAlignment
                                                            .center,
                                                    children: [
                                                      Text(
                                                        "Biography: ",
                                                        style: TextStyle(
                                                          color: textColor,
                                                          fontSize: 15,
                                                          fontFamily:
                                                              "Laila-Bold",
                                                        ),
                                                      ),
                                                      SizedBox(width: 5),
                                                      Flexible(
                                                        child: Text(
                                                          snapshot.data![
                                                                  "userProfile"]
                                                              ["biography"],
                                                          style: TextStyle(
                                                            color: textColor,
                                                            fontSize: 15,
                                                          ),
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                ],
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
                        icon: Icon(
                          Icons.person,
                          color: Colors.white,
                        ),
                        label: Text(
                          "Profile",
                          style: TextStyle(
                            fontSize: _screenWidth > 250 ? 15 : 8,
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
                      ElevatedButton.icon(
                        onPressed: () {
                          showModalBottomSheet(
                            backgroundColor: Colors.transparent,
                            context: context,
                            builder: (builder) => SingleChildScrollView(
                              child: Container(
                                padding: EdgeInsets.symmetric(
                                  vertical: 5,
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
                                      offset: Offset(
                                          0, 1), // changes position of shadow
                                    ),
                                  ],
                                ),
                                child: Column(
                                  children: [
                                    Container(
                                      decoration: BoxDecoration(
                                        borderRadius: BorderRadius.circular(5),
                                        color: Colors.deepPurpleAccent[700],
                                      ),
                                      height: 5,
                                      width: _screenWidth * .20,
                                    ),
                                    Container(
                                      padding: EdgeInsets.symmetric(
                                          horizontal: _screenWidth * .01),
                                      height: 250,
                                      child: FutureBuilder<Map>(
                                        future: userAddress,
                                        builder: (context, snapshot) {
                                          if (snapshot.hasData) {
                                            return SingleChildScrollView(
                                              child: Column(
                                                children: [
                                                  SizedBox(height: 10),
                                                  Text(
                                                    "Permanent",
                                                    style: TextStyle(
                                                      color: textColor,
                                                      fontSize: 20,
                                                      decoration: TextDecoration
                                                          .underline,
                                                      fontFamily: "Laila-Bold",
                                                    ),
                                                  ),
                                                  SizedBox(height: 5),
                                                  Row(
                                                    mainAxisAlignment:
                                                        MainAxisAlignment
                                                            .center,
                                                    children: [
                                                      Text(
                                                        "Country: ",
                                                        style: TextStyle(
                                                          color: textColor,
                                                          fontSize: 15,
                                                          fontFamily:
                                                              "Laila-Bold",
                                                        ),
                                                      ),
                                                      SizedBox(width: 5),
                                                      Flexible(
                                                        child: Text(
                                                          snapshot.data![
                                                                      "userAddress"]
                                                                  ["permanent"]
                                                              ["country"],
                                                          style: TextStyle(
                                                            color: textColor,
                                                            fontSize: 15,
                                                          ),
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                  SizedBox(height: 10),
                                                  Row(
                                                    mainAxisAlignment:
                                                        MainAxisAlignment
                                                            .center,
                                                    children: [
                                                      Text(
                                                        "State: ",
                                                        style: TextStyle(
                                                          color: textColor,
                                                          fontSize: 15,
                                                          fontFamily:
                                                              "Laila-Bold",
                                                        ),
                                                      ),
                                                      SizedBox(width: 5),
                                                      Flexible(
                                                        child: Text(
                                                          snapshot.data![
                                                                      "userAddress"]
                                                                  ["permanent"]
                                                              ["state"],
                                                          style: TextStyle(
                                                            color: textColor,
                                                            fontSize: 15,
                                                          ),
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                  SizedBox(height: 10),
                                                  Row(
                                                    mainAxisAlignment:
                                                        MainAxisAlignment
                                                            .center,
                                                    children: [
                                                      Text(
                                                        "City: ",
                                                        style: TextStyle(
                                                          color: textColor,
                                                          fontSize: 15,
                                                          fontFamily:
                                                              "Laila-Bold",
                                                        ),
                                                      ),
                                                      SizedBox(width: 5),
                                                      Flexible(
                                                        child: Text(
                                                          snapshot.data![
                                                                  "userAddress"]
                                                              [
                                                              "permanent"]["city"],
                                                          style: TextStyle(
                                                            color: textColor,
                                                            fontSize: 15,
                                                          ),
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                  SizedBox(height: 10),
                                                  Row(
                                                    mainAxisAlignment:
                                                        MainAxisAlignment
                                                            .center,
                                                    children: [
                                                      Text(
                                                        "Street: ",
                                                        style: TextStyle(
                                                          color: textColor,
                                                          fontSize: 15,
                                                          fontFamily:
                                                              "Laila-Bold",
                                                        ),
                                                      ),
                                                      SizedBox(width: 5),
                                                      Flexible(
                                                        child: Text(
                                                          snapshot.data![
                                                                      "userAddress"]
                                                                  ["permanent"]
                                                              ["street"],
                                                          style: TextStyle(
                                                            color: textColor,
                                                            fontSize: 15,
                                                          ),
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                  SizedBox(height: 10),
                                                  Text(
                                                    "Temporary",
                                                    style: TextStyle(
                                                      color: textColor,
                                                      fontSize: 20,
                                                      decoration: TextDecoration
                                                          .underline,
                                                      fontFamily: "Laila-Bold",
                                                    ),
                                                  ),
                                                  SizedBox(height: 5),
                                                  Row(
                                                    mainAxisAlignment:
                                                        MainAxisAlignment
                                                            .center,
                                                    children: [
                                                      Text(
                                                        "Country: ",
                                                        style: TextStyle(
                                                          color: textColor,
                                                          fontSize: 15,
                                                          fontFamily:
                                                              "Laila-Bold",
                                                        ),
                                                      ),
                                                      SizedBox(width: 5),
                                                      Flexible(
                                                        child: Text(
                                                          snapshot.data![
                                                                      "userAddress"]
                                                                  ["temporary"]
                                                              ["country"],
                                                          style: TextStyle(
                                                            color: textColor,
                                                            fontSize: 15,
                                                          ),
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                  SizedBox(height: 10),
                                                  Row(
                                                    mainAxisAlignment:
                                                        MainAxisAlignment
                                                            .center,
                                                    children: [
                                                      Text(
                                                        "State: ",
                                                        style: TextStyle(
                                                          color: textColor,
                                                          fontSize: 15,
                                                          fontFamily:
                                                              "Laila-Bold",
                                                        ),
                                                      ),
                                                      SizedBox(width: 5),
                                                      Flexible(
                                                        child: Text(
                                                          snapshot.data![
                                                                      "userAddress"]
                                                                  ["temporary"]
                                                              ["state"],
                                                          style: TextStyle(
                                                            color: textColor,
                                                            fontSize: 15,
                                                          ),
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                  SizedBox(height: 10),
                                                  Row(
                                                    mainAxisAlignment:
                                                        MainAxisAlignment
                                                            .center,
                                                    children: [
                                                      Text(
                                                        "City: ",
                                                        style: TextStyle(
                                                          color: textColor,
                                                          fontSize: 15,
                                                          fontFamily:
                                                              "Laila-Bold",
                                                        ),
                                                      ),
                                                      SizedBox(width: 5),
                                                      Flexible(
                                                        child: Text(
                                                          snapshot.data![
                                                                  "userAddress"]
                                                              [
                                                              "temporary"]["city"],
                                                          style: TextStyle(
                                                            color: textColor,
                                                            fontSize: 15,
                                                          ),
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                  SizedBox(height: 10),
                                                  Row(
                                                    mainAxisAlignment:
                                                        MainAxisAlignment
                                                            .center,
                                                    children: [
                                                      Text(
                                                        "Street: ",
                                                        style: TextStyle(
                                                          color: textColor,
                                                          fontSize: 15,
                                                          fontFamily:
                                                              "Laila-Bold",
                                                        ),
                                                      ),
                                                      SizedBox(width: 5),
                                                      Flexible(
                                                        child: Text(
                                                          snapshot.data![
                                                                      "userAddress"]
                                                                  ["temporary"]
                                                              ["street"],
                                                          style: TextStyle(
                                                            color: textColor,
                                                            fontSize: 15,
                                                          ),
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                ],
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
                        icon: Icon(
                          Icons.location_on_sharp,
                          color: Colors.white,
                        ),
                        label: Text(
                          "Address",
                          style: TextStyle(
                            fontSize: _screenWidth > 250 ? 15 : 8,
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
                  SizedBox(
                    height: 20,
                  ),
                  Container(
                    decoration: BoxDecoration(
                      color: backColor,
                      border: Border(
                        top: BorderSide(
                          color: textColor,
                          width: 3,
                        ),
                        bottom: BorderSide(
                          color: textColor,
                          width: 3,
                        ),
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        IconButton(
                          padding: EdgeInsets.zero,
                          onPressed: () {
                            setState(() {
                              postsMy = true;
                              userPosts = HttpConnectPost().getPosts();
                            });
                          },
                          icon: Icon(
                            Icons.grid_view_sharp,
                            size: 40,
                            color: postsMy
                                ? Colors.deepPurpleAccent[700]
                                : textColor,
                          ),
                        ),
                        Text(
                          postsMy ? postsNum : taggedPostsNum,
                          style: TextStyle(
                            color: textColor,
                            fontSize: 25,
                            fontFamily: "Laila-Bold",
                          ),
                        ),
                        IconButton(
                          padding: EdgeInsets.zero,
                          onPressed: () {
                            setState(() {
                              postsMy = false;
                              userPosts = HttpConnectPost().getTaggedPosts();
                            });
                          },
                          icon: Icon(
                            Icons.person_add_alt_sharp,
                            size: 40,
                            color: postsMy
                                ? textColor
                                : Colors.deepPurpleAccent[700],
                          ),
                        ),
                      ],
                    ),
                  ),
                  SizedBox(
                    height: 10,
                  ),
                  SingleChildScrollView(
                    child: Container(
                      height: 520,
                      child: FutureBuilder<List>(
                        future: userPosts,
                        builder: (context, snapshot) {
                          if (snapshot.hasData) {
                            return GridView.count(
                              crossAxisCount: 3,
                              children:
                                  List.generate(snapshot.data!.length, (index) {
                                return Container(
                                  padding: EdgeInsets.all(5),
                                  child: TextButton(
                                    onPressed: () {
                                      if (!postsMy) {
                                        Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                            builder: (builder) => PostView(
                                                post_id: snapshot.data![index]
                                                    ["_id"],
                                                activeNav: 4),
                                          ),
                                        );
                                        return;
                                      }
                                      showModalBottomSheet(
                                        backgroundColor: Colors.transparent,
                                        context: context,
                                        builder: (builder) =>
                                            SingleChildScrollView(
                                          child: Container(
                                            padding: EdgeInsets.only(
                                              top: 5,
                                              left: _screenWidth * .05,
                                              right: 5,
                                            ),
                                            height: 160,
                                            decoration: BoxDecoration(
                                              color: backColor,
                                              borderRadius:
                                                  new BorderRadius.only(
                                                topLeft:
                                                    const Radius.circular(25.0),
                                                topRight:
                                                    const Radius.circular(25.0),
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
                                            child: Padding(
                                              padding: EdgeInsets.symmetric(
                                                horizontal: _screenWidth * .25,
                                              ),
                                              child: Column(
                                                children: [
                                                  Container(
                                                    decoration: BoxDecoration(
                                                      borderRadius:
                                                          BorderRadius.circular(
                                                              5),
                                                      color: Colors
                                                              .deepPurpleAccent[
                                                          700],
                                                    ),
                                                    height: 5,
                                                    width: _screenWidth * .20,
                                                  ),
                                                  SizedBox(
                                                    height: 5,
                                                  ),
                                                  TextButton(
                                                    onPressed: () {
                                                      Navigator.pop(context);
                                                      Navigator.push(
                                                        context,
                                                        MaterialPageRoute(
                                                          builder: (builder) =>
                                                              PostView(
                                                                  post_id: snapshot
                                                                          .data![
                                                                      index]["_id"],
                                                                  activeNav: 4),
                                                        ),
                                                      );
                                                    },
                                                    child: Text(
                                                      "View Post",
                                                      style: TextStyle(
                                                        color: Colors
                                                                .deepPurpleAccent[
                                                            700],
                                                        fontFamily:
                                                            "Laila-Bold",
                                                        fontSize: 20,
                                                      ),
                                                    ),
                                                  ),
                                                  TextButton(
                                                    onPressed: () {
                                                      Navigator.pop(context);
                                                      Navigator.push(
                                                        context,
                                                        MaterialPageRoute(
                                                          builder: (builder) =>
                                                              PostEdit(
                                                            post_id: snapshot
                                                                    .data![
                                                                index]["_id"],
                                                          ),
                                                        ),
                                                      );
                                                    },
                                                    child: Text(
                                                      "Edit Post",
                                                      style: TextStyle(
                                                        color: Colors
                                                                .deepPurpleAccent[
                                                            700],
                                                        fontFamily:
                                                            "Laila-Bold",
                                                        fontSize: 20,
                                                      ),
                                                    ),
                                                  ),
                                                  TextButton(
                                                    onPressed: () async {
                                                      await HttpConnectPost()
                                                          .deletePost(snapshot
                                                                  .data![index]
                                                              ["_id"]);
                                                      Navigator.pop(context);
                                                      setState(() {
                                                        userPosts =
                                                            HttpConnectPost()
                                                                .getPosts();
                                                      });
                                                    },
                                                    child: Text(
                                                      "Delete Post",
                                                      style: TextStyle(
                                                        color: Colors.red[700],
                                                        fontFamily:
                                                            "Laila-Bold",
                                                        fontSize: 20,
                                                      ),
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ),
                                        ),
                                      );
                                    },
                                    style: TextButton.styleFrom(
                                        padding: EdgeInsets.zero),
                                    child: ClipRRect(
                                      child: Image(
                                        height: _screenWidth * .30,
                                        width: _screenWidth * .30,
                                        fit: BoxFit.cover,
                                        image: NetworkImage(postUrl +
                                            snapshot.data![index]["attach_file"]
                                                [0]),
                                      ),
                                    ),
                                  ),
                                );
                              }),
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
                            child: Text(
                              "No posts yet.",
                              style: TextStyle(
                                color: textColor,
                                fontSize: 15,
                              ),
                            ),
                          );
                        },
                      ),
                    ),
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
                              backgroundImage: NetworkImage(profileUrl +
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
                } else if (navIndex == 2 && activeNav != navIndex) {
                  Navigator.pushNamed(context, "/camera");
                } else if (navIndex == 3 && activeNav != navIndex) {
                  Navigator.pushNamed(context, "/notification");
                } 
              },
            ),
          ),
        );
      },
    );
  }
}
