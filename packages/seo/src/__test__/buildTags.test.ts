import { buildTags } from "../utils/buildTags";
import { HtmlValidate as _HtmlValidate } from "html-validate/node";

const validate = new _HtmlValidate();

describe("buildTags function", () => {
  it("should return an empty string if no config is provided", () => {
    const result = buildTags({});
    expect(result).toBe("");
  });

  it("should handle null or undefined values gracefully", () => {
    const config = {
      title: null,
      description: undefined,
    };
    // @ts-ignore
    const result = buildTags(config);
    expect(result).not.toContain("null");
    expect(result).not.toContain("undefined");
  });

  it("should escape special characters correctly", async () => {
    const config = {
      title: "Title & Description",
    };
    const result = buildTags(config);
    expect(result).toContain("Title &amp; Description");

    const htmlResult = await validate.validateString(result);
    expect(htmlResult.valid).toBe(true);
  });

  it("should generate correct title tag", async () => {
    const config = {
      title: '<script>alert("hacked")</script>',
    };
    const result = buildTags(config);
    expect(result).toContain(
      "<title>&lt;script&gt;alert(&quot;hacked&quot;)&lt;/script&gt;</title>"
    );

    const htmlResult = await validate.validateString(result);
    expect(htmlResult.valid).toBe(true);
  });

  it("should generate correct description tag", async () => {
    const config = {
      description: '<img src=x onerror=alert("hacked")>',
    };
    const result = buildTags(config);
    expect(result).toContain(
      '<meta name="description" content="&lt;img src=x onerror=alert(&quot;hacked&quot;)&gt;">'
    );

    const htmlResult = await validate.validateString(result);
    expect(htmlResult.valid).toBe(true);
  });

  it("should escape URLs", async () => {
    const config = {
      openGraph: {
        url: '<script>alert("hacked")</script>',
      },
    };
    const result = buildTags(config);
    expect(result).toContain(
      '<meta property="og:url" content="&lt;script&gt;alert(&quot;hacked&quot;)&lt;/script&gt;">'
    );

    const htmlResult = await validate.validateString(result);
    expect(htmlResult.valid).toBe(true);
  });

  it("should generate correct robots tag for noindex and nofollow", async () => {
    const config = {
      noindex: true,
      nofollow: true,
    };
    const result = buildTags(config);
    expect(result).toContain('<meta name="robots" content="noindex,nofollow">');

    const htmlResult = await validate.validateString(result);
    expect(htmlResult.valid).toBe(true);
  });

  it("should generate correct twitter card tag", async () => {
    const config = {
      twitter: {
        cardType: "summary_large_image",
      },
    };
    const result = buildTags(config);
    expect(result).toContain(
      '<meta name="twitter:card" content="summary_large_image">'
    );

    const htmlResult = await validate.validateString(result);
    expect(htmlResult.valid).toBe(true);
  });

  it("should generate correct facebook app id tag", async () => {
    const config = {
      facebook: {
        appId: "1234567890",
      },
    };
    const result = buildTags(config);
    expect(result).toContain(
      '<meta property="fb:app_id" content="1234567890">'
    );

    const htmlResult = await validate.validateString(result);
    expect(htmlResult.valid).toBe(true);
  });

  it("should generate correct openGraph title tag", async () => {
    const config = {
      openGraph: {
        title: "<b>Test Title</b>",
      },
    };
    const result = buildTags(config);
    expect(result).toContain(
      '<meta property="og:title" content="&lt;b&gt;Test Title&lt;/b&gt;">'
    );

    const htmlResult = await validate.validateString(result);
    expect(htmlResult.valid).toBe(true);
  });

  it("should generate correct canonical link tag", async () => {
    const config = {
      canonical: "https://example.com/page",
    };
    const result = buildTags(config);
    expect(result).toContain(
      '<link rel="canonical" href="https://example.com/page">'
    );

    const htmlResult = await validate.validateString(result);
    expect(htmlResult.valid).toBe(true);
  });

  it("should generate correct alternate link tag for mobile", async () => {
    const config = {
      mobileAlternate: {
        media: "only screen and (max-width: 640px)",
        href: "https://m.example.com/page",
      },
    };
    const result = buildTags(config);
    expect(result).toContain(
      '<link rel="alternate" media="only screen and (max-width: 640px)" href="https://m.example.com/page">'
    );

    const htmlResult = await validate.validateString(result);
    expect(htmlResult.valid).toBe(true);
  });

  it("should generate correct openGraph description tag", async () => {
    const config = {
      openGraph: {
        description: "<i>Test Description</i>",
      },
    };
    const result = buildTags(config);
    expect(result).toContain(
      '<meta property="og:description" content="&lt;i&gt;Test Description&lt;/i&gt;">'
    );

    const htmlResult = await validate.validateString(result);
    expect(htmlResult.valid).toBe(true);
  });

  it("should generate correct openGraph type tag", async () => {
    const config = {
      openGraph: {
        type: "article",
      },
    };
    const result = buildTags(config);
    expect(result).toContain('<meta property="og:type" content="article">');

    const htmlResult = await validate.validateString(result);
    expect(htmlResult.valid).toBe(true);
  });

  it("should generate correct openGraph locale tag", async () => {
    const config = {
      openGraph: {
        locale: "en_US",
      },
    };
    const result = buildTags(config);
    expect(result).toContain('<meta property="og:locale" content="en_US">');

    const htmlResult = await validate.validateString(result);
    expect(htmlResult.valid).toBe(true);
  });

  it("should generate correct openGraph site_name tag", async () => {
    const config = {
      openGraph: {
        site_name: "Test Site",
      },
    };
    const result = buildTags(config);
    expect(result).toContain(
      '<meta property="og:site_name" content="Test Site">'
    );

    const htmlResult = await validate.validateString(result);
    expect(htmlResult.valid).toBe(true);
  });

  it("should handle multiple OpenGraph media tags correctly", async () => {
    const config = {
      openGraph: {
        images: [
          { url: "https://example.com/image1.jpg" },
          { url: "https://example.com/image2.jpg" },
        ],
        videos: [
          { url: "https://example.com/video1.mp4" },
          { url: "https://example.com/video2.mp4" },
        ],
      },
    };
    const result = buildTags(config);
    expect(result).toContain(
      '<meta property="og:image" content="https://example.com/image1.jpg">'
    );
    expect(result).toContain(
      '<meta property="og:image" content="https://example.com/image2.jpg">'
    );
    expect(result).toContain(
      '<meta property="og:video" content="https://example.com/video1.mp4">'
    );
    expect(result).toContain(
      '<meta property="og:video" content="https://example.com/video2.mp4">'
    );

    const htmlResult = await validate.validateString(result);
    expect(htmlResult.valid).toBe(true);
  });

  it("should generate correct languageAlternates link tags", async () => {
    const config = {
      languageAlternates: [
        { hreflang: "es", href: "https://example.com/es" },
        { hreflang: "fr", href: "https://example.com/fr" },
      ],
    };
    const result = buildTags(config);
    expect(result).toContain(
      '<link rel="alternate" hreflang="es" href="https://example.com/es">'
    );
    expect(result).toContain(
      '<link rel="alternate" hreflang="fr" href="https://example.com/fr">'
    );

    const htmlResult = await validate.validateString(result);
    expect(htmlResult.valid).toBe(true);
  });

  it("should generate correct twitter site and creator tags", async () => {
    const config = {
      twitter: {
        site: "@testsite",
        handle: "@testhandle",
      },
    };
    const result = buildTags(config);
    expect(result).toContain('<meta name="twitter:site" content="@testsite">');
    expect(result).toContain(
      '<meta name="twitter:creator" content="@testhandle">'
    );

    const htmlResult = await validate.validateString(result);
    expect(htmlResult.valid).toBe(true);
  });

  it("should generate correct additionalMetaTags", async () => {
    const config = {
      additionalMetaTags: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
    };
    const result = buildTags(config);
    expect(result).toContain(
      '<meta content="width=device-width, initial-scale=1" name="viewport">'
    );

    const htmlResult = await validate.validateString(result);
    expect(htmlResult.valid).toBe(true);
  });

  it("should generate correct additionalLinkTags", async () => {
    const config = {
      additionalLinkTags: [
        { rel: "stylesheet", href: "https://example.com/styles.css" },
      ],
    };
    const result = buildTags(config);
    expect(result).toContain(
      '<link rel="stylesheet" href="https://example.com/styles.css">'
    );

    const htmlResult = await validate.validateString(result);
    expect(htmlResult.valid).toBe(true);
  });

  it("should generate og:title and og:description from title and description if not explicitly set", async () => {
    const config = {
      title: "Test Title",
      description: "Test Description",
      openGraph: {},
    };
    const result = buildTags(config);
    expect(result).toContain('<meta property="og:title" content="Test Title">');
    expect(result).toContain(
      '<meta property="og:description" content="Test Description">'
    );

    const htmlResult = await validate.validateString(result);
    expect(htmlResult.valid).toBe(true);
  });

  it("should not generate og:title and og:description if openGraph is not defined", async () => {
    const config = {
      title: "Test Title",
      description: "Test Description",
    };
    const result = buildTags(config);
    expect(result).not.toContain(
      '<meta property="og:title" content="Test Title">'
    );
    expect(result).not.toContain(
      '<meta property="og:description" content="Test Description">'
    );

    const htmlResult = await validate.validateString(result);
    expect(htmlResult.valid).toBe(true);
  });

  // Casos de prueba realistas
  it("should generate a complete set of tags for a blog post", async () => {
    const config = {
      title: "My Blog Post",
      description: "A detailed description of my blog post.",
      canonical: "https://example.com/blog/my-blog-post",
      openGraph: {
        type: "article",
        url: "https://example.com/blog/my-blog-post",
        title: "My Blog Post",
        description: "A detailed description of my blog post.",
        images: [{ url: "https://example.com/images/blog-image.jpg" }],
      },
      twitter: {
        cardType: "summary_large_image",
        site: "@example",
      },
    };
    const result = buildTags(config);
    expect(result).toContain("<title>My Blog Post</title>");
    expect(result).toContain(
      '<meta name="description" content="A detailed description of my blog post.">'
    );
    expect(result).toContain(
      '<link rel="canonical" href="https://example.com/blog/my-blog-post">'
    );
    expect(result).toContain('<meta property="og:type" content="article">');
    expect(result).toContain(
      '<meta property="og:url" content="https://example.com/blog/my-blog-post">'
    );
    expect(result).toContain(
      '<meta property="og:title" content="My Blog Post">'
    );
    expect(result).toContain(
      '<meta property="og:description" content="A detailed description of my blog post.">'
    );
    expect(result).toContain(
      '<meta property="og:image" content="https://example.com/images/blog-image.jpg">'
    );
    expect(result).toContain(
      '<meta name="twitter:card" content="summary_large_image">'
    );
    expect(result).toContain('<meta name="twitter:site" content="@example">');

    const htmlResult = await validate.validateString(result);
    expect(htmlResult.valid).toBe(true);
  });

  it("should generate a complete set of tags for a product page", async () => {
    const config = {
      title: "Product Name",
      description: "Description of the product.",
      canonical: "https://example.com/products/product-name",
      openGraph: {
        type: "product",
        url: "https://example.com/products/product-name",
        title: "Product Name",
        description: "Description of the product.",
        images: [{ url: "https://example.com/images/product-image.jpg" }],
      },
      twitter: {
        cardType: "summary",
        site: "@examplestore",
      },
    };
    const result = buildTags(config);
    expect(result).toContain("<title>Product Name</title>");
    expect(result).toContain(
      '<meta name="description" content="Description of the product.">'
    );
    expect(result).toContain(
      '<link rel="canonical" href="https://example.com/products/product-name">'
    );
    expect(result).toContain('<meta property="og:type" content="product">');
    expect(result).toContain(
      '<meta property="og:url" content="https://example.com/products/product-name">'
    );
    expect(result).toContain(
      '<meta property="og:title" content="Product Name">'
    );
    expect(result).toContain(
      '<meta property="og:description" content="Description of the product.">'
    );
    expect(result).toContain(
      '<meta property="og:image" content="https://example.com/images/product-image.jpg">'
    );
    expect(result).toContain('<meta name="twitter:card" content="summary">');
    expect(result).toContain(
      '<meta name="twitter:site" content="@examplestore">'
    );

    const htmlResult = await validate.validateString(result);
    expect(htmlResult.valid).toBe(true);
  });
});
