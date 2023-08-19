class Api::PostsController < ApplicationController
    before_action :set_post, only: [:show, :update, :destroy]
  
    def index
      @posts = Post.all
      render json: @posts
    end
  
    def show
    end
  
    def create
      @post = Post.new(post_params)
      @post.user_id = current_user.id
      if @post.save
        render :show
      else
        puts (@post.errors.full_messages)
        render json: @post.errors.full_messages, status: 422
      end
    end
  
    def update
      if @post.update(post_params)
        render :show
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
      puts "Current User ID: #{current_user.id}" # Log current user ID
      puts "Trying to fetch post with ID: #{params[:id]}" # Log the post ID
      @post = current_user.posts.find(params[:id])
    rescue
      puts "Error: Couldn't find post with ID #{params[:id]} for user #{current_user.id}"
      render json: ['Post not found or not authorized'], status: :not_found
    end
    
  
    def post_params
      params.require(:post).permit(:title, :body, :user_id)
    end
  end