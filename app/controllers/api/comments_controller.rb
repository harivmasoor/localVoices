class Api::CommentsController < ApplicationController
  wrap_parameters include: Comment.attribute_names + ['userId', 'postId', 'parentCommentId']

  def all_comments
    @comments = Comment.includes(:user, :post)
    render 'api/comments/all_comments'
  end

  def index
    @post = Post.find(params[:post_id])
    if @post
      @comments = @post.comments.includes(:user, :post)
      render 'api/comments/index'
    else
      render json: @post.errors.full_messages, status: 422
    end
  end

  def create
    @comment = Comment.new(comment_params)
    @comment.user_id = current_user.id
    Rails.logger.info "Comment before save: #{@comment.inspect}"
    if @comment.save
      @post = Post.find(@comment.post_id)
      render 'api/comments/show'
    else
      render json: @comment.errors.full_messages, status: 422
    end
  end

  def update
    @comment = Comment.find(params[:id])
    
    # Ensure that only the comment's author can update it
    if @comment.user_id == current_user.id
      if @comment.update(comment_params)
        render 'api/comments/show'
      else
        render json: @comment.errors.full_messages, status: 422
      end
    else
      render json: ["You don't have permission to edit this comment"], status: 403
    end
  end

  def destroy
    @comment = Comment.find(params[:id])
    if @comment.destroy
      render json: { id: params[:id] }
    else
      render json: @comment.errors.full_messages, status: 422
    end
  end

  private

  def comment_params
    params.require(:comment).permit(:text, :user_id, :post_id, :parent_comment_id, :photo)
  end
end

  