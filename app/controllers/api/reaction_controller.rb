class Api::ReactionsController < ApplicationController
    before_action :set_reactable
  
# In your ReactionsController

def create
    existing_reaction = @reactable.reactions.find_by(user: current_user)
    
    # If a reaction by this user exists, remove it before adding a new one
    existing_reaction&.destroy
    
    @reaction = @reactable.reactions.new(reaction_params)
    @reaction.user = current_user
    
    if @reaction.save
        render :show
    else
        render json: @reaction.errors.full_messages, status: 422
    end
end

def destroy
    @reaction = @reactable.reactions.find_by(id: params[:id], user: current_user)
    if @reaction&.destroy
        render json: { id: params[:id] }
    else
        render json: { error: 'Reaction not found or not allowed' }, status: 404
    end
end

  
    private
  
    def set_reactable
      if params[:post_id]
        @reactable = Post.find(params[:post_id])
      elsif params[:comment_id]
        @reactable = Comment.find(params[:comment_id])
      else
        render json: { error: 'Reactable not found' }, status: 404
      end
    end
  
    def reaction_params
      params.require(:reaction).permit(:reaction_type)
    end
  end
  
  