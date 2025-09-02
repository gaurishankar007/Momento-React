import 'package:assignment/api/http/http_user.dart';
import 'package:assignment/api/model/user.dart';
import 'package:assignment/screens/riverpod/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:form_field_validator/form_field_validator.dart';
import 'package:motion_toast/motion_toast.dart';
import 'package:motion_toast/resources/arrays.dart';

class ForgotPassword extends StatefulWidget {
  const ForgotPassword({Key? key}) : super(key: key);

  @override
  _ForgotPasswordState createState() => _ForgotPasswordState();
}

class _ForgotPasswordState extends State<ForgotPassword> {
  final themeController =
      StateNotifierProvider<ThemeNotifier, bool>((_) => ThemeNotifier());
  final _formKey = GlobalKey<FormState>();
  String email = "", newPassword = "";
  bool newP = false, conP = false;

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
            "WatchMe",
            style: TextStyle(
              color: textColor,
              fontSize: 30,
              fontFamily: "BerkshireSwash-Regular",
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
                  Text(
                    "Generate Reset Token",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                        color: textColor,
                        fontSize: 25,
                        fontFamily: "Laila-Bold"),
                  ),
                  SizedBox(
                    height: 20,
                  ),
                  TextFormField(
                    onChanged: (value) {
                      email = value;
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
                      hintText: "Enter your account's email.....",
                      hintStyle: TextStyle(
                        color: textColor,
                      ),
                      helperText: "Wrong email won't reset your password.",
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
                    height: 20,
                  ),
                  TextFormField(
                    onChanged: (value) {
                      newPassword = value;
                    },
                    validator: MultiValidator([
                      RequiredValidator(errorText: "Password is required!"),
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
                      hintText: "Enter a new password.....",
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
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      IconButton(
                        padding: EdgeInsets.zero,
                        iconSize: 25,
                        onPressed: () {
                          setState(() {
                            newP = !newP;
                          });
                        },
                        icon: Icon(Icons.remove_red_eye_sharp),
                        color: Colors.deepPurpleAccent[700],
                      ),
                    ],
                  ),
                  SizedBox(
                    height: 20,
                  ),
                  TextFormField(
                    validator: (value) => MatchValidator(
                            errorText: "Confirm Password did not match.")
                        .validateMatch(value!, newPassword),
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
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      IconButton(
                        padding: EdgeInsets.zero,
                        iconSize: 25,
                        onPressed: () {
                          setState(() {
                            conP = !conP;
                          });
                        },
                        icon: Icon(Icons.remove_red_eye_sharp),
                        color: Colors.deepPurpleAccent[700],
                      ),
                    ],
                  ),
                  SizedBox(
                    height: 25,
                  ),
                  ElevatedButton(
                    onPressed: () async {
                      if (_formKey.currentState!.validate()) {
                        _formKey.currentState!.save();

                        final responseData =
                            await HttpConnectUser().generateResetToken(
                          passResetToken(
                              email: email, newPassword: newPassword),
                        );

                        if (responseData["message"] == "Token was send.") {
                          Navigator.pushNamed(context, "/reset-password");
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
                      "Submit",
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
