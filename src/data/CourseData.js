const CourseData = [
  {
    id: 1,
    image:
      'https://insider.blockchainwork.net/wp-content/uploads/2022/04/Ba%CC%A3%CC%82t-mi%CC%81-ca%CC%81c-kho%CC%81a-ho%CC%A3c-blockchain-hoa%CC%80n-toa%CC%80n-mie%CC%82%CC%83n-phi%CC%81-cho-ngu%CC%9Bo%CC%9B%CC%80i-mo%CC%9B%CC%81i-ba%CC%86%CC%81t-da%CC%82%CC%80u.jpeg',
    title: 'Course 1',
    description: 'This is the first course.',
    chapters: [
      {
        id: 1,
        title: 'Chapter 1',
        videos: [
          {
            id: 1,
            title: 'Video 1.1',
            url: 'https://example.com/video1.1',
          },
        ],
        quiz: {
          id: 1,
          title: 'Quiz 1',
          questions: [
            {
              id: 1,
              question: 'What is the capital of France?',
              options: ['London', 'Paris', 'Berlin', 'Rome'],
              correctAnswer: 1,
            },
            {
              id: 2,
              question: 'Who painted the Mona Lisa?',
              options: ['Leonardo da Vinci', 'Pablo Picasso', 'Vincent van Gogh', 'Michelangelo'],
              correctAnswer: 0,
            },
            // Thêm các câu hỏi khác vào đây
          ],
        },
      },
      {
        id: 2,
        title: 'Chapter 2',
        videos: [
          {
            id: 3,
            title: 'Video 2.1',
            url: 'https://example.com/video2.1',
          },
        ],
        quiz: {
          id: 2,
          title: 'Quiz 2',
          questions: [
            {
              id: 1,
              question: 'What is the largest planet in our solar system?',
              options: ['Mars', 'Jupiter', 'Saturn', 'Earth'],
              correctAnswer: 1,
            },
            {
              id: 2,
              question: 'Who wrote the play "Romeo and Juliet"?',
              options: ['William Shakespeare', 'Jane Austen', 'Charles Dickens', 'Mark Twain'],
              correctAnswer: 0,
            },
            // Thêm các câu hỏi khác vào đây
          ],
        },
      },
      // Thêm các chapter khác vào đây
    ],
  },
  {
    id: 2,
    image: 'https://files.fullstack.edu.vn/f8-prod/courses/13/13.png',
    title: 'Course 2',
    description: 'This is the third course.',
  },
  {
    id: 3,
    image: 'https://box.edu.vn/wp-content/uploads/2022/09/khoa-hoc-C-3.jpg',
    title: 'Course 3',
    description: 'This is the second course.',
  },
  {
    id: 4,
    image: 'https://funix.edu.vn/wp-content/uploads/2022/05/khoa%CC%81-ho%CC%A3c-la%CC%A3%CC%82p-tri%CC%80nh-C.jpeg',
    title: 'Course 4',
    description: 'This is the second course.',
  },
  {
    id: 5,
    image: 'https://cafedev.vn/wp-content/uploads/2020/05/cafedevn-javascript.jpg',
    title: 'Course 5',
    description: 'This is the second course.',
  },
  {
    id: 6,
    image: 'https://static-xf1.vietnix.vn/wp-content/uploads/2022/07/Spring-BOOT.webp',
    title: 'Course 6',
    description: 'This is the second course.',
  },
  {
    id: 7,
    image: 'https://tedu.com.vn//UploadData/images/news/nodejs-tedu.png',
    title: 'Course 7',
    description: 'This is the second course.',
  },
  {
    id: 8,
    image:
      'https://deviot.vn/storage/deviot/023-1614681588418717257234-0-0-767-1366-crop-1614681591511144479418716638477.png',
    title: 'Course 8',
    description: 'This is the second course.',
  },
  // Add more courses as needed
];
export default CourseData;
