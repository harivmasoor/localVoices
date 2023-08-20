json.array! @posts do |post|
  json.extract! post, :id, :title, :body, :user_id, :created_at, :updated_at
  json.userPhotoUrl post.user.photo.attached? ? url_for(post.user.photo) : nil
  
  json.comments post.comments do |comment|
    json.extract! comment, :id, :text, :user_id, :created_at, :updated_at
    json.username comment.user.username
    json.userPhotoUrl comment.user.photo.attached? ? url_for(comment.user.photo) : nil
  end
end