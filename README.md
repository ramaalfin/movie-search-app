# Movie Search App

A React Native CLI starter project for the Movie Search App assignment.

## Setup

### Prerequisites

- Node.js >= 22
- Yarn
- React Native development environment ([Setup Guide](https://reactnative.dev/docs/set-up-your-environment))
- TMDB API key (free at https://developer.themoviedb.org/)

### Installation

```bash
# 1. Install dependencies
yarn install

# 2. Configure API key
cp .env.example .env
# Edit .env and add your TMDB API key

# 3. Install iOS pods (macOS only)
cd ios && bundle install && bundle exec pod install && cd ..

# 4. Run the app
yarn ios     # or
yarn android
```
