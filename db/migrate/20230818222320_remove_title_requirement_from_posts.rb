class RemoveTitleRequirementFromPosts < ActiveRecord::Migration[7.0]
  def change
    change_column_null :posts, :title, true
  end
end
