class UserRegister {
  final String? username;
  final String? password;
  final String? email;
  final String? phone;

  UserRegister({this.username, this.password, this.email, this.phone});
}

class UserLogin {
  final String? usernameEmail;
  final String? password;

  UserLogin({this.usernameEmail, this.password});
}

class PersonalInfoRegister {
  final String? firstName;
  final String? lastName;
  final String? gender;
  final String? birthDate;
  final String? biography;

  PersonalInfoRegister(
      {this.firstName,
      this.lastName,
      this.gender,
      this.birthDate,
      this.biography});
}

class AddressRegister {
  final String? pCountry;
  final String? pState;
  final String? pCity;
  final String? pStreet;
  final String? tCountry;
  final String? tState;
  final String? tCity;
  final String? tStreet;

  AddressRegister({
    this.pCountry,
    this.pState,
    this.pCity,
    this.pStreet,
    this.tCountry,
    this.tState,
    this.tCity,
    this.tStreet,
  });
}

class passResetToken {
  final String? email;
  final String? newPassword;

  passResetToken({this.email, this.newPassword});
}

class ChangePassword {
  final String? currentPassword;
  final String? newPassword;

  ChangePassword({this.currentPassword, this.newPassword});
}