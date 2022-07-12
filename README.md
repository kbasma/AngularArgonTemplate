# Website

## Amplify

**Initialize**

- Amplify setup with hosting : Amazon CloudFront and S3

```
 npm i -g @aws-amplify/cli
 amplify init
 amplify add hosting
```

**Pull**

- Pull existing amplify environments

```
amplify pull --appId {appId} --envName {env}
```

**Env**

- View list of available environments

```
amplify env list
```

- Switch between amplify environments (dev/prod)

```
amplify env checkout {env}
```

- Add a new amplify environment

```
amplify env add
```

**Deploy**

- Deploy the checkout environment

```
amplify publish
```

**Reference**

- [Amplify Deploy Cloud Front S3 Hosting : Part 1](https://medium.com/craftsmenltd/publishing-a-react-website-on-aws-with-aws-amplify-and-aws-cloudfront-with-custom-domain-part-1-eb81d3d95b2d)
- [Amplify Deploy Cloud Front S3 Hosting : Part 2](https://medium.com/craftsmenltd/publishing-a-react-website-on-aws-with-aws-amplify-and-aws-cloudfront-with-custom-domain-part-2-4651983f87e)
