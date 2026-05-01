# Google Play Service Account

Place the Google Play service account JSON key at:

```text
credentials/google-play-service-account.json
```

This file is intentionally ignored by git because it is a private credential.

Download the key from Google Cloud/Play Console, then run:

```sh
npx eas submit --platform android --profile production
```
