import Head from "next/head";

interface metatagsprops {
  title: string;
  description?: string;
  image?: string;
}

export default function MetaTags({ title, description, image }: metatagsprops) {
  return (
    <head>
      <title>{title}</title>
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@fireship_dev" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </head>
  );
}
