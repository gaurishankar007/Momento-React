import 'package:assignment/api/http/http_address.dart';
import 'package:assignment/api/model/user.dart';
import 'package:assignment/screens/riverpod/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:form_field_validator/form_field_validator.dart';
import 'package:country_picker/country_picker.dart';
import 'package:motion_toast/motion_toast.dart';
import 'package:motion_toast/resources/arrays.dart';

class AddressSetting extends StatefulWidget {
  const AddressSetting({Key? key}) : super(key: key);

  @override
  _AddressSettingState createState() => _AddressSettingState();
}

class _AddressSettingState extends State<AddressSetting> {
  final themeController =
      StateNotifierProvider<ThemeNotifier, bool>((_) => ThemeNotifier());
  final _formKey = GlobalKey<FormState>();
  String pCountry = "",
      pState = "",
      pCity = "",
      pStreet = "",
      tCountry = "",
      tState = "",
      tCity = "",
      tStreet = "";

  var uPState = TextEditingController();
  var uPCity = TextEditingController();
  var uPStreet = TextEditingController();
  var uTState = TextEditingController();
  var uTCity = TextEditingController();
  var uTStreet = TextEditingController();

  void getAddressInformation() async {
    final responseData = await HttpConnectAddress().getAddressInfo();
    if (responseData.containsKey("userAddress")) {
      pCountry = responseData["userAddress"]["permanent"]["country"];
      uPState.text = responseData["userAddress"]["permanent"]["state"];
      uPCity.text = responseData["userAddress"]["permanent"]["city"];
      uPStreet.text = responseData["userAddress"]["permanent"]["street"];
      tCountry = responseData["userAddress"]["temporary"]["country"];
      uTState.text = responseData["userAddress"]["temporary"]["state"];
      uTCity.text = responseData["userAddress"]["temporary"]["city"];
      uTStreet.text = responseData["userAddress"]["temporary"]["street"];
      setState(() {});
    }
  }

  @override
  void initState() {
    super.initState();
    getAddressInformation();
  }

  @override
  void dispose() {
    super.dispose();
    uPState.dispose();
    uPCity.dispose();
    uPStreet.dispose();
    uTState.dispose();
    uTCity.dispose();
    uTStreet.dispose();
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
            "Address Information",
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
                  Text(
                    "Permanent",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: textColor,
                      fontSize: 20,
                      fontFamily: "Laila-Bold",
                      decoration: TextDecoration.underline,
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Country:",
                        style: TextStyle(
                          fontSize: 18,
                        ),
                      ),
                      Row(
                        children: [
                          TextButton(
                            style: TextButton.styleFrom(
                              primary: textColor,
                              side: BorderSide(
                                color: textColor,
                              ),
                              padding: EdgeInsets.fromLTRB(8, 0, 0, 0),
                            ),
                            onPressed: () {
                              showCountryPicker(
                                context: context,
                                showPhoneCode: true,
                                onSelect: (Country country) {
                                  setState(() {
                                    String countryName = "";
                                    List<String> countryDetail =
                                        country.displayName.split(" ");
                                    for (int i = 0;
                                        i < countryDetail.length;
                                        i++) {
                                      if (i < (countryDetail.length - 2)) {
                                        countryName += countryDetail[i] + " ";
                                      }
                                    }
                                    pCountry = countryName.trim();
                                  });
                                },
                              );
                            },
                            child: Row(
                              children: [
                                Text(
                                  pCountry,
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    fontSize: 13,
                                  ),
                                ),
                                Icon(
                                  Icons.arrow_drop_down_sharp,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  SizedBox(
                    height: 10,
                  ),
                  TextFormField(
                    controller: uPState,
                    onSaved: (value) {
                      pState = value!.trim();
                    },
                    validator: MultiValidator([
                      RequiredValidator(errorText: "State  is required!"),
                      MinLengthValidator(2,
                          errorText: "Provide at least two character.")
                    ]),
                    style: TextStyle(
                      color: textColor,
                    ),
                    decoration: InputDecoration(
                      labelText: "State",
                      labelStyle: TextStyle(
                        color: textColor,
                        fontFamily: "Laila-Bold",
                      ),
                      hintText: "Enter state here.....",
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
                    height: 15,
                  ),
                  TextFormField(
                    controller: uPCity,
                    onSaved: (value) {
                      pCity = value!.trim();
                    },
                    validator: MultiValidator([
                      RequiredValidator(errorText: "City  is required!"),
                      MinLengthValidator(2,
                          errorText: "Provide at least two character.")
                    ]),
                    style: TextStyle(
                      color: textColor,
                    ),
                    decoration: InputDecoration(
                      labelText: "City",
                      labelStyle: TextStyle(
                        color: textColor,
                        fontFamily: "Laila-Bold",
                      ),
                      hintText: "Enter city here.....",
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
                    height: 15,
                  ),
                  TextFormField(
                    controller: uPStreet,
                    onSaved: (value) {
                      pStreet = value!.trim();
                    },
                    validator: MultiValidator([
                      RequiredValidator(errorText: "Street  is required!"),
                      MinLengthValidator(2,
                          errorText: "Provide at least two character.")
                    ]),
                    style: TextStyle(
                      color: textColor,
                    ),
                    decoration: InputDecoration(
                      labelText: "Street",
                      labelStyle: TextStyle(
                        color: textColor,
                        fontFamily: "Laila-Bold",
                      ),
                      hintText: "Enter street here.....",
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
                  Text(
                    "Temporary",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: textColor,
                      fontSize: 20,
                      fontFamily: "Laila-Bold",
                      decoration: TextDecoration.underline,
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Country:",
                        style: TextStyle(
                          color: textColor,
                          fontSize: 15,
                          fontFamily: "Laila-Bold",
                        ),
                      ),
                      Row(
                        children: [
                          TextButton(
                            style: TextButton.styleFrom(
                              primary: textColor,
                              side: BorderSide(
                                color: textColor,
                              ),
                              padding: EdgeInsets.fromLTRB(8, 0, 0, 0),
                            ),
                            onPressed: () {
                              showCountryPicker(
                                context: context,
                                showPhoneCode: true,
                                onSelect: (Country country) {
                                  setState(() {
                                    String countryName = "";
                                    List<String> countryDetail =
                                        country.displayName.split(" ");
                                    for (int i = 0;
                                        i < countryDetail.length;
                                        i++) {
                                      if (i < (countryDetail.length - 2)) {
                                        countryName += countryDetail[i] + " ";
                                      }
                                    }
                                    tCountry = countryName.trim();
                                  });
                                },
                              );
                            },
                            child: Row(
                              children: [
                                Text(
                                  tCountry,
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    fontSize: 13,
                                  ),
                                ),
                                Icon(
                                  Icons.arrow_drop_down_sharp,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  SizedBox(
                    height: 10,
                  ),
                  TextFormField(
                    controller: uTState,
                    onSaved: (value) {
                      tState = value!.trim();
                    },
                    validator: MultiValidator([
                      RequiredValidator(errorText: "State  is required!"),
                      MinLengthValidator(2,
                          errorText: "Provide at least two character.")
                    ]),
                    style: TextStyle(
                      color: textColor,
                    ),
                    decoration: InputDecoration(
                      labelText: "State",
                      labelStyle: TextStyle(
                        color: textColor,
                        fontFamily: "Laila-Bold",
                      ),
                      hintText: "Enter state here.....",
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
                    height: 15,
                  ),
                  TextFormField(
                    controller: uTCity,
                    onSaved: (value) {
                      tCity = value!.trim();
                    },
                    validator: MultiValidator([
                      RequiredValidator(errorText: "City  is required!"),
                      MinLengthValidator(2,
                          errorText: "Provide at least two character.")
                    ]),
                    style: TextStyle(
                      color: textColor,
                    ),
                    decoration: InputDecoration(
                      labelText: "City",
                      labelStyle: TextStyle(
                        color: textColor,
                        fontFamily: "Laila-Bold",
                      ),
                      hintText: "Enter city here.....",
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
                    height: 15,
                  ),
                  TextFormField(
                    controller: uTStreet,
                    onSaved: (value) {
                      tStreet = value!.trim();
                    },
                    validator: MultiValidator([
                      RequiredValidator(errorText: "Street  is required!"),
                      MinLengthValidator(2,
                          errorText: "Provide at least two character.")
                    ]),
                    style: TextStyle(
                      color: textColor,
                    ),
                    decoration: InputDecoration(
                      labelText: "Street",
                      labelStyle: TextStyle(
                        color: textColor,
                        fontFamily: "Laila-Bold",
                      ),
                      hintText: "Enter street here.....",
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
                    height: 25,
                  ),
                  ElevatedButton(
                    onPressed: () async {
                      if (_formKey.currentState!.validate()) {
                        _formKey.currentState!.save();

                        if (pCountry == "" || tCountry == "") {
                          return MotionToast.error(
                            position: MOTION_TOAST_POSITION.top,
                            animationType: ANIMATION.fromTop,
                            toastDuration: Duration(seconds: 2),
                            description: "Country not selected.",
                          ).show(context);
                        }

                        final responseData = await HttpConnectAddress().addAddress(
                          AddressRegister(
                              pCountry: pCountry,
                              pState: pState,
                              pCity: pCity,
                              pStreet: pStreet,
                              tCountry: tCountry,
                              tState: tState,
                              tCity: tCity,
                              tStreet: tStreet),
                        );

                        if (responseData["message"] ==
                            "Address has been updated.") {
                          Navigator.pop(context);
                          MotionToast.success(
                            position: MOTION_TOAST_POSITION.top,
                            animationType: ANIMATION.fromTop,
                            toastDuration: Duration(seconds: 2),
                            description: "Address added.",
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
                    height: 20,
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
