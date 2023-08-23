class Api::ReactionsController < ApplicationController
    wrap_parameters include: Reaction.attribute_names + ['reactionType', 'reactableType', 'reactableId', 'userId']
  
    def index
      @reactions = current_user.reactions
      render :index
    end
  
    def create
      # Setting user_id from the current_user
      reaction_attributes = reaction_params.merge(user_id: current_user.id)
      
      @reaction = Reaction.new(reaction_attributes)
  
      
      if @reaction.save
        render :show
      else
        render json: @reaction.errors.full_messages, status: 422
      end
    end
  
    def update
      @reaction = Reaction.find_by(id: params[:id], user: current_user)
  
      if @reaction
        if @reaction.update(reaction_params)
          render :show
        else
          render json: @reaction.errors.full_messages, status: 422
        end
      else
        render json: { error: 'Reaction not found or not allowed' }, status: 404
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
      params.require(:reaction).permit(:reaction_type, :reactable_type, :reactable_id)
    end
  end
  
  
  