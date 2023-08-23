class AddCascadeDeleteToComments < ActiveRecord::Migration[7.0]
  def change
    remove_foreign_key :comments, column: :parent_comment_id
    add_foreign_key :comments, :comments, column: :parent_comment_id, on_delete: :cascade
  end
end
