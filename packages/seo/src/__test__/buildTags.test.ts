import { buildTags } from '../utils/buildTags';

describe('buildTags function', () => {
  it('should return an empty string if no config is provided', () => {
    const result = buildTags({});
    expect(result).toBe('');
  });

  it('should handle null or undefined values gracefully', () => {
    const config = {
      title: null,
      description: undefined,
    };
    // @ts-ignore
    const result = buildTags(config);
    expect(result).not.toContain('null');
    expect(result).not.toContain('undefined');
  });

  it('should escape special characters correctly', () => {
    const config = {
      title: 'Title & Description',
    };
    const result = buildTags(config);
    expect(result).toContain('Title &amp; Description');
  });

  it('should generate correct title tag', () => {
    const config = {
      title: '<script>alert("hacked")</script>',
    };
    const result = buildTags(config);
    expect(result).toContain('<title>&lt;script&gt;alert(&quot;hacked&quot;)&lt;/script&gt;</title>');
  });

  it('should generate correct description tag', () => {
    const config = {
      description: '<img src=x onerror=alert("hacked")>',
    };
    const result = buildTags(config);
    expect(result).toContain('<meta name="description" content="&lt;img src=x onerror=alert(&quot;hacked&quot;)&gt;" />');
  });

  it('should escape URLs', () => {
    const config = {
      openGraph: {
        url: '<script>alert("hacked")</script>',
      },
    };
    const result = buildTags(config);
    expect(result).toContain('<meta property="og:url" content="&lt;script&gt;alert(&quot;hacked&quot;)&lt;/script&gt;" />');
  });

  it('should generate correct robots tag for noindex and nofollow', () => {
    const config = {
      noindex: true,
      nofollow: true,
    };
    const result = buildTags(config);
    expect(result).toContain('<meta name="robots" content="noindex,nofollow" />');
  });

  it('should generate correct twitter card tag', () => {
    const config = {
      twitter: {
        cardType: 'summary_large_image',
      },
    };
    const result = buildTags(config);
    expect(result).toContain('<meta name="twitter:card" content="summary_large_image" />');
  });

  it('should generate correct facebook app id tag', () => {
    const config = {
      facebook: {
        appId: '1234567890',
      },
    };
    const result = buildTags(config);
    expect(result).toContain('<meta property="fb:app_id" content="1234567890" />');
  });

  it('should generate correct openGraph title tag', () => {
    const config = {
      openGraph: {
        title: '<b>Test Title</b>',
      },
    };
    const result = buildTags(config);
    expect(result).toContain('<meta property="og:title" content="&lt;b&gt;Test Title&lt;/b&gt;" />');
  });

  it('should generate correct canonical link tag', () => {
    const config = {
      canonical: 'https://example.com/page',
    };
    const result = buildTags(config);
    expect(result).toContain('<link rel="canonical" href="https://example.com/page" />');
  });

  it('should generate correct alternate link tag for mobile', () => {
    const config = {
      mobileAlternate: {
        media: 'only screen and (max-width: 640px)',
        href: 'https://m.example.com/page',
      },
    };
    const result = buildTags(config);
    expect(result).toContain('<link rel="alternate" media="only screen and (max-width: 640px)" href="https://m.example.com/page" />');
  });

  it('should generate correct openGraph description tag', () => {
    const config = {
      openGraph: {
        description: '<i>Test Description</i>',
      },
    };
    const result = buildTags(config);
    expect(result).toContain('<meta property="og:description" content="&lt;i&gt;Test Description&lt;/i&gt;" />');
  });
  
  it('should generate correct openGraph type tag', () => {
    const config = {
      openGraph: {
        type: 'article',
      },
    };
    const result = buildTags(config);
    expect(result).toContain('<meta property="og:type" content="article" />');
  });
  
  it('should generate correct openGraph locale tag', () => {
    const config = {
      openGraph: {
        locale: 'en_US',
      },
    };
    const result = buildTags(config);
    expect(result).toContain('<meta property="og:locale" content="en_US" />');
  });
  
  it('should generate correct openGraph site_name tag', () => {
    const config = {
      openGraph: {
        site_name: 'Test Site',
      },
    };
    const result = buildTags(config);
    expect(result).toContain('<meta property="og:site_name" content="Test Site" />');
  });

  it('should handle multiple OpenGraph media tags correctly', () => {
    const config = {
      openGraph: {
        images: [
          { url: 'https://example.com/image1.jpg' },
          { url: 'https://example.com/image2.jpg' },
        ],
        videos: [
          { url: 'https://example.com/video1.mp4' },
          { url: 'https://example.com/video2.mp4' },
        ],
      },
    };
    const result = buildTags(config);
    expect(result).toContain('<meta property="og:image" content="https://example.com/image1.jpg" />');
    expect(result).toContain('<meta property="og:image" content="https://example.com/image2.jpg" />');
    expect(result).toContain('<meta property="og:video" content="https://example.com/video1.mp4" />');
    expect(result).toContain('<meta property="og:video" content="https://example.com/video2.mp4" />');
  });
  
  it('should generate correct languageAlternates link tags', () => {
    const config = {
      languageAlternates: [
        { hrefLang: 'es', href: 'https://example.com/es' },
        { hrefLang: 'fr', href: 'https://example.com/fr' },
      ],
    };
    const result = buildTags(config);
    expect(result).toContain('<link rel="alternate" hrefLang="es" href="https://example.com/es" />');
    expect(result).toContain('<link rel="alternate" hrefLang="fr" href="https://example.com/fr" />');
  });
  
  it('should generate correct twitter site and creator tags', () => {
    const config = {
      twitter: {
        site: '@testsite',
        handle: '@testhandle',
      },
    };
    const result = buildTags(config);
    expect(result).toContain('<meta name="twitter:site" content="@testsite" />');
    expect(result).toContain('<meta name="twitter:creator" content="@testhandle" />');
  });
  
  it('should generate correct additionalMetaTags', () => {
    const config = {
      additionalMetaTags: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    };
    const result = buildTags(config);
    expect(result).toContain('<meta content="width=device-width, initial-scale=1" name="viewport" />');
  });
  
  it('should generate correct additionalLinkTags', () => {
    const config = {
      additionalLinkTags: [
        { rel: 'stylesheet', href: 'https://example.com/styles.css' },
      ],
    };
    const result = buildTags(config);
    expect(result).toContain('<link rel="stylesheet" href="https://example.com/styles.css" />');
  });

  it('should generate og:title and og:description from title and description if not explicitly set', () => {
    const config = {
      title: 'Test Title',
      description: 'Test Description',
      openGraph: {},
    };
    const result = buildTags(config);
    expect(result).toContain('<meta property="og:title" content="Test Title" />');
    expect(result).toContain('<meta property="og:description" content="Test Description" />');
  });

  it('should not generate og:title and og:description if openGraph is not defined', () => {
    const config = {
      title: 'Test Title',
      description: 'Test Description',
    };
    const result = buildTags(config);
    expect(result).not.toContain('<meta property="og:title" content="Test Title" />');
    expect(result).not.toContain('<meta property="og:description" content="Test Description" />');
  });

  // Casos de prueba realistas
  it('should generate a complete set of tags for a blog post', () => {
    const config = {
      title: 'My Blog Post',
      description: 'A detailed description of my blog post.',
      canonical: 'https://example.com/blog/my-blog-post',
      openGraph: {
        type: 'article',
        url: 'https://example.com/blog/my-blog-post',
        title: 'My Blog Post',
        description: 'A detailed description of my blog post.',
        images: [{ url: 'https://example.com/images/blog-image.jpg' }],
      },
      twitter: {
        cardType: 'summary_large_image',
        site: '@example',
      },
    };
    const result = buildTags(config);
    expect(result).toContain('<title>My Blog Post</title>');
    expect(result).toContain('<meta name="description" content="A detailed description of my blog post." />');
    expect(result).toContain('<link rel="canonical" href="https://example.com/blog/my-blog-post" />');
    expect(result).toContain('<meta property="og:type" content="article" />');
    expect(result).toContain('<meta property="og:url" content="https://example.com/blog/my-blog-post" />');
    expect(result).toContain('<meta property="og:title" content="My Blog Post" />');
    expect(result).toContain('<meta property="og:description" content="A detailed description of my blog post." />');
    expect(result).toContain('<meta property="og:image" content="https://example.com/images/blog-image.jpg" />');
    expect(result).toContain('<meta name="twitter:card" content="summary_large_image" />');
    expect(result).toContain('<meta name="twitter:site" content="@example" />');
  });

  it('should generate a complete set of tags for a product page', () => {
    const config = {
      title: 'Product Name',
      description: 'Description of the product.',
      canonical: 'https://example.com/products/product-name',
      openGraph: {
        type: 'product',
        url: 'https://example.com/products/product-name',
        title: 'Product Name',
        description: 'Description of the product.',
        images: [{ url: 'https://example.com/images/product-image.jpg' }],
      },
      twitter: {
        cardType: 'summary',
        site: '@examplestore',
      },
    };
    const result = buildTags(config);
    expect(result).toContain('<title>Product Name</title>');
    expect(result).toContain('<meta name="description" content="Description of the product." />');
    expect(result).toContain('<link rel="canonical" href="https://example.com/products/product-name" />');
    expect(result).toContain('<meta property="og:type" content="product" />');
    expect(result).toContain('<meta property="og:url" content="https://example.com/products/product-name" />');
    expect(result).toContain('<meta property="og:title" content="Product Name" />');
    expect(result).toContain('<meta property="og:description" content="Description of the product." />');
    expect(result).toContain('<meta property="og:image" content="https://example.com/images/product-image.jpg" />');
    expect(result).toContain('<meta name="twitter:card" content="summary" />');
    expect(result).toContain('<meta name="twitter:site" content="@examplestore" />');
  });

});

