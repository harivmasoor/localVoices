class Api::ReactionsController < ApplicationController
  wrap_parameters include: Reaction.attribute_names + ['reactionType', 'reactableType', 'reactableId', 'userId']
  
# In your ReactionsController
def index
    @reactions = current_user.reactions
    render :index
end
def create
    
    # If a reaction by this user exists, remove it before adding a new one
    
    @reaction = Reaction.new(reaction_params)
    
    if @reaction.save!
        render :show
    else
        render json: @reaction.errors.full_messages, status: 422
    end
end

def destroy
    @reaction = Reaction.find_by(id: params[:id], user: current_user)
    if @reaction&.destroy
        render json: { id: params[:id] }
    else
        render json: { error: 'Reaction not found or not allowed' }, status: 404
    end
end

  
    private
  
    def reaction_params
      params.require(:reaction).permit(:reaction_type, :reactable_type, :reactable_id, :user_id)
    end
        
    
  end
  
  