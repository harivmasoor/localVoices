class CreateReplies < ActiveRecord::Migration[7.0]
  def change
    create_table :replies do |t|
      t.text :text, null: false
      t.references :user, foreign_key: true, null: false
      t.references :post, foreign_key: true, null: false
      t.references :comment, foreign_key: true, null: false
      t.timestamps
    end
  end
end
