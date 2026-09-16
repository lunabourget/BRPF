import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// src/components/card.js
// src/components/card.js
export function createCard({ title, description, link }) {
  const card = document.createElement('a');
  card.href = link;
  card.className = 'card';

  const titleEl = document.createElement('h3');
  titleEl.textContent = title;
  card.appendChild(titleEl);

  const descEl = document.createElement('p');
  descEl.textContent = description;
  card.appendChild(descEl);

  return card;
}

// src/components/mediaCard.js
export function createMediaCard({
  imageSrc = '/static/images/cards/contemplative-reptile.jpg',
  imageAlt = 'green iguana',
  title = 'Lizard',
  description = 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica',
  onShare,
  onLearnMore
} = {}) {

  const card = document.createElement('div');
  card.className = 'media-card';

  const media = document.createElement('img');
  media.className = 'media-card-image';
  media.src = imageSrc;
  media.alt = imageAlt;
  card.appendChild(media);

  const content = document.createElement('div');
  content.className = 'media-card-content';

  const titleEl = document.createElement('h5');
  titleEl.className = 'media-card-title';
  titleEl.textContent = title;
  content.appendChild(titleEl);

  const descEl = document.createElement('p');
  descEl.className = 'media-card-description';
  descEl.textContent = description;
  content.appendChild(descEl);

  card.appendChild(content);

  const actions = document.createElement('div');
  actions.className = 'media-card-actions';

  const shareBtn = document.createElement('button');
  shareBtn.className = 'media-card-btn';
  shareBtn.textContent = 'Share';
  if (onShare) shareBtn.addEventListener('click', onShare);
  actions.appendChild(shareBtn);

  const learnMoreBtn = document.createElement('button');
  learnMoreBtn.className = 'media-card-btn';
  learnMoreBtn.textContent = 'Learn More';
  if (onLearnMore) learnMoreBtn.addEventListener('click', onLearnMore);
  actions.appendChild(learnMoreBtn);

  card.appendChild(actions);

  return card;
}
