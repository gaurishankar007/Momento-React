import 'package:assignment/api/base_urls.dart';
import 'package:assignment/api/http/http_user.dart';
import 'package:assignment/api/http/http_watch.dart';
import 'package:assignment/api/http/http_post.dart';
import 'package:assignment/api/model/post.dart';
import 'package:assignment/api/response/response_post.dart';
import 'package:assignment/screens/riverpod/theme.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:motion_toast/motion_toast.dart';
import 'package:motion_toast/resources/arrays.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

class PostEdit extends StatefulWidget {
  final String? post_id;
  const PostEdit({Key? key, @required this.post_id}) : super(key: key);

  @override
  _PostEditState createState() => _PostEditState();
}

class _PostEditState extends State<PostEdit> {
  final themeController =
      StateNotifierProvider<ThemeNotifier, bool>((_) => ThemeNotifier());
  int activeNav = 4;

  late Future<GetPost> userPost;
  late Future<Map> getUser;
  int totalImages = 0;
  int activatedIndex = 0;

  String caption = "", description = "";
  var uCaption = TextEditingController(),
      uDescription = TextEditingController();

  List<String> tag_friend_id = [];
  List<String> tag_friend_name = [];
  List<String> tag_friend_profile_pic = [];

  String postUrl = BaseUrl.postUrl;
  String profilePicUrl = BaseUrl.profilePicUrl;

  Future<List> getUserFollowers() async {
    final res = await HttpConnectWatch().getWatchers();
    return res;
  }

  @override
  void initState() {
    super.initState();
    userPost = HttpConnectPost().getSinglePost(widget.post_id);
    getUser = HttpConnectUser().getUser();
    userPost.then((value) {
      setState(() {
        totalImages = value.attach_file!.length;
        uCaption.text = value.caption!;
        caption = value.caption!;
        uDescription.text = value.description!;
        description = value.caption!;
        for (int i = 0; i < value.tag_friend!.length; i++) {
          tag_friend_id.add(value.tag_friend![i]["_id"]!);
          tag_friend_name.add(value.tag_friend![i]["username"]!);
          tag_friend_profile_pic.add(value.tag_friend![i]["profile_pic"]!);
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
                      return CarouselSlider(
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
                  }),
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
                  horizontal: _screenWidth * .03,
                ),
                child: Column(
                  children: [
                    SizedBox(
                      height: 20,
                    ),
                    TextFormField(
                      controller: uCaption,
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
                      controller: uDescription,
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
                                    height: 250,
                                    child: FutureBuilder<List>(
                                      future: getUserFollowers(),
                                      builder: (context, snapshot) {
                                        if (snapshot.hasData) {
                                          return ListView.builder(
                                            itemCount: snapshot.data!.length,
                                            itemBuilder: (context, index) =>
                                                ListTile(
                                              contentPadding: EdgeInsets.zero,
                                              minVerticalPadding: 1,
                                              leading: CircleAvatar(
                                                radius: 20,
                                                backgroundImage: NetworkImage(
                                                    profilePicUrl +
                                                        snapshot.data![index]
                                                                ["follower"]
                                                            ["profile_pic"]),
                                              ),
                                              title: Text(
                                                snapshot.data![index]
                                                    ["follower"]["username"],
                                                style: TextStyle(
                                                    fontSize: 15,
                                                    color: textColor,
                                                    fontFamily: "Laila-Bold"),
                                              ),
                                              onTap: () {
                                                if (!tag_friend_id.contains(
                                                    snapshot.data![index]
                                                        ["follower"]["_id"])) {
                                                  setState(
                                                    () {
                                                      tag_friend_id.add(snapshot
                                                              .data![index]
                                                          ["follower"]["_id"]);
                                                      tag_friend_name.add(
                                                          snapshot.data![index]
                                                                  ["follower"]
                                                              ["username"]);
                                                      tag_friend_profile_pic
                                                          .add(snapshot.data![
                                                                      index]
                                                                  ["follower"]
                                                              ["profile_pic"]);
                                                    },
                                                  );
                                                  Navigator.pop(context);
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
                                          child: CircularProgressIndicator(
                                              color:
                                                  Colors.deepPurpleAccent[700]),
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
                                  padding: EdgeInsets.symmetric(horizontal: 5),
                                  decoration: BoxDecoration(
                                    color: backColor,
                                    border: Border.all(
                                      color: textColor,
                                      width: 2,
                                    ),
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  height: 120,
                                  child: ListView.builder(
                                    itemCount: tag_friend_name.length,
                                    itemBuilder: (context, index) => ListTile(
                                      contentPadding: EdgeInsets.zero,
                                      minVerticalPadding: 1,
                                      leading: CircleAvatar(
                                        radius: 20,
                                        backgroundImage: NetworkImage(
                                            profilePicUrl +
                                                tag_friend_profile_pic[index]),
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
                                            tag_friend_id.removeAt(index);
                                            tag_friend_name.removeAt(index);
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
                            ],
                          ),
                    SizedBox(
                      height: 10,
                    ),
                    ElevatedButton(
                      onPressed: () async {
                        if (caption == "") {
                          return MotionToast.error(
                            position: MOTION_TOAST_POSITION.top,
                            animationType: ANIMATION.fromTop,
                            toastDuration: Duration(seconds: 2),
                            description: "Give a caption to your post.",
                          ).show(context);
                        }
                        final res =
                            await HttpConnectPost().updatePost(UpdatedPost(
                          post_id: widget.post_id,
                          caption: caption,
                          description: description,
                          taggedFriend: tag_friend_id,
                        ));

                        if (res["message"] == "Post has been edited.") {
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
                      },
                      child: Text(
                        "Edit",
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
