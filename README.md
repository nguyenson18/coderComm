# CoderComm Frontend

A demo application for teaching the FTW course at CoderSchool.

## Get Started

- Register for a [Cloudinary](https://cloudinary.com/) account. And create a **unsigned** upload preset: https://cloudinary.com/documentation/upload_presets

- Create `/.env`:

```
REACT_APP_BACKEND_API="http://localhost:5001/api"
REACT_APP_CLOUDINARY_CLOUD_NAME = 'dc35areud'
REACT_APP_CLOUDINARY_UPLOAD_PRESET = 'facebook_clone'
NEXT_PUBLIC_SOCKET_URL ="http://localhost:5002"
```

The upload preset of your cloudinary should be **unsigned**.

- Run `npm install`

The demo app is running on: https://codercomm-dot-cs-platform-306304.et.r.appspot.com
