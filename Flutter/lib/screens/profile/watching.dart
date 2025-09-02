import 'package:assignment/api/base_urls.dart';
import 'package:assignment/api/http/http_user.dart';
import 'package:assignment/api/http/http_watch.dart';
import 'package:assignment/screens/profile/profile_main_other.dart';
import 'package:assignment/screens/riverpod/theme.dart';
import 'package:awesome_notifications/awesome_notifications.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class Watching extends StatefulWidget {
  const Watching({Key? key}) : super(key: key);

  @override
  _WatchingState createState() => _WatchingState();
}

class _WatchingState extends State<Watching> {
  final themeController =
      StateNotifierProvider<ThemeNotifier, bool>((_) => ThemeNotifier());
  int activeNav = 4;
  String profileUrl = BaseUrl.profilePicUrl;

  late Future<List> userWatching;
  late Future<Map> getUser;

  void generateNotification(String title, String body) async {
    await AwesomeNotifications().createNotification(
      content: NotificationContent(
        id: 1,
        channelKey: 'key1',
        title: title,
        body: body,
        notificationLayout: NotificationLayout.BigPicture,
        bigPicture:
            'https://storage.googleapis.com/sales.appinst.io/2016/07/When-Push-Comes-to-Shove-Mobile-Marketing-Through-App-Notifications.png',
      ),
    );
  }

  @override
  void initState() {
    super.initState();
    userWatching = HttpConnectWatch().getWatching();
    getUser = HttpConnectUser().getUser();
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
          appBar: AppBar(
            iconTheme: IconThemeData(
              color: textColor,
            ),
            leading: IconButton(
              onPressed: () {
                Navigator.pop(context);
                Navigator.pushNamed(context, "/profile");
              },
              icon: Icon(
                Icons.arrow_back,
                color: textColor,
              ),
            ),
            backgroundColor: backColor,
            title: Text(
              "Watching",
              style: TextStyle(
                color: textColor,
                fontSize: 20,
              ),
            ),
            centerTitle: true,
            elevation: 0,
          ),
          body: Padding(
            padding: EdgeInsets.symmetric(horizontal: _screenWidth * .03),
            child: FutureBuilder<List>(
              future: userWatching,
              builder: (context, snapshot) {
                if (snapshot.hasData) {
                  return ListView.builder(
                    itemCount: snapshot.data!.length,
                    itemBuilder: (context, index) => ListTile(
                      contentPadding: EdgeInsets.symmetric(horizontal: 0),
                      horizontalTitleGap: 15,
                      minVerticalPadding: 20,
                      onLongPress: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (builder) => ProfileMainOther(
                              user_id: snapshot.data![index]["followed_user"]
                                  ["_id"],
                            ),
                          ),
                        );
                      },
                      leading: CircleAvatar(
                        radius: _screenWidth > 250 ? 25 : 15,
                        backgroundImage: NetworkImage(profileUrl +
                            snapshot.data![index]["followed_user"]
                                ["profile_pic"]),
                      ),
                      title: Text(
                        snapshot.data![index]["followed_user"]["username"],
                        style: TextStyle(
                            fontSize: _screenWidth > 250 ? 20 : 10,
                            color: textColor,
                            fontFamily: "Laila-bold"),
                      ),
                      subtitle: Text(
                        snapshot.data![index]["followed_user"]["email"],
                        style: TextStyle(
                          fontSize: _screenWidth > 250 ? 15 : 8,
                          color: textColor,
                        ),
                      ),
                      trailing: ElevatedButton(
                        onPressed: () async {
                          await HttpConnectWatch().unWatch(
                              snapshot.data![index]["followed_user"]["_id"]);

                          setState(() {
                            userWatching = HttpConnectWatch().getWatching();
                          });
                          generateNotification(
                            "User Watching",
                            "You have unwatched " +
                                snapshot.data![index]["followed_user"]
                                    ["username"] +
                                ".",
                          );
                        },
                        child: Text(
                          "UnWatch",
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
                    "You have not watched anybody yet.",
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
                } else if (navIndex == 4 && activeNav != navIndex) {
                  Navigator.pushNamed(context, "/profile");
                }
              },
            ),
          ),
        );
      },
    );
  }
}
