import 'package:assignment/api/http/http_user.dart';
import 'package:assignment/api/model/user.dart';
import 'package:assignment/screens/riverpod/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:form_field_validator/form_field_validator.dart';
import 'package:motion_toast/motion_toast.dart';
import 'package:motion_toast/resources/arrays.dart';

class PasswordSetting extends StatefulWidget {
  const PasswordSetting({Key? key}) : super(key: key);

  @override
  _PasswordSettingState createState() => _PasswordSettingState();
}

class _PasswordSettingState extends State<PasswordSetting> {
  final themeController =
      StateNotifierProvider<ThemeNotifier, bool>((_) => ThemeNotifier());
  final _formKey = GlobalKey<FormState>();
  String currentPassword = "", newPassword = "", confirmPassword = "";
  bool curP = false, newP = false, conP = false;

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
            "Password",
            style: TextStyle(
              color: textColor,
              fontSize: 20,
            ),
          ),
          centerTitle: true,
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
                  ListTile(
                    contentPadding:
                        EdgeInsets.only(left: 0, right: 0, bottom: 20),
                    minLeadingWidth: 0,
                    title: TextFormField(
                      onChanged: (value) {
                        currentPassword = value;
                      },
                      validator: MultiValidator([
                        RequiredValidator(
                            errorText: "Currrent password is required!"),
                      ]),
                      obscureText: !curP,
                      style: TextStyle(
                        color: textColor,
                      ),
                      decoration: InputDecoration(
                        labelText: "Current Password",
                        labelStyle: TextStyle(
                          color: textColor,
                          fontFamily: "Laila-Bold",
                        ),
                        hintText: "Enter the current password.....",
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
                    trailing: ElevatedButton(
                      onPressed: () {
                        setState(() {
                          curP = !curP;
                        });
                      },
                      child: curP ? Text("Hide") : Text("Show"),
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
                    title: TextFormField(
                      onSaved: (value) {
                        newPassword = value!.trim();
                      },
                      validator: MultiValidator([
                        RequiredValidator(
                            errorText: "New password is required!"),
                        MinLengthValidator(5,
                            errorText: "Provide at least 5 characters!"),
                        MaxLengthValidator(15,
                            errorText: "Provide at most 15 characters!"),
                        PatternValidator(
                            r'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#\$&*~]).{5,15}$',
                            errorText:
                                'At least 1 upper, lowercase, number & special character!')
                      ]),
                      obscureText: !newP,
                      style: TextStyle(
                        color: textColor,
                      ),
                      decoration: InputDecoration(
                        labelText: "New Password",
                        labelStyle: TextStyle(
                          color: textColor,
                          fontFamily: "Laila-Bold",
                        ),
                        hintText: "Enter a password.....",
                        hintStyle: TextStyle(
                          color: textColor,
                        ),
                        helperText: "Excludes whitespace around the password.",
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
                    trailing: ElevatedButton(
                      onPressed: () {
                        setState(() {
                          newP = !newP;
                        });
                      },
                      child: newP ? Text("Hide") : Text("Show"),
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
                    title: TextFormField(
                      onSaved: (value) {
                        confirmPassword = value!.trim();
                      },
                      obscureText: !conP,
                      style: TextStyle(
                        color: textColor,
                      ),
                      decoration: InputDecoration(
                        labelText: "Confirm Password",
                        labelStyle: TextStyle(
                          color: textColor,
                          fontFamily: "Laila-Bold",
                        ),
                        hintText: "Enter the password again.....",
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
                    trailing: ElevatedButton(
                      onPressed: () {
                        setState(() {
                          conP = !conP;
                        });
                      },
                      child: conP ? Text("Hide") : Text("Show"),
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
                  SizedBox(
                    height: 5,
                  ),
                  ElevatedButton(
                    onPressed: () async {
                      print(confirmPassword);
                      if (_formKey.currentState!.validate()) {
                        _formKey.currentState!.save();

                        if (confirmPassword != newPassword) {
                          return MotionToast.error(
                            position: MOTION_TOAST_POSITION.top,
                            animationType: ANIMATION.fromTop,
                            toastDuration: Duration(seconds: 2),
                            description: "Confirm password did not match.",
                          ).show(context);
                        }

                        final responseData =
                            await HttpConnectUser().changePassword(
                          ChangePassword(
                              currentPassword: currentPassword,
                              newPassword: newPassword),
                        );

                        if (responseData["message"] ==
                            "Your password has been changed.") {
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
                          description: "Validation error.",
                        ).show(context);
                      }
                    },
                    child: Text(
                      "Change Password",
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
      );
    });
  }
}
