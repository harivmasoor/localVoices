@comments.each do |comment|
    json.set! comment.id do
        json.extract! comment, :id, :text, :user_id, :post_id, :created_at, :updated_at, :parent_comment_id
        json.username comment.user.username
        json.userPhotoUrl comment.user.photo.attached? ? url_for(comment.user.photo) : nil
        json.commentPhotoUrl comment.photo.attached? ? url_for(comment.photo) : nil
    end
end