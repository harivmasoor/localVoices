# Existing post information
json.post do
    json.extract! @post, :id, :title, :body, :user_id, :created_at, :updated_at
    json.photoUrl @post.photo.attached? ? url_for(@post.photo) : nil
    json.userPhotoUrl @post.user.photo.attached? ? url_for(@post.user.photo) : nil
    json.username @post.user.username
    json.num_likes @post.reactions.where(reaction_type: 'like').count
  end
  
  # Extracted comments
  json.comments do
    @post.comments.each do |comment|
      json.set! comment.id do
        json.extract! comment, :id, :text, :user_id, :post_id, :created_at, :updated_at, :parent_comment_id
        json.username comment.user.username
        json.userPhotoUrl comment.user.photo.attached? ? url_for(comment.user.photo) : nil
      end
    end
  end
  
  # Reactions for the post
  json.reactions do
    @post.reactions.each do |reaction|
      json.set! reaction.id do
        json.extract! reaction, :id, :reaction_type, :user_id, :reactable_id, :reactable_type
        json.username reaction.user.username
      end
    end
  end
  

