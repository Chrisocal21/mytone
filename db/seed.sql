-- Insert a default user for development
INSERT INTO users (id, email, name, onboarding_completed, learning_progress_score)
VALUES ('user_chris', 'chris@example.com', 'Chris O''Connell', TRUE, 0);

-- Insert user profile
INSERT INTO user_profiles (
  id, 
  user_id, 
  communication_style, 
  formality_level, 
  explanation_preference,
  role_context,
  signature_style,
  preferred_phrases,
  avoided_phrases
)
VALUES (
  'profile_chris',
  'user_chris',
  'Direct & Concise',
  'Professional but Friendly',
  'Brief & To-the-point',
  'Product Manager',
  'Cheers,\nChris O''Connell',
  '[]',
  '[]'
);
