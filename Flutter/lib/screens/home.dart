import 'package:assignment/api/base_urls.dart';
import 'package:assignment/api/http/http_comment.dart';
import 'package:assignment/api/http/http_like.dart';
import 'package:assignment/api/http/http_post.dart';
import 'package:assignment/api/http/http_user.dart';
import 'package:assignment/api/response/response_f_post.dart';
import 'package:assignment/api/token.dart';
import 'package:assignment/floor/database/database_instance.dart';
import 'package:assignment/floor/entity/offline_posts.dart';
import 'package:assignment/screens/post/comment.dart';
import 'package:assignment/screens/post/like.dart';
import 'package:assignment/screens/profile/profile_main_other.dart';
import 'package:assignment/screens/report.dart';
import 'package:assignment/screens/riverpod/theme.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:motion_toast/motion_toast.dart';
import 'package:motion_toast/resources/arrays.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

class Home extends StatefulWidget {
  const Home({Key? key}) : super(key: key);

  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  final themeController =
      StateNotifierProvider<ThemeNotifier, bool>((_) => ThemeNotifier());
  int activeNav = 0;

  late Future<GetFollowedPosts> followedPosts;
  late Future<Map> getUser;

  String postUrl = BaseUrl.postUrl;
  String profilePicUrl = BaseUrl.profilePicUrl;

  List activeIndexField = [];

  Future<List<OfflinePost>> getOfflinePosts() async {
    final database = await DatabaseInstance.instance.getDatabaseInstance();
    final response = database.offlinePostDao.getPosts();
    return response;
  }

  Future<Map> getComment(String post_id) async {
    final res = await HttpConnectComment().findComment(post_id);
    return res;
  }

  @override
  void initState() {
    super.initState();
    Token().getToken().then((value) {
      if (value.isEmpty) {
        Navigator.of(context)
            .pushNamedAndRemoveUntil('/login', (Route<dynamic> route) => false);
      }
    });

    followedPosts = HttpConnectPost().getFollowedPost();
    getUser = HttpConnectUser().getUser();
    followedPosts.then((value) {
      setState(() {
        for (int i = 0; i < value.followedPosts.length; i++) {
          activeIndexField.add(0);
        }
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
          automaticallyImplyLeading: false,
          backgroundColor: backColor,
          title: Text(
            "WatchMe",
            style: TextStyle(
              color: textColor,
              fontSize: 20,
              fontFamily: "BerkshireSwash-Regular",
            ),
          ),
          actions: [
            IconButton(
              onPressed: () {
                Navigator.pushNamed(context, "/setting");
              },
              icon: Icon(
                Icons.settings,
                size: 25,
                color: textColor,
              ),
            )
          ],
          shape: Border(
            bottom: BorderSide(
              color: textColor,
              width: .1,
            ),
          ),
          elevation: 0,
        ),
        body: FutureBuilder<GetFollowedPosts>(
            future: followedPosts,
            builder: (context, snapshot) {
              if (snapshot.hasData == false) {
                return FutureBuilder<List<OfflinePost>>(
                  future: getOfflinePosts(),
                  builder: (context, snapshot1) {
                    if (snapshot1.hasData) {
                      return ListView.builder(
                        itemCount: snapshot1.data!.length,
                        itemBuilder: (context, index) {
                          return Container(
                            child: Column(
                              children: [
                                Padding(
                                  padding: EdgeInsets.symmetric(horizontal: 10),
                                  child: ListTile(
                                    contentPadding: EdgeInsets.symmetric(
                                      horizontal: 0,
                                      vertical: 0,
                                    ),
                                    leading: CircleAvatar(
                                      radius: 20,
                                    ),
                                    title: Text(
                                      snapshot1.data![index].postUser,
                                      style: TextStyle(
                                        color: textColor,
                                        fontFamily: "Laila-Bold",
                                      ),
                                    ),
                                    trailing: IconButton(
                                      onPressed: () {},
                                      icon: Icon(
                                        Icons.more_vert,
                                        color: textColor,
                                      ),
                                    ),
                                  ),
                                ),
                                CarouselSlider(
                                  items: [1].map((i) {
                                    return Builder(
                                        builder: (BuildContext context) {
                                      return Container(
                                        width: _screenWidth,
                                        height: 350,
                                        color: Colors.blue[800],
                                      );
                                    });
                                  }).toList(),
                                  options: CarouselOptions(
                                    initialPage: 0,
                                    viewportFraction: 1,
                                    enableInfiniteScroll: false,
                                  ),
                                ),
                                SizedBox(
                                  height: 5,
                                ),
                                AnimatedSmoothIndicator(
                                  activeIndex: 0,
                                  count: 1,
                                  effect: WormEffect(
                                    dotColor: textColor,
                                    activeDotColor: Colors.deepPurpleAccent,
                                    dotHeight: 9,
                                    dotWidth: 9,
                                  ),
                                ),
                                SizedBox(
                                  height: 5,
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
                                              onPressed: () {},
                                              icon: Icon(
                                                Icons.favorite,
                                                color: snapshot1
                                                        .data![index].liked
                                                    ? Colors
                                                        .deepPurpleAccent[700]
                                                    : textColor,
                                              ),
                                            ),
                                            SizedBox(
                                              width: 5,
                                            ),
                                            TextButton(
                                              onPressed: () {},
                                              child: Text(
                                                "${snapshot1.data![index].liker} liker,",
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
                                              onPressed: () {},
                                              child: Text(
                                                "${snapshot1.data![index].commenter} commenter",
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
                                        padding: EdgeInsets.symmetric(
                                            horizontal: _screenWidth * .01),
                                        child: RichText(
                                          text: TextSpan(
                                            text:
                                                "${snapshot1.data![index].caption} ",
                                            style: TextStyle(
                                              color: textColor,
                                              fontFamily: "Laila-Bold",
                                            ),
                                            children: [
                                              TextSpan(
                                                text:
                                                    " ${snapshot1.data![index].description}",
                                                style: TextStyle(
                                                  color: textColor,
                                                  fontFamily: "Laila-Regular",
                                                ),
                                              )
                                            ],
                                          ),
                                        ),
                                      ),
                                      snapshot1.data![index].commented
                                          ? ListTile(
                                              leading: CircleAvatar(
                                                radius: 15,
                                              ),
                                              title: Text(
                                                snapshot1.data![index].comment,
                                                style: TextStyle(
                                                  color: textColor,
                                                ),
                                              ),
                                              trailing: IconButton(
                                                onPressed: () {},
                                                icon: Icon(
                                                  Icons.delete,
                                                  size: 20,
                                                  color: Colors.red,
                                                ),
                                              ),
                                            )
                                          : ListTile(
                                              contentPadding:
                                                  EdgeInsets.symmetric(
                                                horizontal: 0,
                                                vertical: 0,
                                              ),
                                              onTap: () {},
                                              leading: CircleAvatar(
                                                radius: 15,
                                              ),
                                              title: Text(
                                                "Comment on this post.....",
                                                style: TextStyle(
                                                  color: textColor,
                                                ),
                                              ),
                                            ),
                                    ],
                                  ),
                                )
                              ],
                            ),
                          );
                        },
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
                );
              }
              if (snapshot.hasData) {
                return ListView.builder(
                  itemCount: snapshot.data!.followedPosts.length,
                  itemBuilder: (context, index) {
                    return Container(
                      child: Column(
                        children: [
                          Padding(
                            padding: EdgeInsets.symmetric(horizontal: 10),
                            child: ListTile(
                              contentPadding: EdgeInsets.symmetric(
                                horizontal: 0,
                                vertical: 0,
                              ),
                              onLongPress: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (builder) => ProfileMainOther(
                                      user_id: snapshot.data!
                                          .followedPosts[index].user_id!["_id"],
                                    ),
                                  ),
                                );
                              },
                              leading: CircleAvatar(
                                radius: 20,
                                backgroundImage: NetworkImage(profilePicUrl +
                                    snapshot.data!.followedPosts[index]
                                        .user_id!["profile_pic"]!),
                              ),
                              title: Text(
                                snapshot.data!.followedPosts[index]
                                    .user_id!["username"]!,
                                style: TextStyle(
                                  color: textColor,
                                  fontFamily: "Laila-Bold",
                                ),
                              ),
                              trailing: IconButton(
                                onPressed: () {
                                  showModalBottomSheet(
                                    context: context,
                                    backgroundColor: Colors.transparent,
                                    builder: (builder) => Container(
                                      padding: EdgeInsets.symmetric(
                                        vertical: 5,
                                        horizontal: _screenWidth * .20,
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
                                      height: 115,
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
                                          TextButton(
                                            onPressed: () {
                                              Navigator.pop(context);
                                              showModalBottomSheet(
                                                backgroundColor:
                                                    Colors.transparent,
                                                context: context,
                                                builder: (builder) =>
                                                    SingleChildScrollView(
                                                  child: Container(
                                                    padding: EdgeInsets.only(
                                                      top: 5,
                                                      left: _screenWidth * .05,
                                                      right: 5,
                                                    ),
                                                    decoration: BoxDecoration(
                                                      color: backColor,
                                                      borderRadius:
                                                          new BorderRadius.only(
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
                                                    child: Column(
                                                      children: [
                                                        Container(
                                                          decoration:
                                                              BoxDecoration(
                                                            borderRadius:
                                                                BorderRadius
                                                                    .circular(
                                                                        5),
                                                            color: Colors
                                                                    .deepPurpleAccent[
                                                                700],
                                                          ),
                                                          height: 5,
                                                          width: _screenWidth *
                                                              .20,
                                                        ),
                                                        Container(
                                                          height: 200,
                                                          child:
                                                              ListView.builder(
                                                            itemCount: snapshot
                                                                .data!
                                                                .followedPosts[
                                                                    index]
                                                                .tag_friend!
                                                                .length,
                                                            itemBuilder: (context,
                                                                    index1) =>
                                                                ListTile(
                                                              contentPadding:
                                                                  EdgeInsets
                                                                      .zero,
                                                              minVerticalPadding:
                                                                  1,
                                                              leading:
                                                                  CircleAvatar(
                                                                radius: 25,
                                                                backgroundImage: NetworkImage(profilePicUrl +
                                                                    snapshot
                                                                        .data!
                                                                        .followedPosts[
                                                                            index]
                                                                        .tag_friend![index1]["profile_pic"]!),
                                                              ),
                                                              title: Text(
                                                                snapshot
                                                                        .data!
                                                                        .followedPosts[
                                                                            index]
                                                                        .tag_friend![index1]
                                                                    [
                                                                    "username"]!,
                                                                style: TextStyle(
                                                                    fontSize:
                                                                        20,
                                                                    color:
                                                                        textColor,
                                                                    fontFamily:
                                                                        "Laila-Bold"),
                                                              ),
                                                            ),
                                                          ),
                                                        ),
                                                      ],
                                                    ),
                                                  ),
                                                ),
                                              );
                                            },
                                            child: Text(
                                              "View tagged friends",
                                              style: TextStyle(
                                                color: Colors
                                                    .deepPurpleAccent[700],
                                                fontFamily: "Laila-Bold",
                                                fontSize: _screenWidth > 250
                                                    ? 20
                                                    : 10,
                                              ),
                                            ),
                                          ),
                                          TextButton(
                                            style: TextButton.styleFrom(
                                              padding: EdgeInsets.zero,
                                            ),
                                            onPressed: () {
                                              Navigator.pop(context);
                                              Navigator.push(
                                                context,
                                                MaterialPageRoute(
                                                  builder: (builder) => Report(
                                                      post_id: snapshot
                                                          .data!
                                                          .followedPosts[index]
                                                          .id),
                                                ),
                                              );
                                            },
                                            child: Text(
                                              "Report",
                                              style: TextStyle(
                                                color: Colors.deepOrange,
                                                fontFamily: "Laila-Bold",
                                                fontSize: _screenWidth > 250
                                                    ? 20
                                                    : 10,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  );
                                },
                                icon: Icon(
                                  Icons.more_vert,
                                  color: textColor,
                                ),
                              ),
                            ),
                          ),
                          CarouselSlider(
                            items: snapshot
                                .data!.followedPosts[index].attach_file!
                                .map((i) {
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
                                  activeIndexField[index] = indexCar;
                                });
                              }),
                            ),
                          ),
                          SizedBox(
                            height: 5,
                          ),
                          AnimatedSmoothIndicator(
                            activeIndex: activeIndexField[index],
                            count: snapshot
                                .data!.followedPosts[index].attach_file!.length,
                            effect: WormEffect(
                              dotColor: textColor,
                              activeDotColor: Colors.deepPurpleAccent,
                              dotHeight: 9,
                              dotWidth: 9,
                            ),
                          ),
                          SizedBox(
                            height: 5,
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
                                          await HttpConnectLike().likePost(
                                              snapshot.data!
                                                  .followedPosts[index].id);
                                          setState(() {
                                            followedPosts = HttpConnectPost()
                                                .getFollowedPost();
                                          });
                                        },
                                        icon: Icon(
                                          Icons.favorite,
                                          color: snapshot.data!.liked[index]
                                              ? Colors.deepPurpleAccent[700]
                                              : textColor,
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
                                              builder: (builder) => Liker(
                                                  post_id: snapshot.data!
                                                      .followedPosts[index].id,
                                                  activeNav: 0),
                                            ),
                                          );
                                        },
                                        child: Text(
                                          "${snapshot.data!.followedPosts[index].like_num.toString()} liker,",
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
                                                  post_id: snapshot.data!
                                                      .followedPosts[index].id,
                                                  activeNav: 0),
                                            ),
                                          );
                                        },
                                        child: Text(
                                          "${snapshot.data!.followedPosts[index].comment_num.toString()} commenter",
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
                                  padding: EdgeInsets.symmetric(
                                      horizontal: _screenWidth * .01),
                                  child: RichText(
                                    text: TextSpan(
                                        text:
                                            "${snapshot.data!.followedPosts[index].caption} ",
                                        style: TextStyle(
                                          color: textColor,
                                          fontFamily: "Laila-Bold",
                                        ),
                                        children: [
                                          TextSpan(
                                            text:
                                                " ${snapshot.data!.followedPosts[index].description}",
                                            style: TextStyle(
                                              color: textColor,
                                              fontFamily: "Laila-Regular",
                                            ),
                                          )
                                        ]),
                                  ),
                                ),
                                !snapshot.data!.commented[index]
                                    ? ListTile(
                                        contentPadding: EdgeInsets.symmetric(
                                          horizontal: 0,
                                          vertical: 0,
                                        ),
                                        onTap: () {
                                          String comment = "";

                                          showModalBottomSheet(
                                            isScrollControlled: true,
                                            backgroundColor: Colors.transparent,
                                            context: context,
                                            builder: (builder) => Container(
                                              padding: EdgeInsets.only(
                                                top: 5,
                                                left: _screenWidth * .05,
                                                right: 5,
                                              ),
                                              decoration: BoxDecoration(
                                                color: backColor,
                                                borderRadius:
                                                    new BorderRadius.only(
                                                  topLeft:
                                                      const Radius.circular(
                                                          25.0),
                                                  topRight:
                                                      const Radius.circular(
                                                          25.0),
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
                                                      TextInputType.multiline,
                                                  onChanged: (value) {
                                                    comment = value.trim();
                                                  },
                                                  style: TextStyle(
                                                    color: textColor,
                                                  ),
                                                  decoration: InputDecoration(
                                                    hintText:
                                                        "   Add a comment....",
                                                    hintStyle: TextStyle(
                                                      color: textColor,
                                                    ),
                                                    isDense: true,
                                                    contentPadding:
                                                        EdgeInsets.zero,
                                                    border: InputBorder.none,
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
                                                            ANIMATION.fromTop,
                                                        toastDuration: Duration(
                                                            seconds: 2),
                                                        description:
                                                            "Empty field",
                                                      ).show(context);
                                                    } else {
                                                      await HttpConnectComment()
                                                          .postComment(
                                                              snapshot
                                                                  .data!
                                                                  .followedPosts[
                                                                      index]
                                                                  .id,
                                                              comment);
                                                      Navigator.pop(context);
                                                      setState(() {
                                                        followedPosts =
                                                            HttpConnectPost()
                                                                .getFollowedPost();
                                                      });
                                                    }
                                                  },
                                                  icon: Icon(
                                                    Icons.send_rounded,
                                                    size: 35,
                                                    color: Colors
                                                        .deepPurpleAccent[700],
                                                  ),
                                                ),
                                              ),
                                            ),
                                          );
                                        },
                                        leading: FutureBuilder<Map>(
                                            future: getUser,
                                            builder: (context, snapshot1) {
                                              if (snapshot1.hasData) {
                                                return CircleAvatar(
                                                  radius: 15,
                                                  backgroundImage: NetworkImage(
                                                      profilePicUrl +
                                                          snapshot1.data![
                                                                  "userData"]
                                                              ["profile_pic"]),
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
                                        future: getComment(snapshot
                                            .data!.followedPosts[index].id!),
                                        builder: (context, snapshot1) {
                                          if (snapshot1.hasData) {
                                            return ListTile(
                                              leading: FutureBuilder<Map>(
                                                  future: getUser,
                                                  builder:
                                                      (context, snapshot2) {
                                                    if (snapshot2.hasData) {
                                                      return CircleAvatar(
                                                        radius: 15,
                                                        backgroundImage: NetworkImage(
                                                            profilePicUrl +
                                                                snapshot2.data![
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
                                                snapshot1.data![
                                                            "commentData"] ==
                                                        null
                                                    ? ""
                                                    : snapshot1.data![
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
                                                          .deleteComment(snapshot
                                                              .data!
                                                              .followedPosts[
                                                                  index]
                                                              .id);
                                                  setState(() {
                                                    followedPosts =
                                                        HttpConnectPost()
                                                            .getFollowedPost();
                                                  });
                                                  MotionToast.success(
                                                    position:
                                                        MOTION_TOAST_POSITION
                                                            .top,
                                                    animationType:
                                                        ANIMATION.fromTop,
                                                    toastDuration:
                                                        Duration(seconds: 2),
                                                    description: res["message"],
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
                                            child: CircularProgressIndicator(
                                              color: Colors.deepPurple,
                                            ),
                                          );
                                        },
                                      ),
                              ],
                            ),
                          )
                        ],
                      ),
                    );
                  },
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
            }),
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
              if (navIndex == 1 && activeNav != navIndex) {
                Navigator.pushNamed(context, "/search");
              } else if (navIndex == 2 && activeNav != navIndex) {
                Navigator.pushNamed(context, "/camera");
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
