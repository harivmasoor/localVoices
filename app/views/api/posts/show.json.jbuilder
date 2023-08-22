json.post do
    json.extract! @post, :id, :title, :body, :user_id, :created_at, :updated_at
    json.userPhotoUrl @post.user.photo.attached? ? url_for(@post.user.photo) : nil
    json.username @post.user.username
end

json.comments do
    @post.comments.each do |comment|
        json.set! comment.id do
            json.extract! comment, :id, :text, :user_id, :post_id, :created_at, :updated_at, :parent_comment_id
            json.username comment.user.username
            json.userPhotoUrl comment.user.photo.attached? ? url_for(comment.user.photo) : nil
        end
    end
end

