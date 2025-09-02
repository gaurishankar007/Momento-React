import 'dart:async';
import 'package:assignment/floor/dao/offline_posts_dao.dart';
import 'package:assignment/floor/entity/offline_posts.dart';
import 'package:floor/floor.dart';
import 'package:sqflite/sqflite.dart' as sqflite;

part 'database.g.dart';

@Database(version: 1, entities: [OfflinePost])
abstract class AppDatabase extends FloorDatabase {
  OfflinePostDao get offlinePostDao;
}
