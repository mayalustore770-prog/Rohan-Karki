const urls = [
  'https://ibb.co/gbrxXh3h',
  'https://ibb.co/BH6WNwQb',
  'https://ibb.co/fdNMJp3F',
  'https://ibb.co/Y4FNjJCs',
  'https://ibb.co/twTWJCjL',
  'https://ibb.co/21WrD11s'
];

async function getDirectLinks() {
  for (const url of urls) {
    try {
      const res = await fetch(url);
      const text = await res.text();
      const match = text.match(/<meta property="og:image" content="([^"]+)"/);
      if (match && match[1]) {
        console.log(match[1]);
      } else {
        console.log('Not found for', url);
      }
    } catch (e) {
      console.error(e);
    }
  }
}

getDirectLinks();
