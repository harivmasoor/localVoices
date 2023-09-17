class Reaction < ApplicationRecord
    belongs_to :user
    belongs_to :reactable, polymorphic: true
    # validates :user_id, uniqueness: { scope: [:reactable_type, :reactable_id], message: "has already reacted to this item" }
  end
  