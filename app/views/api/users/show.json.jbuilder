json.user do
  json.extract! @user, :id, :email, :username, :phone_number, :created_at, :updated_at
end

json.photo_url @user.photo.attached? ? url_for(@user.photo) : nil