class Comment < ApplicationRecord
    belongs_to :user
    belongs_to :post
    has_many :reactions, as: :reactable, dependent: :destroy

  
    validates :text, presence: true
  end