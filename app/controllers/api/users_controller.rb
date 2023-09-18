class Api::UsersController < ApplicationController
  wrap_parameters include: User.attribute_names + ['password']

  def create
    @user = User.new(user_params)

    if @user.save
      login!(@user)
      render :show
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end
  def update
    @user = User.find(params[:id])
    if @user.update(user_params)
      render :show
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end
    # Add this show action
    def show
      @user = User.find_by(username: params[:id])
      if @user
        render :show
      else
        render json: ["User not found"], status: 404
      end
    end
    def search
      if params[:query]
        @users = User.where('username ILIKE ?', "%#{params[:query]}%").limit(5).order(created_at: :desc)
        render :search_results
      else
        @users = User.limit(5).order(created_at: :desc)
        render :search_results
      end
    end
    
    
  
  private

  def user_params
    params.require(:user).permit(:email, :username, :password, :phone_number, :photo)
  end
end
