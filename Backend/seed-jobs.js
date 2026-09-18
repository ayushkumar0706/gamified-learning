require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('./Models/job');

const MOCK_JOBS = [
  {
    title: 'Graduate Software Development Engineer (SDE-1)',
    company: 'Atlassian',
    logo: '🔷',
    location: 'Bangalore, India (Hybrid)',
    type: 'Full-time',
    batch: '2025 / 2026 Batch',
    ctc: '₹22 - ₹28 LPA',
    referralAvailable: true,
    seniorReferrer: 'Sneha Kulkarni (Atlassian)',
    skills: ['Data Structures', 'Java / Python', 'Distributed Systems Basics', 'REST APIs'],
    description: 'Join Atlassian as a Graduate SDE working on Jira and Confluence cloud architectures. You will collaborate with global teams building resilient microservices.',
    applyUrl: 'https://atlassian.com/careers',
  },
  {
    title: 'Software Engineering Intern (Summer 2026)',
    company: 'Microsoft',
    logo: '🪟',
    location: 'Hyderabad / Bangalore',
    type: 'Internship',
    batch: '2026 / 2027 Batch',
    ctc: '₹1,25,000 / month',
    referralAvailable: true,
    seniorReferrer: 'Priya Patel (Microsoft)',
    skills: ['C++ / C#', 'Algorithms', 'OOP Concepts', 'Problem Solving'],
    description: 'Exciting 2-month summer internship for pre-final year students. High pre-placement offer (PPO) conversion rate based on project delivery.',
    applyUrl: 'https://careers.microsoft.com',
  },
  {
    title: 'SDE 1 — Core Backend',
    company: 'Amazon',
    logo: '📦',
    location: 'Bangalore, India',
    type: 'Full-time',
    batch: '2024 / 2025 Batch',
    ctc: '₹28 - ₹34 LPA',
    referralAvailable: true,
    seniorReferrer: 'Rohan Verma (Amazon)',
    skills: ['Java', 'Spring Boot', 'AWS Cloud', 'Low-Level Design'],
    description: 'Looking for passionate engineers with strong problem-solving skills and a solid grasp of AWS infrastructure and concurrency paradigms.',
    applyUrl: 'https://amazon.jobs',
  },
  {
    title: 'Frontend Engineer (React / Next.js)',
    company: 'Uber',
    logo: '🚗',
    location: 'Hyderabad, India',
    type: 'Full-time',
    batch: '2025 Batch',
    ctc: '₹20 - ₹26 LPA',
    referralAvailable: true,
    seniorReferrer: 'Aditya Mehta (Uber)',
    skills: ['TypeScript', 'React.js', 'State Management', 'Web Performance'],
    description: 'Build consumer-facing rider and driver web experiences serving millions of daily trips globally with sub-second latency.',
    applyUrl: 'https://uber.com/careers',
  },
  {
    title: 'Full Stack Engineering Intern',
    company: 'Zepto',
    logo: '⚡',
    location: 'Bangalore / Remote',
    type: 'Internship',
    batch: '2026 Batch',
    ctc: '₹60,000 / month',
    referralAvailable: false,
    skills: ['Node.js', 'React', 'MongoDB / Postgres', 'Redis'],
    description: 'Fast-paced quick commerce engineering team. Solve real-time inventory dispatch and delivery partner routing challenges.',
    applyUrl: 'https://zeptonow.com',
  },
  {
    title: 'Associate Product Engineer',
    company: 'Razorpay',
    logo: '💳',
    location: 'Bangalore, India',
    type: 'Full-time',
    batch: '2025 Batch',
    ctc: '₹18 - ₹22 LPA',
    referralAvailable: false,
    skills: ['Go / Python', 'SQL Database Tuning', 'Fintech Security', 'Microservices'],
    description: 'Power the payment rails of India. Opportunity to work on mission-critical transactional pipelines handling billions in monthly volume.',
    applyUrl: 'https://razorpay.com/jobs',
  },
];

async function seedJobs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    await Job.deleteMany({});
    console.log('Cleared existing jobs');

    await Job.insertMany(MOCK_JOBS);
    console.log('Successfully seeded jobs');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding jobs:', error);
    process.exit(1);
  }
}

seedJobs();
