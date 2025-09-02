import 'package:floor/floor.dart';

@entity
class OfflinePost {
  @PrimaryKey()
  final String id;

  final String postUser;
  final bool liked;
  final int liker;
  final int commenter;
  final String caption;
  final String description;
  final bool commented;
  final String comment;

  OfflinePost({
    required this.id,
    required this.postUser,
    required this.liked,
    required this.liker,
    required this.commenter,
    required this.caption,
    required this.description,
    required this.commented,
    required this.comment,
  });
}
