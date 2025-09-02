import 'package:assignment/api/base_urls.dart';
import 'package:assignment/api/http/http_comment.dart';
import 'package:assignment/api/http/http_user.dart';
import 'package:assignment/screens/profile/profile_main_other.dart';
import 'package:assignment/screens/riverpod/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:motion_toast/motion_toast.dart';
import 'package:motion_toast/resources/arrays.dart';

class Commenter extends StatefulWidget {
  final String? post_id;
  final int? activeNav;
  const Commenter({Key? key, @required this.post_id, @required this.activeNav})
      : super(key: key);

  @override
  _CommenterState createState() => _CommenterState();
}

class _CommenterState extends State<Commenter> {
  final themeController =
      StateNotifierProvider<ThemeNotifier, bool>((_) => ThemeNotifier());
  int activeNav = 4;
  String profilePicUrl = BaseUrl.profilePicUrl;

  late Future<List> postCommenter;
  late Future<Map> getUser;
  String? myId;

  @override
  void initState() {
    super.initState();
    postCommenter = HttpConnectComment().getComments(widget.post_id);
    getUser = HttpConnectUser().getUser();
    getUser.then((value) => myId = value["userData"]["_id"]);
    activeNav = widget.activeNav!;
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
            "Commenter",
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
          elevation: 0,
        ),
        body: Padding(
          padding: EdgeInsets.symmetric(horizontal: _screenWidth * .03),
          child: FutureBuilder<List>(
            future: postCommenter,
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                return ListView.builder(
                  itemCount: snapshot.data!.length,
                  itemBuilder: (context, index) => ListTile(
                    contentPadding: EdgeInsets.symmetric(horizontal: 0),
                    horizontalTitleGap: 15,
                    minVerticalPadding: 20,
                    leading: CircleAvatar(
                      radius: _screenWidth > 250 ? 25 : 15,
                      backgroundImage: NetworkImage(profilePicUrl +
                          snapshot.data![index]["user_id"]["profile_pic"]),
                    ),
                    title: Text(
                      snapshot.data![index]["user_id"]["username"],
                      style: TextStyle(
                          fontSize: _screenWidth > 250 ? 20 : 10,
                          color: textColor,
                          fontFamily: "Laila-bold"),
                    ),
                    subtitle: Text(
                      snapshot.data![index]["comment"],
                      style: TextStyle(
                          fontSize: _screenWidth > 250 ? 15 : 8,
                          color: textColor,
                          fontFamily: "Laila-Regulor"),
                    ),
                    trailing: myId != snapshot.data![index]["user_id"]["_id"]
                        ? ElevatedButton(
                            onPressed: () async {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (builder) => ProfileMainOther(
                                    user_id: snapshot.data![index]["user_id"]
                                        ["_id"],
                                  ),
                                ),
                              );
                            },
                            child: Text(
                              "View Profile",
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
                          )
                        : IconButton(
                            onPressed: () async {
                              final uComment = TextEditingController();
                              final res = await HttpConnectComment()
                                  .findComment(widget.post_id);
                              uComment.text = res["commentData"]["comment"];
                              String newComment = res["commentData"]["comment"];
                              showModalBottomSheet(
                                backgroundColor: Colors.transparent,
                                context: context,
                                builder: (builder) => Container(
                                  padding: EdgeInsets.only(
                                    top: 5,
                                    left: _screenWidth * .05,
                                    right: 5,
                                  ),
                                  height: 370,
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
                                          borderRadius:
                                              BorderRadius.circular(5),
                                          color: Colors.deepPurpleAccent[700],
                                        ),
                                        height: 5,
                                        width: _screenWidth * .20,
                                      ),
                                      SizedBox(
                                        height: 5,
                                      ),
                                      Container(
                                        child: ListTile(
                                          contentPadding: EdgeInsets.symmetric(
                                            horizontal: 2,
                                          ),
                                          title: TextFormField(
                                            controller: uComment,
                                            autofocus: true,
                                            maxLines: 2,
                                            keyboardType:
                                                TextInputType.multiline,
                                            onChanged: (value) {
                                              newComment = value.trim();
                                            },
                                            style: TextStyle(
                                              color: textColor,
                                            ),
                                            decoration: InputDecoration(
                                              hintText: "Add a comment....",
                                              hintStyle: TextStyle(
                                                color: textColor,
                                              ),
                                              isDense: true,
                                              contentPadding: EdgeInsets.zero,
                                              border: InputBorder.none,
                                            ),
                                          ),
                                          trailing: IconButton(
                                            onPressed: () async {
                                              if (newComment == "") {
                                                MotionToast.error(
                                                  position:
                                                      MOTION_TOAST_POSITION.top,
                                                  animationType:
                                                      ANIMATION.fromTop,
                                                  toastDuration:
                                                      Duration(seconds: 2),
                                                  description: "Emplty field",
                                                ).show(context);
                                              } else {
                                                final res =
                                                    await HttpConnectComment()
                                                        .editComment(
                                                            widget.post_id,
                                                            newComment);
                                                Navigator.pop(context);
                                                setState(() {
                                                  postCommenter =
                                                      HttpConnectComment()
                                                          .getComments(
                                                              widget.post_id);
                                                });
                                                MotionToast.success(
                                                  position:
                                                      MOTION_TOAST_POSITION.top,
                                                  animationType:
                                                      ANIMATION.fromTop,
                                                  toastDuration:
                                                      Duration(seconds: 2),
                                                  description: res["message"],
                                                ).show(context);
                                              }
                                            },
                                            icon: Icon(
                                              Icons.send_rounded,
                                              size: 35,
                                              color:
                                                  Colors.deepPurpleAccent[700],
                                            ),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                            icon: Icon(
                              Icons.edit,
                              color: Colors.deepPurpleAccent[700],
                            ),
                          ),
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
                child: Text(
                  "No one has liked this post yet.",
                  style: TextStyle(
                    color: textColor,
                    fontSize: 15,
                  ),
                ),
              );
            },
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
              if (navIndex == 0) {
                Navigator.pushNamed(context, "/home");
              } else if (navIndex == 1) {
                Navigator.pushNamed(context, "/search");
              } else if (navIndex == 2) {
                Navigator.pushNamed(context, "/camera");
              } else if (navIndex == 3) {
                Navigator.pushNamed(context, "/notification");
              } else if (navIndex == 4) {
                Navigator.pushNamed(context, "/profile");
              }
            },
          ),
        ),
      );
    });
  }
}
