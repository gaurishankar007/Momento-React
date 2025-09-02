import 'package:assignment/floor/entity/offline_posts.dart';
import 'package:floor/floor.dart';

@dao
abstract class OfflinePostDao {
  @insert
  Future<List<int>> savePosts(List<OfflinePost> posts);

  @Query("Delete From OfflinePost")
  Future<void> deletePosts();

  @Query("Select * From OfflinePost")
  Future<List<OfflinePost>> getPosts();
}

