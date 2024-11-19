const axios = require('axios')

async function fetchPhotosFromSubreddit (subreddit, limit) {
  const clientId = 'YOUR_CLIENT_ID'
  const clientSecret = 'YOUR_CLIENT_SECRET'
  const username = 'YOUR_REDDIT_USERNAME'
  const password = 'YOUR_REDDIT_PASSWORD'

  try {
    const tokenResponse = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      new URLSearchParams({
        grant_type: 'password',
        username: username,
        password: password
      }),
      {
        auth: {
          username: clientId,
          password: clientSecret
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    const accessToken = tokenResponse.data.access_token

    const response = await axios.get(
      `https://oauth.reddit.com/r/${subreddit}/hot?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'MyRedditApp/1.0.0'
        }
      }
    )

    const posts = response.data.data.children.map(child => child.data)
    const photoPosts = posts
      .filter(post => post.post_hint === 'image')
      .map(post => ({
        title: post.title,
        url: post.url
      }))

    return photoPosts
  } catch (error) {
    console.error('Error fetching photos:', error)
    throw new Error('Failed to fetch photos from subreddit.')
  }
}

fetchPhotosFromSubreddit('KurdistanArchive', 10000)
  .then(photos => {
    console.log('Fetched Photos:', photos)
    console.log('Fetched Photos:', photos.length)
  })
  .catch(error => {
    console.error(error.message)
  })
