@reactions.each do |reaction|
    json.set! reaction.id do
        json.extract! reaction, :id, :reaction_type, :user_id, :reactable_id, :reactable_type
        json.username reaction.user.username
    end
end