
# Vaccine Alerts Telegram Bot
Provides near realtime updates about available vaccine slots in a given district.

## Available data-sources
*  This bot relies solely upon the Open APIs provided by the Government of India at [Co-WIN Public APIs](https://apisetu.gov.in/public/marketplace/api/cowin)

## Development Requirements
-  **Nodejs** (12 and above)
- **Redis server** - This requirement can also be removed (although not recommended) as this is only for caching the recently sent message so that redundant messages are not sent on consecutive invocations

## Environment variables

| Variable | Description |
| ------ | ------ |
| REDIS_URL | Redis URI redis://:[password]@[host]:[port] |
|DISTRICT_ID|The district id you will get from /v2/admin/location/districts/{state_id} from the Co-WIN Public API|
|BOT_KEY|The Telegram bot API key you get from [@BotFather](https://t.me/botfather)|
|CHAT_ID|The chat id for your Telegram channel. Refer [get the channel id](https://gist.github.com/mraaroncruz/e76d19f7d61d59419002db54030ebe35)

## Deployment
This project can easily be deployed on Heroku, AWS Lambda, Firebase Cloud Functions. When using Heroku Redis change the EVICTION POLICY to volatile-lru. You may create your own Telegram channel with this bot for other districts.

## Join the Mumbai Vaccination channel

[Mumbai Vaccination for all ages](https://t.me/MumbaiVaccineAllAges)
## License

See [LICENSE](LICENSE) for the license. 