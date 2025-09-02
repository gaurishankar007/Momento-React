import 'package:assignment/api/base_urls.dart';
import 'package:assignment/api/http/http_comment.dart';
import 'package:assignment/api/http/http_like.dart';
import 'package:assignment/api/http/http_post.dart';
import 'package:assignment/api/http/http_user.dart';
import 'package:assignment/api/response/response_post.dart';
import 'package:assignment/screens/post/comment.dart';
import 'package:assignment/screens/post/like.dart';
import 'package:assignment/screens/riverpod/theme.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:motion_toast/motion_toast.dart';
import 'package:motion_toast/resources/arrays.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

class PostView extends StatefulWidget {
  final String? post_id;
  final int? activeNav;
  const PostView({Key? key, @required this.post_id, @required this.activeNav})
      : super(key: key);

  @override
  _PostViewState createState() => _PostViewState();
}

class _PostViewState extends State<PostView> {
  final themeController =
      StateNotifierProvider<ThemeNotifier, bool>((_) => ThemeNotifier());
  int activeNav = 4;

  late Future<GetPost> userPost;
  late Future<Map> userPostLC;
  late Future<Map> getUser;
  int totalImages = 0;
  int activatedIndex = 0;

  String postUrl = BaseUrl.postUrl;
  String profilePicUrl = BaseUrl.profilePicUrl;

  Future<Map> getComment(String post_id) async {
    final res = await HttpConnectComment().findComment(post_id);
    return res;
  }

  @override
  void initState() {
    super.initState();
    activeNav = widget.activeNav!;
    userPost = HttpConnectPost().getSinglePost(widget.post_id);
    userPostLC = HttpConnectPost().getSinglePostLC(widget.post_id);
    getUser = HttpConnectUser().getUser();
    userPost.then((value) {
      setState(() {
        totalImages = value.attach_file!.length;
      });
    });
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
            "Post",
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
        body: SingleChildScrollView(
          child: Column(
            children: [
              SizedBox(
                height: 5,
              ),
              FutureBuilder<GetPost>(
                future: userPost,
                builder: (context, snapshot) {
                  if (snapshot.hasData) {
                    return Container(
                      color: backColor,
                      child: Column(
                        children: [
                          ListTile(
                            minVerticalPadding: 0,
                            contentPadding: EdgeInsets.symmetric(
                              vertical: 0,
                              horizontal: _screenWidth * .01,
                            ),
                            leading: CircleAvatar(
                              radius: 20,
                              backgroundImage: NetworkImage(profilePicUrl +
                                  snapshot.data!.user_id!["profile_pic"]!),
                            ),
                            title: Text(
                              snapshot.data!.user_id!["username"]!,
                              style: TextStyle(
                                color: textColor,
                                fontFamily: "Laila-Bold",
                              ),
                            ),
                          ),
                          CarouselSlider(
                            items: snapshot.data!.attach_file!.map((i) {
                              return Builder(builder: (BuildContext context) {
                                return Image(
                                  width: _screenWidth,
                                  image: NetworkImage(postUrl + i),
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
                            count: totalImages,
                            effect: WormEffect(
                              dotColor: textColor,
                              activeDotColor: Colors.deepPurpleAccent,
                              dotHeight: 9,
                              dotWidth: 9,
                            ),
                          ),
                          Padding(
                            padding: EdgeInsets.symmetric(
                                horizontal: _screenWidth * .01),
                            child: Column(
                              children: [
                                Container(
                                  height: 40,
                                  child: Row(
                                    children: [
                                      IconButton(
                                        padding: EdgeInsets.all(0),
                                        constraints:
                                            BoxConstraints(minWidth: 20),
                                        onPressed: () async {
                                          await HttpConnectLike()
                                              .likePost(snapshot.data!.id);
                                          setState(() {
                                            userPost = HttpConnectPost()
                                                .getSinglePost(widget.post_id);
                                            userPostLC = HttpConnectPost()
                                                .getSinglePostLC(
                                                    widget.post_id);
                                          });
                                        },
                                        icon: FutureBuilder<Map>(
                                            future: userPostLC,
                                            builder: (context, snapshot1) {
                                              if (snapshot1.hasData) {
                                                return Icon(
                                                  Icons.favorite,
                                                  color: snapshot1
                                                          .data!["liked"]
                                                      ? Colors
                                                          .deepPurpleAccent[700]
                                                      : textColor,
                                                );
                                              }
                                              return Center(
                                                  child:
                                                      CircularProgressIndicator(
                                                color: Colors
                                                    .deepPurpleAccent[700],
                                              ));
                                            }),
                                      ),
                                      SizedBox(
                                        width: 5,
                                      ),
                                      TextButton(
                                        onPressed: () {
                                          Navigator.push(
                                            context,
                                            MaterialPageRoute(
                                              builder: (builder) => Liker(
                                                  post_id: snapshot.data!.id,
                                                  activeNav: 4),
                                            ),
                                          );
                                        },
                                        child: Text(
                                          "${snapshot.data!.like_num.toString()} liker,",
                                          style: TextStyle(
                                            color: textColor,
                                            fontFamily: "Laila-Bold",
                                          ),
                                        ),
                                        style: TextButton.styleFrom(
                                          padding: EdgeInsets.zero,
                                        ),
                                      ),
                                      SizedBox(
                                        width: 5,
                                      ),
                                      TextButton(
                                        onPressed: () {
                                          Navigator.push(
                                            context,
                                            MaterialPageRoute(
                                              builder: (builder) => Commenter(
                                                  post_id: snapshot.data!.id,
                                                  activeNav: 4),
                                            ),
                                          );
                                        },
                                        child: Text(
                                          "${snapshot.data!.comment_num.toString()} commenter",
                                          style: TextStyle(
                                            color: textColor,
                                            fontFamily: "Laila-Bold",
                                          ),
                                        ),
                                        style: TextButton.styleFrom(
                                          padding: EdgeInsets.zero,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                Container(
                                  alignment: Alignment.topLeft,
                                  padding: EdgeInsets.symmetric(horizontal: _screenWidth*.01),
                                  child: RichText(
                                    text: TextSpan(
                                        text: "${snapshot.data!.caption} ",
                                        style: TextStyle(
                                          color: textColor,
                                          fontFamily: "Laila-Bold",
                                        ),
                                        children: [
                                          TextSpan(
                                            text:
                                                " ${snapshot.data!.description}",
                                            style: TextStyle(
                                              color: textColor,
                                              fontFamily: "Laila-Regular",
                                            ),
                                          )
                                        ]),
                                  ),
                                ),
                                FutureBuilder<Map>(
                                    future: userPostLC,
                                    builder: (context, snapshot1) {
                                      if (snapshot1.hasData) {
                                        return !snapshot1.data!["commented"]
                                            ? ListTile(
                                                contentPadding:
                                                    EdgeInsets.symmetric(
                                                  horizontal: 0,
                                                  vertical: 0,
                                                ),
                                                onTap: () {
                                                  String comment = "";

                                                  showModalBottomSheet(
                                                    isScrollControlled: true,
                                                    backgroundColor:
                                                        Colors.transparent,
                                                    context: context,
                                                    builder: (builder) =>
                                                        Container(
                                                      padding: EdgeInsets.only(
                                                        top: 5,
                                                        left:
                                                            _screenWidth * .05,
                                                        right: 5,
                                                      ),
                                                      decoration: BoxDecoration(
                                                        color: backColor,
                                                        borderRadius:
                                                            new BorderRadius
                                                                .only(
                                                          topLeft: const Radius
                                                              .circular(25.0),
                                                          topRight: const Radius
                                                              .circular(25.0),
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
                                                      height: 360,
                                                      child: ListTile(
                                                        title: TextFormField(
                                                          autofocus: true,
                                                          maxLines: 2,
                                                          keyboardType:
                                                              TextInputType
                                                                  .multiline,
                                                          onChanged: (value) {
                                                            comment =
                                                                value.trim();
                                                          },
                                                          style: TextStyle(
                                                            color: textColor,
                                                          ),
                                                          decoration:
                                                              InputDecoration(
                                                            hintText:
                                                                "   Add a comment....",
                                                            hintStyle:
                                                                TextStyle(
                                                              color: textColor,
                                                            ),
                                                            isDense: true,
                                                            contentPadding:
                                                                EdgeInsets.zero,
                                                            border: InputBorder
                                                                .none,
                                                          ),
                                                        ),
                                                        trailing: IconButton(
                                                          onPressed: () async {
                                                            if (comment == "") {
                                                              MotionToast.error(
                                                                position:
                                                                    MOTION_TOAST_POSITION
                                                                        .top,
                                                                animationType:
                                                                    ANIMATION
                                                                        .fromTop,
                                                                toastDuration:
                                                                    Duration(
                                                                        seconds:
                                                                            2),
                                                                description:
                                                                    "Emplty field",
                                                              ).show(context);
                                                            } else {
                                                              await HttpConnectComment()
                                                                  .postComment(
                                                                      snapshot
                                                                          .data!
                                                                          .id,
                                                                      comment);
                                                              Navigator.pop(
                                                                  context);
                                                              setState(() {
                                                                userPost = HttpConnectPost()
                                                                    .getSinglePost(
                                                                        widget
                                                                            .post_id);
                                                                userPostLC = HttpConnectPost()
                                                                    .getSinglePostLC(
                                                                        widget
                                                                            .post_id);
                                                              });
                                                            }
                                                          },
                                                          icon: Icon(
                                                            Icons.send_rounded,
                                                            size: 35,
                                                            color: Colors
                                                                    .deepPurpleAccent[
                                                                700],
                                                          ),
                                                        ),
                                                      ),
                                                    ),
                                                  );
                                                },
                                                leading: FutureBuilder<Map>(
                                                    future: getUser,
                                                    builder:
                                                        (context, snapshot1) {
                                                      if (snapshot1.hasData) {
                                                        return CircleAvatar(
                                                          radius: 15,
                                                          backgroundImage: NetworkImage(
                                                              profilePicUrl +
                                                                  snapshot1.data![
                                                                          "userData"]
                                                                      [
                                                                      "profile_pic"]),
                                                        );
                                                      }
                                                      return CircleAvatar(
                                                        radius: 18,
                                                      );
                                                    }),
                                                title: Text(
                                                  "Comment on this post.....",
                                                  style: TextStyle(
                                                    color: textColor,
                                                  ),
                                                ),
                                              )
                                            : FutureBuilder<Map>(
                                                future: getComment(
                                                    snapshot.data!.id!),
                                                builder: (context, snapshot1) {
                                                  if (snapshot1.hasData) {
                                                    return ListTile(
                                                      leading:
                                                          FutureBuilder<Map>(
                                                              future: getUser,
                                                              builder: (context,
                                                                  snapshot2) {
                                                                if (snapshot2
                                                                    .hasData) {
                                                                  return CircleAvatar(
                                                                    radius: 15,
                                                                    backgroundImage:
                                                                        NetworkImage(profilePicUrl +
                                                                            snapshot2.data!["userData"]["profile_pic"]),
                                                                  );
                                                                }
                                                                return CircleAvatar(
                                                                  radius: 18,
                                                                );
                                                              }),
                                                      title: Text(
                                                        snapshot1.data![
                                                                "commentData"]
                                                            ["comment"],
                                                        style: TextStyle(
                                                          color: textColor,
                                                        ),
                                                      ),
                                                      trailing: IconButton(
                                                        onPressed: () async {
                                                          final res =
                                                              await HttpConnectComment()
                                                                  .deleteComment(
                                                                      widget
                                                                          .post_id);
                                                          setState(() {
                                                            userPost = HttpConnectPost()
                                                                .getSinglePost(
                                                                    widget
                                                                        .post_id);
                                                            userPostLC =
                                                                HttpConnectPost()
                                                                    .getSinglePostLC(
                                                                        widget
                                                                            .post_id);
                                                          });
                                                          MotionToast.success(
                                                            position:
                                                                MOTION_TOAST_POSITION
                                                                    .top,
                                                            animationType:
                                                                ANIMATION
                                                                    .fromTop,
                                                            toastDuration:
                                                                Duration(
                                                                    seconds: 2),
                                                            description:
                                                                res["message"],
                                                          ).show(context);
                                                        },
                                                        icon: Icon(
                                                          Icons.delete,
                                                          size: 20,
                                                          color: Colors.red,
                                                        ),
                                                      ),
                                                    );
                                                  }
                                                  return Center(
                                                      child:
                                                          CircularProgressIndicator(
                                                    color: Colors
                                                        .deepPurpleAccent[700],
                                                  ));
                                                },
                                              );
                                      }
                                      return Center(
                                          child: CircularProgressIndicator(
                                        color: Colors.deepPurpleAccent[700],
                                      ));
                                    }),
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
                                Container(
                                  height: 150,
                                  child: ListView.builder(
                                    itemCount:
                                        snapshot.data!.tag_friend!.length,
                                    itemBuilder: (context, index) => ListTile(
                                      contentPadding: EdgeInsets.zero,
                                      minVerticalPadding: 1,
                                      leading: CircleAvatar(
                                        radius: 20,
                                        backgroundImage: NetworkImage(
                                            profilePicUrl +
                                                snapshot.data!
                                                        .tag_friend![index]
                                                    ["profile_pic"]!),
                                      ),
                                      title: Text(
                                        snapshot.data!.tag_friend![index]
                                            ["username"]!,
                                        style: TextStyle(
                                            fontSize: 15,
                                            color: textColor,
                                            fontFamily: "Laila-bold"),
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          )
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
                      child: CircularProgressIndicator(
                    color: Colors.deepPurpleAccent[700],
                  ));
                },
              ),
              SizedBox(
                height: 20,
              ),
            ],
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
