import 'package:assignment/floor/database/database.dart';

class DatabaseInstance {
  static DatabaseInstance? _instance;

  DatabaseInstance._();
  static DatabaseInstance get instance => _instance ??= DatabaseInstance._();

  Future<AppDatabase> getDatabaseInstance() {
    return $FloorAppDatabase.databaseBuilder('my_database.db').build();
  }
}
