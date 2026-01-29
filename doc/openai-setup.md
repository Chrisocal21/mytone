# OpenAI API Setup Guide

## Getting Your API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Navigate to API Keys section
4. Click "Create new secret key"
5. Copy the key (you won't be able to see it again!)

## Adding the Key to mytone

1. Open the `.env.local` file in the project root
2. Replace `your_openai_api_key_here` with your actual API key:
   ```
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
   ```
3. Save the file
4. Restart the dev server if it's running

## Troubleshooting

### "OpenAI API key not configured" error
- Make sure you've added the key to `.env.local` (not `.env.example`)
- Restart the dev server after adding the key
- Verify the key starts with `sk-`

### API rate limits
- The app uses `gpt-4o-mini` for cost efficiency
- Monitor your usage at [OpenAI Usage Dashboard](https://platform.openai.com/usage)
- Set up usage limits in your OpenAI account settings

## Cost Considerations

mytone uses GPT-4o-mini which is very cost-effective:
- ~$0.15 per 1M input tokens
- ~$0.60 per 1M output tokens

Typical usage:
- Average email enhancement: ~500 tokens (~$0.0004)
- You can process thousands of texts for a few dollars
