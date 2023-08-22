json.array! @posts do |post|
  json.extract! post, :id, :title, :body, :user_id, :created_at, :updated_at
  json.userPhotoUrl post.user.photo.attached? ? url_for(post.user.photo) : nil
  json.username post.user.username
  json.commment_count post.comments.length
  json.reaction_count post.reactions.length
end