class Api::CommentsController < ApplicationController
    def index
        @post = Post.find(params[:post_id])
        @comments = @post.comments
  
        render json: @comments
      end
      
    def create
      @comment = Comment.new(comment_params)
      @comment.user_id = current_user.id
      @comment.post_id = params[:post_id]
      Rails.logger.info "Comment before save: #{@comment.inspect}"
      if @comment.save
        @post = Post.find(@comment.post_id)
        render 'api/posts/show'
      else
        render json: @comment.errors.full_messages, status: 422
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
      params.require(:comment).permit(:text, :user_id, :post_id)
    end
  end
  