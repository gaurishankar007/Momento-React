// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'database.dart';

// **************************************************************************
// FloorGenerator
// **************************************************************************

// ignore: avoid_classes_with_only_static_members
class $FloorAppDatabase {
  /// Creates a database builder for a persistent database.
  /// Once a database is built, you should keep a reference to it and re-use it.
  static _$AppDatabaseBuilder databaseBuilder(String name) =>
      _$AppDatabaseBuilder(name);

  /// Creates a database builder for an in memory database.
  /// Information stored in an in memory database disappears when the process is killed.
  /// Once a database is built, you should keep a reference to it and re-use it.
  static _$AppDatabaseBuilder inMemoryDatabaseBuilder() =>
      _$AppDatabaseBuilder(null);
}

class _$AppDatabaseBuilder {
  _$AppDatabaseBuilder(this.name);

  final String? name;

  final List<Migration> _migrations = [];

  Callback? _callback;

  /// Adds migrations to the builder.
  _$AppDatabaseBuilder addMigrations(List<Migration> migrations) {
    _migrations.addAll(migrations);
    return this;
  }

  /// Adds a database [Callback] to the builder.
  _$AppDatabaseBuilder addCallback(Callback callback) {
    _callback = callback;
    return this;
  }

  /// Creates the database and initializes it.
  Future<AppDatabase> build() async {
    final path = name != null
        ? await sqfliteDatabaseFactory.getDatabasePath(name!)
        : ':memory:';
    final database = _$AppDatabase();
    database.database = await database.open(
      path,
      _migrations,
      _callback,
    );
    return database;
  }
}

class _$AppDatabase extends AppDatabase {
  _$AppDatabase([StreamController<String>? listener]) {
    changeListener = listener ?? StreamController<String>.broadcast();
  }

  OfflinePostDao? _offlinePostDaoInstance;

  Future<sqflite.Database> open(String path, List<Migration> migrations,
      [Callback? callback]) async {
    final databaseOptions = sqflite.OpenDatabaseOptions(
      version: 1,
      onConfigure: (database) async {
        await database.execute('PRAGMA foreign_keys = ON');
        await callback?.onConfigure?.call(database);
      },
      onOpen: (database) async {
        await callback?.onOpen?.call(database);
      },
      onUpgrade: (database, startVersion, endVersion) async {
        await MigrationAdapter.runMigrations(
            database, startVersion, endVersion, migrations);

        await callback?.onUpgrade?.call(database, startVersion, endVersion);
      },
      onCreate: (database, version) async {
        await database.execute(
            'CREATE TABLE IF NOT EXISTS `OfflinePost` (`id` TEXT NOT NULL, `postUser` TEXT NOT NULL, `liked` INTEGER NOT NULL, `liker` INTEGER NOT NULL, `commenter` INTEGER NOT NULL, `caption` TEXT NOT NULL, `description` TEXT NOT NULL, `commented` INTEGER NOT NULL, `comment` TEXT NOT NULL, PRIMARY KEY (`id`))');

        await callback?.onCreate?.call(database, version);
      },
    );
    return sqfliteDatabaseFactory.openDatabase(path, options: databaseOptions);
  }

  @override
  OfflinePostDao get offlinePostDao {
    return _offlinePostDaoInstance ??=
        _$OfflinePostDao(database, changeListener);
  }
}

class _$OfflinePostDao extends OfflinePostDao {
  _$OfflinePostDao(this.database, this.changeListener)
      : _queryAdapter = QueryAdapter(database),
        _offlinePostInsertionAdapter = InsertionAdapter(
            database,
            'OfflinePost',
            (OfflinePost item) => <String, Object?>{
                  'id': item.id,
                  'postUser': item.postUser,
                  'liked': item.liked ? 1 : 0,
                  'liker': item.liker,
                  'commenter': item.commenter,
                  'caption': item.caption,
                  'description': item.description,
                  'commented': item.commented ? 1 : 0,
                  'comment': item.comment
                });

  final sqflite.DatabaseExecutor database;

  final StreamController<String> changeListener;

  final QueryAdapter _queryAdapter;

  final InsertionAdapter<OfflinePost> _offlinePostInsertionAdapter;

  @override
  Future<void> deletePosts() async {
    await _queryAdapter.queryNoReturn('Delete From OfflinePost');
  }

  @override
  Future<List<OfflinePost>> getPosts() async {
    return _queryAdapter.queryList('Select * From OfflinePost',
        mapper: (Map<String, Object?> row) => OfflinePost(
            id: row['id'] as String,
            postUser: row['postUser'] as String,
            liked: (row['liked'] as int) != 0,
            liker: row['liker'] as int,
            commenter: row['commenter'] as int,
            caption: row['caption'] as String,
            description: row['description'] as String,
            commented: (row['commented'] as int) != 0,
            comment: row['comment'] as String));
  }

  @override
  Future<List<int>> savePosts(List<OfflinePost> posts) {
    return _offlinePostInsertionAdapter.insertListAndReturnIds(
        posts, OnConflictStrategy.abort);
  }
}