import 'package:assignment/api/http/http_profile.dart';
import 'package:assignment/api/model/user.dart';
import 'package:assignment/screens/riverpod/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_holo_date_picker/flutter_holo_date_picker.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:motion_toast/motion_toast.dart';
import 'package:motion_toast/resources/arrays.dart';

class PersonalSetting extends StatefulWidget {
  const PersonalSetting({Key? key}) : super(key: key);

  @override
  _PersonalSettingState createState() => _PersonalSettingState();
}

class _PersonalSettingState extends State<PersonalSetting> {
  final themeController =
      StateNotifierProvider<ThemeNotifier, bool>((_) => ThemeNotifier());
  final _formKey = GlobalKey<FormState>();
  String firstName = "", lastName = "", birthDate = "", biography = "";
  String? gender = "";

  var uFirstName = TextEditingController();
  var uLastName = TextEditingController();
  var uBiography = TextEditingController();

  late Future<Map> getBirthDate;

  void getPersonalInformation() async {
    final responseData = await HttpConnectProfile().getPersonalInfo();
    if (responseData.containsKey("userProfile")) {
      uFirstName.text = responseData["userProfile"]["first_name"];
      uLastName.text = responseData["userProfile"]["last_name"];
      gender = responseData["userProfile"]["gender"];
      birthDate = responseData["userProfile"]["birthday"] != null
          ? responseData["userProfile"]["birthday"].split("T").first
          : "";
      uBiography.text = responseData["userProfile"]["biography"];
      setState(() {});
    }
  }

  @override
  void initState() {
    super.initState();
    getPersonalInformation();
    getBirthDate = HttpConnectProfile().getPersonalInfo();
  }

  @override
  void dispose() {
    super.dispose();
    uFirstName.dispose();
    uLastName.dispose();
    uBiography.dispose();
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
            "Personal Information",
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
          elevation: 2,
          shadowColor: textColor,
        ),
        body: SingleChildScrollView(
          child: Padding(
            padding: EdgeInsets.only(
              top: _screenWidth * 0.03,
              left: _screenWidth * 0.03,
              right: _screenWidth * 0.03,
            ),
            child: Form(
              key: _formKey,
              child: Column(
                children: [
                  SizedBox(
                    height: 10,
                  ),
                  TextFormField(
                    controller: uFirstName,
                    onSaved: (value) {
                      firstName = value!.trim();
                    },
                    textCapitalization: TextCapitalization.words,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return "First name is required!";
                      } else if (value.contains(RegExp(r'[0-9]')) ||
                          value.contains(RegExp(r'[!@#$%^&*(),.?":{}|<>]')) ||
                          value.length < 2) {
                        return "Invalid first name!";
                      }
                      return null;
                    },
                    style: TextStyle(
                      color: textColor,
                    ),
                    decoration: InputDecoration(
                      labelText: "First Name",
                      labelStyle: TextStyle(
                        color: textColor,
                        fontFamily: "Laila-Bold",
                      ),
                      hintText: "Enter your first name.....",
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
                    controller: uLastName,
                    onSaved: (value) {
                      lastName = value!;
                    },
                    textCapitalization: TextCapitalization.words,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return "Last name is required!";
                      } else if (value.contains(RegExp(r'[0-9]')) ||
                          value.contains(RegExp(r'[!@#$%^&*(),.?":{}|<>]')) ||
                          value.length < 2) {
                        return "Invalid last name!";
                      } else if (value.contains(" ")) {
                        return "Whitespace is not allowed!";
                      }
                      return null;
                    },
                    style: TextStyle(
                      color: textColor,
                    ),
                    decoration: InputDecoration(
                      labelText: "Last Name",
                      labelStyle: TextStyle(
                        color: textColor,
                        fontFamily: "Laila-Bold",
                      ),
                      hintText: "Enter your last name.....",
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
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Gender:",
                        style: TextStyle(
                          color: textColor,
                          fontSize: 17,
                          fontFamily: "Laila-Bold",
                        ),
                      ),
                      Row(
                        children: [
                          Radio(
                            fillColor: MaterialStateColor.resolveWith(
                                (states) => textColor),
                            value: "Male",
                            groupValue: gender,
                            onChanged: (String? value) => setState(() {
                              gender = value;
                            }),
                          ),
                          Text(
                            "Male",
                            style: TextStyle(
                              color: textColor,
                              fontSize: 15,
                            ),
                          ),
                          Radio(
                            fillColor: MaterialStateColor.resolveWith(
                                (states) => textColor),
                            value: "Female",
                            groupValue: gender,
                            onChanged: (String? value) => setState(() {
                              gender = value;
                            }),
                          ),
                          Text(
                            "Female",
                            style: TextStyle(
                              color: textColor,
                              fontSize: 15,
                            ),
                          ),
                          Radio(
                            fillColor: MaterialStateColor.resolveWith(
                                (states) => textColor),
                            value: "Other",
                            groupValue: gender,
                            onChanged: (String? value) => setState(() {
                              gender = value;
                            }),
                          ),
                          Text(
                            "Other",
                            style: TextStyle(
                              color: textColor,
                              fontSize: 15,
                            ),
                          )
                        ],
                      ),
                    ],
                  ),
                  SizedBox(
                    height: 10,
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Birthday:",
                        style: TextStyle(
                            color: textColor,
                            fontSize: 17,
                            fontFamily: "Laila-Bold"),
                      ),
                      FutureBuilder<Map>(
                          future: getBirthDate,
                          builder: (context, snapshot) {
                            if (snapshot.hasData) {
                              return DatePickerWidget(
                                dateFormat: "yyyy-MMMM-dd",
                                firstDate: DateTime(1900),
                                lastDate: DateTime.now(),
                                initialDate: snapshot.data!["userProfile"]
                                            ["birthday"] ==
                                        null
                                    ? DateTime.now()
                                    : DateTime.parse(snapshot
                                        .data!["userProfile"]["birthday"]
                                        .split("T")
                                        .first),
                                onChange: (DateTime newDate, _) {
                                  String month = "${newDate.month}";
                                  String day = "${newDate.day}";
                                  if (int.parse(newDate.month.toString()) <
                                      10) {
                                    month = "0${newDate.month}";
                                  }
                                  if (int.parse(newDate.day.toString()) < 10) {
                                    day = "0${newDate.day}";
                                  }
                                  birthDate = "${newDate.year}-$month-$day";
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
                            return const CircularProgressIndicator(
                              color: Colors.deepPurple,
                            );
                          }),
                    ],
                  ),
                  SizedBox(
                    height: 20,
                  ),
                  TextFormField(
                    controller: uBiography,
                    maxLines: 5,
                    onSaved: (value) {
                      biography = value!.trim();
                    },
                    keyboardType: TextInputType.multiline,
                    textCapitalization: TextCapitalization.sentences,
                    style: TextStyle(
                      color: textColor,
                    ),
                    decoration: InputDecoration(
                      labelText: "Biography",
                      labelStyle: TextStyle(
                        color: textColor,
                        fontFamily: "Laila-Bold",
                      ),
                      hintText: "Enter your biography here.....",
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
                    height: 15,
                  ),
                  ElevatedButton(
                    onPressed: () async {
                      if (_formKey.currentState!.validate()) {
                        _formKey.currentState!.save();

                        if (gender == "") {
                          return MotionToast.error(
                            position: MOTION_TOAST_POSITION.top,
                            animationType: ANIMATION.fromTop,
                            toastDuration: Duration(seconds: 2),
                            description: "Gender not selected.",
                          ).show(context);
                        } else if (birthDate == "") {
                          return MotionToast.error(
                            position: MOTION_TOAST_POSITION.top,
                            animationType: ANIMATION.fromTop,
                            toastDuration: Duration(seconds: 2),
                            description: "BirthDate not selected.",
                          ).show(context);
                        }

                        final responseData =
                            await HttpConnectProfile().addPersonalInfo(
                          PersonalInfoRegister(
                              firstName: firstName,
                              lastName: lastName,
                              gender: gender,
                              birthDate: birthDate,
                              biography: biography),
                        );

                        if (responseData["message"] == "Profile updated.") {
                          Navigator.pop(context);
                          MotionToast.success(
                            position: MOTION_TOAST_POSITION.top,
                            animationType: ANIMATION.fromTop,
                            toastDuration: Duration(seconds: 2),
                            description: "Personal information updated.",
                          ).show(context);
                        } else {
                          MotionToast.error(
                            position: MOTION_TOAST_POSITION.top,
                            animationType: ANIMATION.fromTop,
                            toastDuration: Duration(seconds: 2),
                            description: responseData["message"],
                          ).show(context);
                        }
                      } else {
                        MotionToast.error(
                          position: MOTION_TOAST_POSITION.top,
                          animationType: ANIMATION.fromTop,
                          toastDuration: Duration(seconds: 1),
                          description: "Validation error.",
                        ).show(context);
                      }
                    },
                    child: Text(
                      "Update",
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
                  SizedBox(
                    height: 25,
                  )
                ],
              ),
            ),
          ),
        ),
      );
    });
  }
}
