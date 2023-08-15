json.user do
  json.extract! @user, :id, :email, :username, :phone_number, :created_at, :updated_at
end
