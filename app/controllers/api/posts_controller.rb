class Api::PostsController < ApplicationController
  wrap_parameters include: Post.attribute_names + ['userId']
    before_action :set_post, only: [:show, :update, :destroy]
  
    def index
      @posts = Post.all
      render 'api/posts/index'
    end
  
    def show
      render 'api/posts/show'
    end
  
    def create
      @post = Post.new(post_params)
      @post.user_id = current_user.id
      if @post.save
        render 'api/posts/show'
      else
        puts (@post.errors.full_messages)
        render json: @post.errors.full_messages, status: 422
      end
    end
  
    def update
      if @post.update(post_params)
        render 'api/posts/show'
      else
        render json: @post.errors.full_messages, status: 422
      end
    end
  
    def destroy
      @post.destroy
      head :no_content # return header only
    end
  
    private
  
    def set_post
      # puts "Current User ID: #{current_user.id}" # Log current user ID
      # puts "Trying to fetch post with ID: #{params[:id]}" # Log the post ID
      @post = current_user.posts.find(params[:id])
    rescue
      # puts "Error: Couldn't find post with ID #{params[:id]} for user #{current_user.id}"
      render json: ['Post not found or not authorized'], status: :not_found
    end
    
  
    def post_params
      params.require(:post).permit(:title, :body, :user_id)
    end
  end