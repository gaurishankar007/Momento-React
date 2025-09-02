import 'package:assignment/api/http/http_user.dart';
import 'package:assignment/screens/riverpod/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:form_field_validator/form_field_validator.dart';
import 'package:motion_toast/motion_toast.dart';
import 'package:motion_toast/resources/arrays.dart';

class UserSetting extends StatefulWidget {
  const UserSetting({Key? key}) : super(key: key);

  @override
  _UserSettingState createState() => _UserSettingState();
}

class _UserSettingState extends State<UserSetting> {
  final themeController =
      StateNotifierProvider<ThemeNotifier, bool>((_) => ThemeNotifier());
  final _usernameKey = GlobalKey<FormState>();
  final _emailKey = GlobalKey<FormState>();
  final _phoneKey = GlobalKey<FormState>();
  String username = "", password = "", email = "", phone = "";
  var uUsername = TextEditingController();
  var uEmail = TextEditingController();
  var uPhone = TextEditingController();

  void getUserData() async {
    final responseData = await HttpConnectUser().getUser();
    if (responseData.containsKey("userData")) {
      uUsername.text = responseData["userData"]["username"];
      uEmail.text = responseData["userData"]["email"];
      uPhone.text = responseData["userData"]["phone"].toString();
    }
  }

  @override
  void initState() {
    super.initState();
    getUserData();
  }

  @override
  void dispose() {
    super.dispose();
    uUsername.dispose();
    uEmail.dispose();
    uPhone.dispose();
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
            "Uesr Information",
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
            child: Column(
              children: [
                ListTile(
                  contentPadding:
                      EdgeInsets.only(left: 0, right: 0, bottom: 20),
                  minLeadingWidth: 0,
                  title: Form(
                    key: _usernameKey,
                    child: TextFormField(
                      controller: uUsername,
                      onSaved: (value) {
                        username = value!;
                      },
                      validator: MultiValidator([
                        RequiredValidator(errorText: "Username is required!"),
                        MinLengthValidator(3,
                            errorText: "Provide at least 3 characters!"),
                        MaxLengthValidator(15,
                            errorText: "Provide at most 15 characters!"),
                        PatternValidator(r'^[a-zA-Z0-9]+$',
                            errorText:
                                "Special characters and white spaces not allowed!")
                      ]),
                      style: TextStyle(
                        color: textColor,
                      ),
                      decoration: InputDecoration(
                        labelText: "Username",
                        labelStyle: TextStyle(
                          color: textColor,
                          fontFamily: "Laila-Bold",
                        ),
                        hintText: "Enter your username.....",
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
                  ),
                  trailing: ElevatedButton.icon(
                    onPressed: () async {
                      if (_usernameKey.currentState!.validate()) {
                        _usernameKey.currentState!.save();

                        final responseData =
                            await HttpConnectUser().changeUsername(username);

                        if (responseData["message"] ==
                            "Your username has been changed.") {
                          Navigator.pop(context);
                          MotionToast.success(
                            position: MOTION_TOAST_POSITION.top,
                            animationType: ANIMATION.fromTop,
                            toastDuration: Duration(seconds: 2),
                            description: responseData["message"],
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
                          description: "Empty field.",
                        ).show(context);
                      }
                    },
                    icon: Icon(Icons.edit),
                    label: Text("Change"),
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
                ListTile(
                  contentPadding:
                      EdgeInsets.only(left: 0, right: 0, bottom: 20),
                  minLeadingWidth: 0,
                  title: Form(
                    key: _emailKey,
                    child: TextFormField(
                      controller: uEmail,
                      onSaved: (value) {
                        email = value!;
                      },
                      keyboardType: TextInputType.emailAddress,
                      validator: MultiValidator([
                        RequiredValidator(
                            errorText: "Email address is required!"),
                        EmailValidator(errorText: "Invalid email!")
                      ]),
                      style: TextStyle(
                        color: textColor,
                      ),
                      decoration: InputDecoration(
                        labelText: "Email",
                        labelStyle: TextStyle(
                          color: textColor,
                          fontFamily: "Laila-Bold",
                        ),
                        hintText: "Enter your email.....",
                        hintStyle: TextStyle(
                          color: textColor,
                        ),
                        helperText: "Useful for reseting password.",
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
                  ),
                  trailing: ElevatedButton.icon(
                    onPressed: () async {
                      if (_emailKey.currentState!.validate()) {
                        _emailKey.currentState!.save();

                        final responseData =
                            await HttpConnectUser().changeEmail(email);

                        if (responseData["message"] ==
                            "Your email address has been changed.") {
                          Navigator.pop(context);
                          MotionToast.success(
                            position: MOTION_TOAST_POSITION.top,
                            animationType: ANIMATION.fromTop,
                            toastDuration: Duration(seconds: 2),
                            description: responseData["message"],
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
                          description: "Empty field.",
                        ).show(context);
                      }
                    },
                    icon: Icon(Icons.edit),
                    label: Text("Change"),
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
                ListTile(
                  contentPadding:
                      EdgeInsets.only(left: 0, right: 0, bottom: 20),
                  minLeadingWidth: 0,
                  title: Form(
                    key: _phoneKey,
                    child: TextFormField(
                      controller: uPhone,
                      onSaved: (value) {
                        phone = value!;
                      },
                      keyboardType: TextInputType.number,
                      validator: MultiValidator([
                        RequiredValidator(
                            errorText: "Phone number is required!"),
                        PatternValidator(r'^(?:[+0]9)?[0-9]{10}$',
                            errorText: "Invalid phone number!")
                      ]),
                      style: TextStyle(
                        color: textColor,
                      ),
                      decoration: InputDecoration(
                        labelText: "Phone Number",
                        labelStyle: TextStyle(
                          color: textColor,
                          fontFamily: "Laila-Bold",
                        ),
                        hintText: "Enter your phone number.....",
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
                  ),
                  trailing: ElevatedButton.icon(
                    onPressed: () async {
                      if (_phoneKey.currentState!.validate()) {
                        _phoneKey.currentState!.save();

                        final responseData =
                            await HttpConnectUser().changePhone(phone);

                        if (responseData["message"] ==
                            "Your phone number has been changed.") {
                          Navigator.pop(context);
                          MotionToast.success(
                            position: MOTION_TOAST_POSITION.top,
                            animationType: ANIMATION.fromTop,
                            toastDuration: Duration(seconds: 2),
                            description: responseData["message"],
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
                          description: "Empty field.",
                        ).show(context);
                      }
                    },
                    icon: Icon(Icons.edit),
                    label: Text("Change"),
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
              ],
            ),
          ),
        ),
      );
    });
  }
}
