import 'dart:io';

class AddPost {
  String? caption;
  String? description;
  List<File>? images;
  List<String>? taggedFriend;

  AddPost({this.caption, this.description, this.images, this.taggedFriend});
}

class UpdatedPost {
  String? post_id;
  String? caption;
  String? description;
  List<String>? taggedFriend;

  UpdatedPost({this.post_id, this.caption, this.description, this.taggedFriend});
}
