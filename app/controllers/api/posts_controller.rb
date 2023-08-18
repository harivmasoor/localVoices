class Api::PostsController < ApplicationController
    before_action :set_post, only: [:show, :update, :destroy]
  
    def index
      @posts = Post.all
    end
  
    def show
    end
  
    def create
      @post = Post.new(post_params)
  
      if @post.save
        render :show
      else
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
      @post = Post.find(params[:id])
    rescue
      render json: ['Post not found'], status: :not_found
    end
  
    def post_params
      params.require(:post).permit(:title, :body)
    end
  end