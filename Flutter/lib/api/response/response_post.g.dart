
part of 'response_post.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GetPost _$GetPostFromJson(Map<String, dynamic> json) => GetPost(
      id: json['_id'] as String?,
      user_id: (json['user_id'] as Map<String, dynamic>?)?.map(
        (k, e) => MapEntry(k, e as String),
      ),
      caption: json['caption'] as String?,
      description: json['description'] as String?,
      attach_file: (json['attach_file'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      tag_friend: (json['tag_friend'] as List<dynamic>?)
          ?.map((e) => Map<String, String>.from(e as Map))
          .toList(),
      like_num: json['like_num'] as int?,
      comment_num: json['comment_num'] as int?,
      report_num: json['report_num'] as int?,
    );

Map<String, dynamic> _$GetPostToJson(GetPost instance) => <String, dynamic>{
      '_id': instance.id,
      'user_id': instance.user_id,
      'caption': instance.caption,
      'description': instance.description,
      'attach_file': instance.attach_file,
      'tag_friend': instance.tag_friend,
      'like_num': instance.like_num,
      'comment_num': instance.comment_num,
      'report_num': instance.report_num,
    };
