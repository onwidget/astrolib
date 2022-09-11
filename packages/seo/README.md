# Astro SEO - @astrolib/seo

`Astro SEO` is an integration that makes managing your SEO easier in Astro projects. It is fully based on the excellent [Next SEO](https://github.com/garmeeh/next-seo) library

## Usage

`Astro SEO` works by including it on pages where you would like SEO attributes to be added. Once included on the page you pass it a configuration object with the page's SEO properties. This can be dynamically generated at a page level or in some cases your API may return an SEO object.

### Setup

First, install it:

```bash
npm install @astrolib/seo
```

or

```bash
yarn add @astrolib/seo
```

### Add SEO to Page

Then you need to import `@astrolib/seo` and add the desired properties. This will render out the tags in the `<head>` for SEO. At a bare minimum, you should add a title and description.

**Example with just title and description:**

```astro
---
import { AstroSeo } from '@astrolib/seo';
---

<AstroSeo
  title="Simple Usage Example"
  description="A short description goes here."
/>
```

But `Astro SEO` gives you many more options that you can add. See below for a typical example of a page.

**Typical page example:**

```astro
---
import { AstroSeo } from '@astrolib/seo';
---

<AstroSeo
  title="Using More of Config"
  description="This example uses more of the available config options."
  canonical="https://www.canonical.ie/"
  openGraph={{
    url: 'https://www.url.ie/a',
    title: 'Open Graph Title',
    description: 'Open Graph Description',
    images: [
      {
        url: 'https://www.example.ie/og-image-01.jpg',
        width: 800,
        height: 600,
        alt: 'Og Image Alt',
        type: 'image/jpeg',
      },
      {
        url: 'https://www.example.ie/og-image-02.jpg',
        width: 900,
        height: 800,
        alt: 'Og Image Alt Second',
        type: 'image/jpeg',
      },
      { url: 'https://www.example.ie/og-image-03.jpg' },
      { url: 'https://www.example.ie/og-image-04.jpg' },
    ],
    site_name: 'SiteName',
  }}
  twitter={{
    handle: '@handle',
    site: '@site',
    cardType: 'summary_large_image',
  }}
/>
```

### Options

| Property                           | Type                    | Description                                                                                                                                                                          |
| ---------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `titleTemplate`                    | string                  | Allows you to set default title template that will be added to your title                                                                                |
| `title`                            | string                  | Set the meta title of the page                                                                                                                                                       |
| `defaultTitle`                     | string                  | If no title is set on a page, this string will be used instead of an empty `titleTemplate` [More Info](#default-title)                                                               |
| `noindex`                          | boolean (default false) | Sets whether page should be indexed or not                                                                                                                     |
| `nofollow`                         | boolean (default false) | Sets whether page should be followed or not                                                                                                                   |
| `robotsProps`                      | Object                  | Set the more meta information for the `X-Robots-Tag`                                                                                                        |
| `description`                      | string                  | Set the page meta description                                                                                                                                                        |
| `canonical`                        | string                  | Set the page canonical url                                                                                                                                                           |
| `mobileAlternate.media`            | string                  | Set what screen size the mobile website should be served from                                                                                                                        |
| `mobileAlternate.href`             | string                  | Set the mobile page alternate url                                                                                                                                                    |
| `languageAlternates`               | array                   | Set the language of the alternate urls. Expects array of objects with the shape: `{ hrefLang: string, href: string }`                                                                |
| `additionalMetaTags`               | array                   | Allows you to add a meta tag that is not documented here.                                                                                          |
| `additionalLinkTags`               | array                   | Allows you to add a link tag that is not documented here.                                                                                          |
| `twitter.cardType`                 | string                  | The card type, which will be one of `summary`, `summary_large_image`, `app`, or `player`                                                                                             |
| `twitter.site`                     | string                  | @username for the website used in the card footer                                                                                                                                    |
| `twitter.handle`                   | string                  | @username for the content creator / author (outputs as `twitter:creator`)                                                                                                            |
| `facebook.appId`                   | string                  | Used for Facebook Insights, you must add a facebook app ID to your page to for it [More Info](#facebook)                                                                             |
| `openGraph.url`                    | string                  | The canonical URL of your object that will be used as its permanent ID in the graph                                                                                                  |
| `openGraph.type`                   | string                  | The type of your object. Depending on the type you specify, other properties may also be required [More Info](#open-graph)                                                           |
| `openGraph.title`                  | string                  | The open graph title, this can be different than your meta title.                                                                                                                    |
| `openGraph.description`            | string                  | The open graph description, this can be different than your meta description.                                                                                                        |
| `openGraph.images`                 | array                   | An array of images (object) to be used by social media platforms, slack etc as a preview. If multiple supplied you can choose one when sharing.  |
| `openGraph.videos`                 | array                   | An array of videos (object)                                                                                                                                                          |
| `openGraph.locale`                 | string                  | The locale the open graph tags are marked up in. Of the format language_TERRITORY. Default is en_US.                                                                                 |
| `openGraph.site_name`              | string                  | If your object is part of a larger web site, the name which should be displayed for the overall site.                                                                                |
| `openGraph.profile.firstName`      | string                  | Person's first name.                                                                                                                                                                 |
| `openGraph.profile.lastName`       | string                  | Person's last name.                                                                                                                                                                  |
| `openGraph.profile.username`       | string                  | Person's username.                                                                                                                                                                   |
| `openGraph.profile.gender`         | string                  | Person's gender.                                                                                                                                                                     |
| `openGraph.book.authors`           | string[]                | Writers of the article.                                                                                                                          |
| `openGraph.book.isbn`              | string                  | The [ISBN](https://en.wikipedia.org/wiki/International_Standard_Book_Number)                                                                                                         |
| `openGraph.book.releaseDate`       | datetime                | The date the book was released.                                                                                                                                                      |
| `openGraph.book.tags`              | string[]                | Tag words associated with this book.                                                                                                                                                 |
| `openGraph.article.publishedTime`  | datetime                | When the article was first published.                                                                                                            |
| `openGraph.article.modifiedTime`   | datetime                | When the article was last changed.                                                                                                                                                   |
| `openGraph.article.expirationTime` | datetime                | When the article is out of date after.                                                                                                                                               |
| `openGraph.article.authors`        | string[]                | Writers of the article.                                                                                                                                                              |
| `openGraph.article.section`        | string                  | A high-level section name. E.g. Technology                                                                                                                                           |
| `openGraph.article.tags`           | string[]                | Tag words associated with this article.                                                                                                                                              |