import 'package:assignment/api/http/http_user.dart';
import 'package:assignment/api/base_urls.dart';
import 'package:assignment/screens/profile/profile_main_other.dart';
import 'package:assignment/screens/riverpod/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class Search extends StatefulWidget {
  const Search({Key? key}) : super(key: key);

  @override
  _SearchState createState() => _SearchState();
}

class _SearchState extends State<Search> {
  final themeController =
      StateNotifierProvider<ThemeNotifier, bool>((_) => ThemeNotifier());
  int activeNav = 1;
  String profileUrl = BaseUrl.profilePicUrl;

  late Future<List> searchedUsers;
  late Future<Map> getUser;
  String filterOption = "Username";

  @override
  void initState() {
    super.initState();
    searchedUsers = HttpConnectUser().getByUsername("@");
    getUser = HttpConnectUser().getUser();
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
          child: Padding(
            padding: EdgeInsets.symmetric(
              horizontal: _screenWidth * .05,
            ),
            child: SingleChildScrollView(
              child: Container(
                child: Column(
                  children: [
                    SizedBox(
                      height: _screenWidth * .02,
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        Text(
                          "Filter Option: ",
                          style: TextStyle(
                              color: textColor,
                              fontSize: _screenWidth > 250 ? 18 : 10,
                              fontFamily: "Laila-Bold"),
                        ),
                        Container(
                          padding: EdgeInsets.symmetric(horizontal: 8),
                          decoration: BoxDecoration(
                            border: Border.all(
                              color: textColor,
                              width: 2,
                            ),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: DropdownButton<String>(
                            value: filterOption,
                            icon: const Icon(
                              Icons.arrow_drop_down_outlined,
                              color: Colors.deepPurpleAccent,
                            ),
                            dropdownColor: backColor,
                            borderRadius: BorderRadius.circular(10),
                            onChanged: (String? newValue) {
                              setState(() {
                                filterOption = newValue!;
                              });
                            },
                            items: <String>[
                              'Username',
                              'Email',
                            ].map<DropdownMenuItem<String>>((String value) {
                              return DropdownMenuItem<String>(
                                value: value,
                                child: Text(
                                  value,
                                  style: TextStyle(
                                    color: textColor,
                                    fontSize: _screenWidth > 250 ? 15 : 8,
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                        ),
                      ],
                    ),
                    SizedBox(
                      height: 5,
                    ),
                    Container(
                      padding: EdgeInsets.all(_screenWidth * .01),
                      decoration: BoxDecoration(
                        color: Colors.deepPurpleAccent[700],
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: TextField(
                        onChanged: (value) {
                          if (value.trim() == "") {
                            return;
                          } else if (filterOption == "Username") {
                            setState(() {
                              searchedUsers =
                                  HttpConnectUser().getByUsername(value);
                            });
                          } else if (filterOption == "Email") {
                            setState(() {
                              searchedUsers =
                                  HttpConnectUser().getByEmail(value);
                            });
                          }
                        },
                        textCapitalization: TextCapitalization.words,
                        style: TextStyle(
                          color: textColor,
                        ),
                        decoration: InputDecoration(
                          hintText: "Search users here.....",
                          hintStyle: TextStyle(
                            color: textColor,
                          ),
                          isDense: true,
                          fillColor: backColor,
                          filled: true,
                          contentPadding: EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 10,
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10),
                            borderSide: BorderSide(
                              width: 2,
                              style: BorderStyle.solid,
                            ),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(5),
                            borderSide: BorderSide(
                              color: backColor,
                              width: 2,
                              style: BorderStyle.solid,
                            ),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(5),
                            borderSide: BorderSide(
                              color: backColor,
                              width: 2,
                              style: BorderStyle.solid,
                            ),
                          ),
                        ),
                      ),
                    ),
                    Container(
                      height: 600,
                      child: FutureBuilder<List>(
                        future: searchedUsers,
                        builder: (context, snapshot) {
                          if (snapshot.hasData) {
                            return ListView.builder(
                              itemCount: snapshot.data!.length,
                              itemBuilder: (context, index) => ListTile(
                                contentPadding:
                                    EdgeInsets.symmetric(horizontal: 0),
                                horizontalTitleGap: _screenWidth > 250 ? 15 : 0,
                                minVerticalPadding: _screenWidth > 250 ? 20 : 8,
                                leading: CircleAvatar(
                                  radius: _screenWidth > 250 ? 25 : 15,
                                  backgroundImage: NetworkImage(profileUrl +
                                      snapshot.data![index]["profile_pic"]),
                                ),
                                title: Text(
                                  snapshot.data![index]["username"],
                                  style: TextStyle(
                                      fontSize: _screenWidth > 250 ? 20 : 12,
                                      color: textColor,
                                      fontFamily: "Laila-bold"),
                                ),
                                subtitle: Text(
                                  snapshot.data![index]["email"],
                                  style: TextStyle(
                                    fontSize: _screenWidth > 250 ? 15 : 8,
                                    color: textColor,
                                  ),
                                ),
                                trailing: ElevatedButton(
                                  onPressed: () async {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (builder) => ProfileMainOther(
                                            user_id: snapshot.data![index]
                                                ["_id"]),
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
                              "Search users by their username or email address or by their profile first_name or last_name.",
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                color: textColor,
                                fontSize: 20,
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
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
