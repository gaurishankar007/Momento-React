import 'package:assignment/api/response/response_post.dart';
import 'package:json_annotation/json_annotation.dart';

part 'response_f_post.g.dart';

@JsonSerializable(explicitToJson: true)
class GetFollowedPosts {
  final List<GetPost> followedPosts;
  final List<bool> liked;
  final List<bool> commented;

  GetFollowedPosts({required this.followedPosts, required this.liked, required this.commented});

  factory GetFollowedPosts.fromJson(Map<String, dynamic> json) =>
      _$GetFollowedPostsFromJson(json);

  Map<String, dynamic> toJson() => _$GetFollowedPostsToJson(this);
}
