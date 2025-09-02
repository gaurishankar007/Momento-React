// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'response_f_post.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GetFollowedPosts _$GetFollowedPostsFromJson(Map<String, dynamic> json) =>
    GetFollowedPosts(
      followedPosts: (json['followedPosts'] as List<dynamic>)
          .map((e) => GetPost.fromJson(e as Map<String, dynamic>))
          .toList(),
      liked: (json['liked'] as List<dynamic>).map((e) => e as bool).toList(),
      commented:
          (json['commented'] as List<dynamic>).map((e) => e as bool).toList(),
    );

Map<String, dynamic> _$GetFollowedPostsToJson(GetFollowedPosts instance) =>
    <String, dynamic>{
      'followedPosts': instance.followedPosts.map((e) => e.toJson()).toList(),
      'liked': instance.liked,
      'commented': instance.commented,
    };
