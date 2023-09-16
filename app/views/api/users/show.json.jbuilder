json.user do
  json.extract! @user, :id, :email, :username, :phone_number, :created_at, :updated_at
  json.photo_url @user.photo.attached? ? url_for(@user.photo) : nil
  
  json.posts @user.posts do |post|
    json.extract! post, :id, :body, :created_at
    json.photo_url post.photo.attached? ? url_for(post.photo) : nil
  end
  
  json.comments @user.comments do |comment|
    json.extract! comment, :id, :text, :post_id, :created_at
    json.photo_url comment.photo.attached? ? url_for(comment.photo) : nil
  end
  
  json.reactions @user.reactions do |reaction|
    json.extract! reaction, :id, :reactionType, :reactableType, :reactableId
  end
end

