// Generates db.json for json-server from the same shape used by the app's models.
// Run with: node scripts/generate-db.js
const fs = require('fs');
const path = require('path');

const TAGS = ['Birthday Wishes', 'Cake & Sweets', 'Party Time', 'Gifts', 'Memories'];

const NAMES = [
  'Aarav Sharma', 'Diya Patel', 'Kabir Singh', 'Anaya Gupta', 'Vihaan Mehta',
  'Ishita Rao', 'Reyansh Nair', 'Myra Kapoor', 'Arjun Verma', 'Sara Khan'
];

function hoursAgo(hours) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function seededImages(seed, count) {
  return Array.from({ length: count }, (_, i) => `https://picsum.photos/seed/bday-${seed}-${i}/720/840`);
}

function generatePosts(count = 24) {
  return Array.from({ length: count }, (_, i) => {
    const postId = i + 1;
    const name = NAMES[i % NAMES.length];
    return {
      // json-server's /posts/:id routes always match a field literally named
      // "id" - this mirrors postId purely for that routing, the app only reads postId.
      id: postId,
      postId,
      userName: name,
      tinyProfilePic: `https://i.pravatar.cc/100?img=${(i % 70) + 1}`,
      profilePic: `https://i.pravatar.cc/300?img=${(i % 70) + 1}`,
      images: seededImages(postId, (i % 3) + 1),
      description:
        "Wishing the happiest of birthdays! Here's to another wonderful year full of joy, laughter and unforgettable memories. #Birthday2026",
      tag: TAGS[i % TAGS.length],
      likes: Math.floor(Math.random() * 500),
      likeByMe: false,
      shareCount: Math.floor(Math.random() * 50),
      commentCount: Math.floor(Math.random() * 6),
      postCreationOrModificationDate: hoursAgo(i * 3 + 1),
      isMine: i % 6 === 0
    };
  });
}

function generateComments(posts) {
  const comments = [];
  for (const post of posts) {
    for (let i = 0; i < post.commentCount; i++) {
      const name = NAMES[(post.postId + i) % NAMES.length];
      comments.push({
        id: post.postId * 100 + i + 1,
        postId: post.postId,
        commentBy: name,
        tinyProfilePic: `https://i.pravatar.cc/100?img=${((post.postId + i) % 70) + 1}`,
        comment: 'Happy birthday! Wishing you all the happiness in the world today and always.',
        creationdate: hoursAgo(i + 1),
        likescount: Math.floor(Math.random() * 30),
        likeByMe: false
      });
    }
  }
  return comments;
}

const posts = generatePosts();
const comments = generateComments(posts);

const db = { posts, comments };

fs.writeFileSync(path.join(__dirname, '..', 'db.json'), JSON.stringify(db, null, 2));
console.log(`Generated db.json with ${posts.length} posts and ${comments.length} comments.`);
