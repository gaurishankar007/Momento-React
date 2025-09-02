import 'package:assignment/api/base_urls.dart';
import 'package:assignment/api/http/http_report.dart';
import 'package:assignment/api/http/http_user.dart';
import 'package:assignment/screens/riverpod/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:motion_toast/motion_toast.dart';
import 'package:motion_toast/resources/arrays.dart';

class Report extends StatefulWidget {
  final String? post_id;
  const Report({Key? key, @required this.post_id}) : super(key: key);

  @override
  _ReportState createState() => _ReportState();
}

class _ReportState extends State<Report> {
  final themeController =
      StateNotifierProvider<ThemeNotifier, bool>((_) => ThemeNotifier());
  int activeNav = 0;

  late Future<Map> getUser;
  String profilePicUrl = BaseUrl.profilePicUrl;
  String report_for = "Nudity or sexual activity";
  List<String> report_for_list = ["Nudity or sexual activity"];

  @override
  void initState() {
    super.initState();
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
        appBar: AppBar(
          iconTheme: IconThemeData(
            color: textColor,
          ),
          backgroundColor: backColor,
          title: Text(
            "Report Post",
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
          padding: EdgeInsets.symmetric(
            horizontal: _screenWidth * .03,
            vertical: _screenWidth * .03,
          ),
          child: SingleChildScrollView(
            child: Container(
              width: _screenWidth,
              child: Column(
                children: [
                  Text(
                    "Add report options",
                    style: TextStyle(
                        color: textColor,
                        fontSize: 15,
                        fontFamily: "Laila-Bold"),
                  ),
                  SizedBox(
                    height: 10,
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
                      value: report_for,
                      icon: const Icon(
                        Icons.arrow_drop_down_outlined,
                        color: Colors.deepPurpleAccent,
                      ),
                      elevation: 0,
                      dropdownColor: backColor,
                      borderRadius: BorderRadius.circular(10),
                      onChanged: (String? newValue) {
                        setState(() {
                          report_for = newValue!;
                          if (!report_for_list.contains(newValue)) {
                            report_for_list.add(newValue);
                          }
                        });
                      },
                      items: <String>[
                        'Nudity or sexual activity',
                        'Scam or fraud',
                        'False information',
                        'Bullying or harassment',
                        'Intellectual property voilations',
                        'Voilent content',
                        'Innapropriate language',
                        'Selling illegal or regulated goods',
                        'Eating disorder',
                        'Hate speech or symbol'
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
                  SizedBox(
                    height: 10,
                  ),
                  Container(
                    padding: EdgeInsets.symmetric(
                      horizontal: 5,
                    ),
                    height: 250,
                    decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(5),
                        border: Border.all(
                          color: textColor,
                          width: 2,
                        )),
                    child: ListView.builder(
                      itemCount: report_for_list.length,
                      itemBuilder: (context, index) => ListTile(
                        contentPadding: EdgeInsets.zero,
                        minVerticalPadding: 1,
                        leading: Icon(
                          Icons.circle,
                          color: Colors.deepPurpleAccent[700],
                          size: 25,
                        ),
                        title: Text(
                          report_for_list[index],
                          style: TextStyle(
                              fontSize: 15,
                              color: textColor,
                              fontFamily: "Laila-bold"),
                        ),
                        trailing: IconButton(
                          onPressed: () {
                            setState(() {
                              report_for_list.removeAt(index);
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
                  SizedBox(
                    height: 10,
                  ),
                  ElevatedButton(
                    onPressed: () async {
                      if (report_for_list.isEmpty) {
                        return MotionToast.error(
                          position: MOTION_TOAST_POSITION.top,
                          animationType: ANIMATION.fromTop,
                          toastDuration: Duration(seconds: 2),
                          description:
                              "You have not selected any report options.",
                        ).show(context);
                      }
                      final res = await HttpConnectReport()
                          .report(widget.post_id, report_for_list);

                      if (res["message"] == "Reported.") {
                        Navigator.pop(context);
                        MotionToast.success(
                          position: MOTION_TOAST_POSITION.top,
                          animationType: ANIMATION.fromTop,
                          toastDuration: Duration(seconds: 2),
                          description: "You report has been registered.",
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
                      "Report",
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
