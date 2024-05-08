import { escape } from "html-escaper";
import type { AstroSeoProps, OpenGraphMedia } from "../types";

const createMetaTag = (attributes: Record<string, string>): string => {
  const attrs = Object.entries(attributes)
    .map(([key, value]) => `${key}="${escape(value)}"`)
    .join(" ");
  return `<meta ${attrs}>`;
};

const createLinkTag = (attributes: Record<string, string>): string => {
  const attrs = Object.entries(attributes)
    .map(([key, value]) => `${key}="${escape(value)}"`)
    .join(" ");
  return `<link ${attrs}>`;
};

const createOpenGraphTag = (property: string, content: string): string => {
  return createMetaTag({ property: `og:${property}`, content });
};

const buildOpenGraphMediaTags = (
  mediaType: "image" | "video",
  media: ReadonlyArray<OpenGraphMedia>
): string => {
  let tags = "";

  const addTag = (tag: string) => {
    tags += tag + "\n";
  };

  media.forEach((medium) => {
    addTag(createOpenGraphTag(mediaType, medium.url));

    if (medium.alt) {
      addTag(createOpenGraphTag(`${mediaType}:alt`, medium.alt));
    }

    if (medium.secureUrl) {
      addTag(createOpenGraphTag(`${mediaType}:secure_url`, medium.secureUrl));
    }

    if (medium.type) {
      addTag(createOpenGraphTag(`${mediaType}:type`, medium.type));
    }

    if (medium.width) {
      addTag(createOpenGraphTag(`${mediaType}:width`, medium.width.toString()));
    }

    if (medium.height) {
      addTag(
        createOpenGraphTag(`${mediaType}:height`, medium.height.toString())
      );
    }
  });
  return tags;
};

export const buildTags = (config: AstroSeoProps): string => {
  let tagsToRender = "";

  const addTag = (tag: string) => {
    tagsToRender += tag + "\n";
  };

  const addMetaTag = (attributes: Record<string, string>) => {
    addTag(
      `<meta ${Object.entries(attributes)
        .map(([key, value]) => `${key}="${escape(value)}"`)
        .join(" ")} />`
    );
  };

  const addLinkTag = (attributes: Record<string, string>) => {
    addTag(
      `<link ${Object.entries(attributes)
        .map(([key, value]) => `${key}="${escape(value)}"`)
        .join(" ")} />`
    );
  };

  const addOpenGraphTag = (property: string, content: string) => {
    addMetaTag({ property: `og:${property}`, content });
  };

  // Title
  if (config.title) {
    const formattedTitle = config.titleTemplate
      ? config.titleTemplate.replace("%s", config.title)
      : config.title;
    addTag(`<title>${escape(formattedTitle)}</title>`);
  }

  // Description
  if (config.description) {
    addTag(createMetaTag({ name: "description", content: config.description }));
  }

  // Robots: noindex, nofollow, and other robotsProps
  let robotsContent: string[] = [];
  if (typeof config.noindex !== "undefined") {
    robotsContent.push(config.noindex ? "noindex" : "index");
  }

  if (typeof config.nofollow !== "undefined") {
    robotsContent.push(config.nofollow ? "nofollow" : "follow");
  }

  if (config.robotsProps) {
    const {
      nosnippet,
      maxSnippet,
      maxImagePreview,
      noarchive,
      unavailableAfter,
      noimageindex,
      notranslate,
    } = config.robotsProps;

    if (nosnippet) robotsContent.push("nosnippet");
    if (typeof maxSnippet === 'number') robotsContent.push(`max-snippet:${maxSnippet}`);
    if (maxImagePreview)
      robotsContent.push(`max-image-preview:${maxImagePreview}`);
    if (noarchive) robotsContent.push("noarchive");
    if (unavailableAfter)
      robotsContent.push(`unavailable_after:${unavailableAfter}`);
    if (noimageindex) robotsContent.push("noimageindex");
    if (notranslate) robotsContent.push("notranslate");
  }

  if (robotsContent.length > 0) {
    addTag(createMetaTag({ name: "robots", content: robotsContent.join(",") }));
  }

  // Canonical
  if (config.canonical) {
    addTag(createLinkTag({ rel: "canonical", href: config.canonical }));
  }

  // Mobile Alternate
  if (config.mobileAlternate) {
    addTag(
      createLinkTag({
        rel: "alternate",
        media: config.mobileAlternate.media,
        href: config.mobileAlternate.href,
      })
    );
  }

  // Language Alternates
  if (config.languageAlternates && config.languageAlternates.length > 0) {
    config.languageAlternates.forEach((languageAlternate) => {
      addTag(
        createLinkTag({
          rel: "alternate",
          hreflang: languageAlternate.hreflang,
          href: languageAlternate.href,
        })
      );
    });
  }

  // OpenGraph
  if (config.openGraph) {
    const title = config.openGraph?.title || config.title;
    if (title) {
      addTag(createOpenGraphTag("title", title));
    }

    const description = config.openGraph?.description || config.description;
    if (description) {
      addTag(createOpenGraphTag("description", description));
    }

    if (config.openGraph.url) {
      addTag(createOpenGraphTag("url", config.openGraph.url));
    }

    if (config.openGraph.type) {
      addTag(createOpenGraphTag("type", config.openGraph.type));
    }

    if (config.openGraph.images && config.openGraph.images.length) {
      addTag(buildOpenGraphMediaTags("image", config.openGraph.images));
    }

    if (config.openGraph.videos && config.openGraph.videos.length) {
      addTag(buildOpenGraphMediaTags("video", config.openGraph.videos));
    }

    if (config.openGraph.locale) {
      addTag(createOpenGraphTag("locale", config.openGraph.locale));
    }

    if (config.openGraph.site_name) {
      addTag(createOpenGraphTag("site_name", config.openGraph.site_name));
    }

    // Open Graph Profile
    if (config.openGraph.profile) {
      if (config.openGraph.profile.firstName) {
        addTag(
          createOpenGraphTag(
            "profile:first_name",
            config.openGraph.profile.firstName
          )
        );
      }
      if (config.openGraph.profile.lastName) {
        addTag(
          createOpenGraphTag(
            "profile:last_name",
            config.openGraph.profile.lastName
          )
        );
      }
      if (config.openGraph.profile.username) {
        addTag(
          createOpenGraphTag(
            "profile:username",
            config.openGraph.profile.username
          )
        );
      }
      if (config.openGraph.profile.gender) {
        addTag(
          createOpenGraphTag("profile:gender", config.openGraph.profile.gender)
        );
      }
    }

    // Open Graph Book
    if (config.openGraph.book) {
      if (
        config.openGraph.book.authors &&
        config.openGraph.book.authors.length
      ) {
        config.openGraph.book.authors.forEach((author) => {
          addTag(createOpenGraphTag("book:author", author));
        });
      }
      if (config.openGraph.book.isbn) {
        addTag(createOpenGraphTag("book:isbn", config.openGraph.book.isbn));
      }
      if (config.openGraph.book.releaseDate) {
        addTag(
          createOpenGraphTag(
            "book:release_date",
            config.openGraph.book.releaseDate
          )
        );
      }
      if (config.openGraph.book.tags && config.openGraph.book.tags.length) {
        config.openGraph.book.tags.forEach((tag) => {
          addTag(createOpenGraphTag("book:tag", tag));
        });
      }
    }

    // Open Graph Article
    if (config.openGraph.article) {
      if (config.openGraph.article.publishedTime) {
        addTag(
          createOpenGraphTag(
            "article:published_time",
            config.openGraph.article.publishedTime
          )
        );
      }
      if (config.openGraph.article.modifiedTime) {
        addTag(
          createOpenGraphTag(
            "article:modified_time",
            config.openGraph.article.modifiedTime
          )
        );
      }
      if (config.openGraph.article.expirationTime) {
        addTag(
          createOpenGraphTag(
            "article:expiration_time",
            config.openGraph.article.expirationTime
          )
        );
      }
      if (
        config.openGraph.article.authors &&
        config.openGraph.article.authors.length
      ) {
        config.openGraph.article.authors.forEach((author) => {
          addTag(createOpenGraphTag("article:author", author));
        });
      }
      if (config.openGraph.article.section) {
        addTag(
          createOpenGraphTag(
            "article:section",
            config.openGraph.article.section
          )
        );
      }
      if (
        config.openGraph.article.tags &&
        config.openGraph.article.tags.length
      ) {
        config.openGraph.article.tags.forEach((tag) => {
          addTag(createOpenGraphTag("article:tag", tag));
        });
      }
    }

    // Open Graph Video
    if (config.openGraph.video) {
      if (
        config.openGraph.video.actors &&
        config.openGraph.video.actors.length
      ) {
        config.openGraph.video.actors.forEach((actor) => {
          addTag(createOpenGraphTag("video:actor", actor.profile));
          if (actor.role) {
            addTag(createOpenGraphTag("video:actor:role", actor.role));
          }
        });
      }
      if (
        config.openGraph.video.directors &&
        config.openGraph.video.directors.length
      ) {
        config.openGraph.video.directors.forEach((director) => {
          addTag(createOpenGraphTag("video:director", director));
        });
      }
      if (
        config.openGraph.video.writers &&
        config.openGraph.video.writers.length
      ) {
        config.openGraph.video.writers.forEach((writer) => {
          addTag(createOpenGraphTag("video:writer", writer));
        });
      }
      if (config.openGraph.video.duration) {
        addTag(
          createOpenGraphTag(
            "video:duration",
            config.openGraph.video.duration.toString()
          )
        );
      }
      if (config.openGraph.video.releaseDate) {
        addTag(
          createOpenGraphTag(
            "video:release_date",
            config.openGraph.video.releaseDate
          )
        );
      }
      if (config.openGraph.video.tags && config.openGraph.video.tags.length) {
        config.openGraph.video.tags.forEach((tag) => {
          addTag(createOpenGraphTag("video:tag", tag));
        });
      }
      if (config.openGraph.video.series) {
        addTag(
          createOpenGraphTag("video:series", config.openGraph.video.series)
        );
      }
    }
  }

  // Facebook
  if (config.facebook && config.facebook.appId) {
    addTag(
      createMetaTag({ property: "fb:app_id", content: config.facebook.appId })
    );
  }

  // Twitter
  if (config.twitter) {
    if (config.twitter.cardType) {
      addTag(
        createMetaTag({
          name: "twitter:card",
          content: config.twitter.cardType,
        })
      );
    }

    if (config.twitter.site) {
      addTag(
        createMetaTag({ name: "twitter:site", content: config.twitter.site })
      );
    }

    if (config.twitter.handle) {
      addTag(
        createMetaTag({
          name: "twitter:creator",
          content: config.twitter.handle,
        })
      );
    }
  }

  // Additional Meta Tags
  if (config.additionalMetaTags && config.additionalMetaTags.length > 0) {
    config.additionalMetaTags.forEach((metaTag) => {
      const attributes: Record<string, string> = {
        content: metaTag.content,
      };

      if ("name" in metaTag && metaTag.name) {
        attributes.name = metaTag.name;
      } else if ("property" in metaTag && metaTag.property) {
        attributes.property = metaTag.property;
      } else if ("httpEquiv" in metaTag && metaTag.httpEquiv) {
        attributes["http-equiv"] = metaTag.httpEquiv;
      }

      addTag(createMetaTag(attributes));
    });
  }

  // Additional Link Tags
  if (config.additionalLinkTags && config.additionalLinkTags.length > 0) {
    config.additionalLinkTags.forEach((linkTag) => {
      const attributes: Record<string, string> = {
        rel: linkTag.rel,
        href: linkTag.href,
      };

      if (linkTag.sizes) {
        attributes.sizes = linkTag.sizes;
      }
      if (linkTag.media) {
        attributes.media = linkTag.media;
      }
      if (linkTag.type) {
        attributes.type = linkTag.type;
      }
      if (linkTag.color) {
        attributes.color = linkTag.color;
      }
      if (linkTag.as) {
        attributes.as = linkTag.as;
      }
      if (linkTag.crossOrigin) {
        attributes.crossorigin = linkTag.crossOrigin;
      }

      addTag(createLinkTag(attributes));
    });
  }

  return tagsToRender.trim();
};
