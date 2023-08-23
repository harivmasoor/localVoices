class Comment < ApplicationRecord
    belongs_to :user
    belongs_to :post
    has_many :reactions, as: :reactable, dependent: :destroy
    has_many :child_comments, class_name: "Comment", foreign_key: "parent_comment_id", dependent: :destroy
  belongs_to :parent_comment, class_name: "Comment", optional: true
  
    validates :text, presence: true
  end