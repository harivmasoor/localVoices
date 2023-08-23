class Post < ApplicationRecord
    belongs_to :user
    has_many :comments, dependent: :destroy
    has_many :reactions, as: :reactable, dependent: :destroy
    has_one_attached :photo

end