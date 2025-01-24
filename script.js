// Course data
const courseData = {
  id: '1',
  title: 'Complete React Development Course',
  level: 'Intermediate',
  duration: '12 hours',
  totalVideos: 45,
  rating: 4.8,
  enrolled: false,
  progress: 0,
  description: 'Master React.js from the ground up. Learn hooks, context, Redux, and more with practical projects.',
  videos: [
    
      {
        id: '1',
        title: 'Introduction to React',
        duration: '15:30',
        views: '12K',
        completed: false,
        youtubeId: 'w7ejDZ8SWv8',
      },
      {
        id: '2',
        title: 'React Hooks Explained',
        duration: '23:45',
        views: '8.5K',
        completed: false,
        youtubeId: 'TNhaISOUy6Q',
      },
      {
        id: '3',
        title: 'React Context API in Depth',
        duration: '20:10',
        views: '9K',
        completed: false,
        youtubeId: '6KQeopPE36I',
      },
      {
        id: '4',
        title: 'Building a Todo App with React',
        duration: '18:50',
        views: '10.2K',
        completed: false,
        youtubeId: 'P-WHzz2M5aU',
      },
      {
        id: '5',
        title: 'React Router Basics',
        duration: '25:15',
        views: '15K',
        completed: false,
        youtubeId: 'VeWdk4D_xYs',
      },
      {
        id: '6',
        title: 'Optimizing React Performance',
        duration: '22:30',
        views: '7.1K',
        completed: false,
        youtubeId: 'uVJov5QWEKE4',
      },
      {
        id: '7',
        title: 'React with TypeScript',
        duration: '30:20',
        views: '5.6K',
        completed: false,
        youtubeId: 'joTOrCiAPB4',
      },
      {
        id: '8',
        title: 'State Management with Redux',
        duration: '28:45',
        views: '11.4K',
        completed: false,
        youtubeId: 'fxT54eRIsc4',
      },
      {
        id: '9',
        title: 'React Testing with Jest',
        duration: '19:55',
        views: '6.8K',
        completed: false,
        youtubeId: 'JBSUgDxICg8',
      },
      {
        id: '10',
        title: 'Deploying React Apps to Netlify',
        duration: '14:40',
        views: '4.2K',
        completed: false,
        youtubeId: 'JBSUgDxICg8',
      },
    
    
  ]
};

// State management
let currentVideoId = courseData.videos[0].id;
const notes = new Map(); // videoId -> array of notes

// DOM Elements
const enrollButton = document.getElementById('enrollButton');
const progressFill = document.getElementById('progressFill');
const progressPercentage = document.getElementById('progressPercentage');
const youtubePlayer = document.getElementById('youtubePlayer');
const videoList = document.getElementById('videoList');
const noteForm = document.getElementById('noteForm');
const noteInput = document.getElementById('noteInput');
const notesList = document.getElementById('notesList');
const generateQuestionsButton = document.getElementById('generateQuestionsButton');
const questionsList = document.getElementById('questionsList');
const stars = document.querySelectorAll('.star');
const ratingValue = document.getElementById('ratingValue');
let selectedRating = 0;
stars.forEach(star => {
  star.addEventListener('click', (e) => {
    selectedRating = parseInt(e.target.getAttribute('data-value'));
    updateRatingDisplay();
  });
});
function updateRatingDisplay() {
  stars.forEach(star => {
    if (parseInt(star.getAttribute('data-value')) <= selectedRating) {
      star.classList.add('selected');
    } else {
      star.classList.remove('selected');
    }
  });
  ratingValue.textContent = `${selectedRating}/5`;
}

// Handle Submit Rating
document.getElementById('submitRatingButton').addEventListener('click', () => {
  if (selectedRating === 0) {
    alert("Please select a rating before submitting.");
  } else {
    // Here you can send the rating to the backend or save it in your system.
    alert(`You rated this course: ${selectedRating}/5`);
    // Reset the stars after submission
    selectedRating = 0;
    updateRatingDisplay();
  }
});

// Event Listeners
enrollButton.addEventListener('click', handleEnroll);
noteForm.addEventListener('submit', handleAddNote);
generateQuestionsButton.addEventListener('click', fetchGeminiQuestions);

// Initialize the page
initializePage();

function initializePage() {
  renderVideoList();
  updateProgress();
}

function handleEnroll() {
  if (!courseData.enrolled) {
    courseData.enrolled = true;
    enrollButton.textContent = 'Enrolled';
    enrollButton.classList.add('enrolled');
  }
}

function renderVideoList() {
  videoList.innerHTML = courseData.videos.map(video => `
    <div class="video-item ${video.id === currentVideoId ? 'active' : ''}" data-video-id="${video.id}">
      <div class="video-item-header">
        <button class="complete-button" data-video-id="${video.id}">
          ${video.completed ? 
            '<i data-lucide="check-circle"></i>' : 
            '<i data-lucide="circle"></i>'
          }
        </button>
        <div class="video-details">
          <h3>${video.title}</h3>
          <div class="video-meta">
            <span>
              <i data-lucide="clock"></i>
              ${video.duration}
            </span>
            <span>
              <i data-lucide="eye"></i>
              ${video.views}
            </span>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // Re-initialize Lucide icons for the new content
  lucide.createIcons();

  // Add event listeners to video items
  document.querySelectorAll('.video-item').forEach(item => {
    item.addEventListener('click', () => {
      const videoId = item.dataset.videoId;
      const video = courseData.videos.find(v => v.id === videoId);
      if (video) {
        changeVideo(video);
      }
    });
  });

  // Add event listeners to complete buttons
  document.querySelectorAll('.complete-button').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const videoId = button.dataset.videoId;
      toggleVideoComplete(videoId);
    });
  });
}

function changeVideo(video) {
  currentVideoId = video.id;
  youtubePlayer.src = `https://www.youtube.com/embed/${video.youtubeId}`;
  renderVideoList();
  renderNotes();
}

function toggleVideoComplete(videoId) {
  const video = courseData.videos.find(v => v.id === videoId);
  if (video) {
    video.completed = !video.completed;
    updateProgress();
    renderVideoList();
  }
}

function updateProgress() {
  const completedCount = courseData.videos.filter(v => v.completed).length;
  const progress = (completedCount / courseData.videos.length) * 100;
  courseData.progress = progress;
  
  progressFill.style.width = `${progress}%`;
  progressPercentage.textContent = `${Math.round(progress)}%`;
}

function handleAddNote(e) {
  e.preventDefault();
  const content = noteInput.value.trim();
  if (content) {
    const note = {
      id: Date.now().toString(),
      content,
      timestamp: new Date().toLocaleString()
    };

    if (!notes.has(currentVideoId)) {
      notes.set(currentVideoId, []);
    }
    notes.get(currentVideoId).push(note);

    noteInput.value = '';
    renderNotes();
  }
}

function renderNotes() {
  const videoNotes = notes.get(currentVideoId) || [];
  notesList.innerHTML = videoNotes.map(note => `
    <div class="note-item">
      <p class="note-content">${note.content}</p>
      <span class="note-timestamp">${note.timestamp}</span>
    </div>
  `).join('');
}

// Fetch AI-generated questions based on the current video
async function fetchGeminiQuestions() {
  const apiUrl = 'https://api.docsbot.ai/teams/82d713bb6e2487ff244e52c891865709f2ce9b2e8d0d4e524ead4ef1f28d5b61/chat';
  const videoTitle = courseData.videos.find(v => v.id === currentVideoId).title;
  const question = `Create learning questions based on the video titled "${videoTitle}".`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: question,
      }),
    });

    if (!response.ok) throw new Error('What is React ? and React Questions....');

    const data = await response.json();
    displayQuestions(data.answers || []);
  } catch (error) {
    console.error('Error:', error);
    questionsList.innerHTML =   questionsList.innerHTML = `
    <div class="mcq-question">
  <p>Which framework is used in the video?</p>
  <ul class="options">
    <li>
      <input type="radio" name="framework" id="optionA" value="React">
      <label for="optionA">React</label>
    </li>
    <li>
      <input type="radio" name="framework" id="optionB" value="Angular">
      <label for="optionB">Angular</label>
    </li>
    <li>
      <input type="radio" name="framework" id="optionC" value="Vue">
      <label for="optionC">Vue</label>
    </li>
    <li>
      <input type="radio" name="framework" id="optionD" value="Svelte">
      <label for="optionD">Svelte</label>
    </li>
  </ul>
  <button class="submit-answer-button" onclick="handleSubmit()">Submit Answer</button>
  <p id="success-message" style="display:none; color: green;">Submitted successfully!</p>
</div>
  `;

  }
}
function handleSubmit() {
  // Get the selected radio button
  const selectedOption = document.querySelector('input[name="framework"]:checked');
  const successMessage = document.getElementById('success-message');

  if (selectedOption && selectedOption.value === "React") {
    // Show success message if React is selected
    successMessage.style.display = "block";
    successMessage.textContent = "Submitted successfully!";
  } else {
    // Hide the success message if the selection is not React
    successMessage.style.display = "none";
    alert("Please select the correct answer before submitting.");
  }
}
function displayQuestions(questions) {
  if (questions.length === 0) {
    questionsList.innerHTML = '<p>No questions generated for this video.</p>';
    return;
  }

  questionsList.innerHTML = questions.map(q => `
    <div class="question-item"><p>${q}</p></div>
  `).join('');
}
document.getElementById('boldButton').addEventListener('click', () => {
  document.execCommand('bold');
});

document.getElementById('italicButton').addEventListener('click', () => {
  document.execCommand('italic');
});

document.getElementById('underlineButton').addEventListener('click', () => {
  document.execCommand('underline');
});

// Adding notes functionality
document.getElementById('noteForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const noteInput = document.getElementById('noteInput');
  const notesList = document.getElementById('notesList');

  if (noteInput.innerHTML.trim() === '') {
    alert('Please add some text to the note.');
    return;
  }

  // Create a new note element
  const noteItem = document.createElement('div');
  noteItem.classList.add('note-item');
  noteItem.innerHTML = noteInput.innerHTML;

  // Add the note to the list
  notesList.appendChild(noteItem);

  // Clear the input field
  noteInput.innerHTML = '';
});

document.getElementById('notesList').addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-note')) {
    e.target.parentElement.remove();
  }
});