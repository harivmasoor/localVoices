class User < ApplicationRecord
  has_secure_password

  validates :username, 
    uniqueness: true, 
    length: { in: 3..50 }, 
    format: { without: URI::MailTo::EMAIL_REGEXP, message:  "can't be an email" }
  validates :email, 
    uniqueness: true, 
    length: { in: 3..255 }, 
    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :session_token, presence: true, uniqueness: true
  validates :password, length: { in: 6..255 }, allow_nil: true
    # Add this validation for the phone number
  validates :phone_number, 
    allow_nil: true,
    uniqueness: true, 
    numericality: true, 
    length: { is: 10 } # Assuming a 10-digit phone number without country code
  before_validation :ensure_session_token

  has_one_attached :photo
  
  def self.find_by_credentials(credential, password)
    if credential =~ URI::MailTo::EMAIL_REGEXP
      field = :email
    elsif credential =~ /^[0-9]{10}$/  
      field = :phone_number
    else
      field = :username
    end
  
    user = User.find_by(field => credential)
  
    # Debug statements
    puts "Found user: #{user.inspect}"
    puts "Authentication result: #{user&.authenticate(password).inspect}"
  
    user&.authenticate(password)
  end
  

  def reset_session_token!
    self.update!(session_token: generate_unique_session_token)
    self.session_token
  end

  private

  def generate_unique_session_token
    loop do
      token = SecureRandom.base64
      break token unless User.exists?(session_token: token)
    end
  end

  def ensure_session_token
    self.session_token ||= generate_unique_session_token
  end
end

