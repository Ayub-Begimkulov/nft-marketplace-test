# NFT Marketplace Take-home

A take home assignment for TON.

## Technical Notes

Here are some notes about technical decisions/details of my solution:

1. Caching is implemented on the server using redis. The implementation is pretty basic, we just serve cached data if we have, and cache is expired after TTL is passed. Technically it could be done in a better way by serving old data while cache updates and making sure that only single request updates the cache (using "locks" in redis). But it's only useful to implement in a very high rps apps and it would make code way more complex.

2. Current authorization with ton connect is done on the client. API doesn't check user is really logged in. I could've added a basic check for user address to make sure that user logged in with his wallet. But still it's very easy to get around it. As far as I understood using `ton_proof` is the best solution to make sure that user really owns the wallet address. However, our service is readonly. We don't have any personalization, we don't save any data on the backend. And nfts data that we show is publicly available. So I decided that in this situation `ton_proof` authorization is just an overkill.

3. When parsing notion page, I assume that first table that we meet has nft addresses and they are stored in the first column. Each address is checked for basic validity (format is the same as real addresses), but if there is an addition of the new table at the start of the page, we will get empty list.

4. Some stuff like logging, handling errors and image load fails might be improved, but I think it goes outside of the scope of this task. Also layout is only done for mobile (up to 512px), since mini apps on desktop are used in a phone-like window most of the time.

## Local Development

**Prerequisites:**

Before trying to run project locally make sure that you have tools below installed on your system:

-   `docker` and `docker-compose` (if you use docker desktop, make sure it's opened).
-   `node` (I used v18, anything higher should also work fine) and `npm`.
-   `ngrok` (needed to test our app inside Telegram).

If you are unsure about any of these tools - run `which <tool-name>` (e.g. `which node`) to check if you have it on your machine.

Also make sure that `ngrok` is configured properly with auth token. Read more about it [here](http://ngrok.com/docs/getting-started/).

**Creating Telegram Bot:**

To test the app inside of the Telegram, you also need to create a bot:

-   Go to [@BotFather](https://t.me/botfather)
-   Run `/newbot` command and follow the steps until you get a token for you bot (should look similar to this `4839574812:AAFD39kkdpWt3ywyRZergyOLMaJhac60qc`)

**Setting up repo:**

First of all, we need to clone repo and install all necessary deps:

```bash
# clone the repo
git clone git@github.com:Ayub-Begimkulov/nft-marketplace-test.git

# go to repo directory
cd nft-marketplace-test

# install deps front
cd front
npm install

# install deps back
cd ../back
npm install
```

Then we need to correctly setup environment variables.

Go first to the `back` directory and create `.env` using `.env.example` as a base:

```bash
cd back
cp .env.example .env
```

Then open `.env` file in your editor and fill the value for each variable

```env
BOT_TOKEN=<bot-token> # Token that you got when creating TG bot
NOTION_PAGE_ID=<id> # id of the page where nfts table is located
NOTION_API_KEY=<api-key> # API key of your notion integration
REDIS_URL=redis://localhost:6379 # redis will be started by docker on this url
```

If not sure about notion page id, it could be extracted from page's URL. For instance, for page `https://ton-org.notion.site/TS-Product-take-home-assignment-1745274bd2cf80689ec0dec263902ac8` id would be `1745274bd2cf80689ec0dec263902ac8`.

To get the `NOTION_API_KEY` you should create an integration in notion and add it to your page. For more details please follow [this guide](https://developers.notion.com/docs/create-a-notion-integration#create-your-integration-in-notion).

Ok, now let's switch to the `front` directory and create a `.env` file there:

```bash
cd ../front
cp .env.example .env
```

After that you should have `.env` file with the following content:

```env
VITE_API_URL=
VITE_PROXY_URL=http://localhost:3000
```

No need to customize anything here.

**Running project:**

Now once we installed our deps and set up `.env` file, we can run our project. Go to the root directory of the project (`cd ..` if you still in `front` directory) and run `node run-all.js`. This script will create `ngrok` tunnel, spin up `redis` inside docker container and run frontend and backend applications.

To make sure that everything worked as expected try to go to `http://localhost:3000/api/v1/health` (it should return `{success:true}`) and go to `http://localhost:5173` to make sure that your frontend is also working.

To test the app inside of the Telegram, open a chat with the bot that you've created before and type `/start`. The bot will give you a button to open an app. Also, each time you reran `node run-all.js` command, a new tunnel is created. So make sure to call `/start` again after you've restart the dev script to get a new button with correct url to your app.
