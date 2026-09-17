/**
 * seed-levels.js
 *
 * Seeds the 7 fixed career levels into MongoDB.
 * Run: node Backend/seed-levels.js
 *
 * Safe to re-run — uses upsert so existing docs are updated.
 */

require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Level = require('./Models/level');

const CAREER_LEVELS = [
  {
    order: 1,
    name: 'Basic',
    description:
      'Build your foundation. Learn programming basics, problem-solving mindset, and get comfortable with a language. Every expert was once a beginner.',
    icon: '🌱',
    color: '#10B981',   // Emerald
    xpRequired: 0,
    xpReward: 300,
    badgeUnlocked: {
      badgeId: 'foundation-builder',
      name: 'Foundation Builder',
      icon: '🌱',
      description: 'Cleared the Basic level — your journey has begun!'
    },
    clearanceCriteria: [
      {
        criteriaId: 'complete-basic-topics',
        label: 'Complete all Basic topics',
        description: 'Finish all lessons in the Basic level',
        type: 'topic-completion',
        targetCount: 1
      },
      {
        criteriaId: 'pass-basic-quizzes',
        label: 'Pass all Basic quizzes',
        description: 'Score ≥ 70% on all topic quizzes',
        type: 'quiz-pass',
        targetCount: 1
      }
    ]
  },
  {
    order: 2,
    name: 'DSA',
    description:
      'Master Data Structures and Algorithms — the core skill for any software role. Arrays, strings, linked lists, trees, graphs, dynamic programming, and more.',
    icon: '🧠',
    color: '#6366F1',   // Indigo
    xpRequired: 300,
    xpReward: 500,
    badgeUnlocked: {
      badgeId: 'dsa-warrior',
      name: 'DSA Warrior',
      icon: '🧠',
      description: 'Conquered DSA — you think in algorithms now.'
    },
    clearanceCriteria: [
      {
        criteriaId: 'complete-dsa-topics',
        label: 'Complete all DSA topics',
        description: 'Finish every DSA lesson',
        type: 'topic-completion',
        targetCount: 1
      },
      {
        criteriaId: 'solve-25-problems',
        label: 'Solve 25 practice problems',
        description: 'Solve at least 25 coding problems',
        type: 'problem-count',
        targetCount: 25
      },
      {
        criteriaId: 'pass-dsa-quizzes',
        label: 'Pass all DSA quizzes',
        description: 'Score ≥ 70% on all DSA topic quizzes',
        type: 'quiz-pass',
        targetCount: 1
      },
      {
        criteriaId: 'dsa-final-challenge',
        label: 'Complete the DSA Final Challenge',
        description: 'Pass the comprehensive DSA assessment',
        type: 'challenge',
        targetCount: 1
      }
    ]
  },
  {
    order: 3,
    name: 'First Project',
    description:
      'Build your first real-world project from scratch. Learn version control, project structure, deployment, and showcase your work. Turn your knowledge into something tangible.',
    icon: '🚀',
    color: '#8B5CF6',   // Violet
    xpRequired: 800,
    xpReward: 600,
    badgeUnlocked: {
      badgeId: 'builder',
      name: 'Builder',
      icon: '🚀',
      description: 'Shipped your first project — from zero to deployed!'
    },
    clearanceCriteria: [
      {
        criteriaId: 'complete-project-topics',
        label: 'Complete all Project lessons',
        description: 'Finish all First Project level lessons',
        type: 'topic-completion',
        targetCount: 1
      },
      {
        criteriaId: 'submit-project',
        label: 'Submit your first project',
        description: 'Upload a GitHub link to your completed project',
        type: 'project',
        targetCount: 1
      }
    ]
  },
  {
    order: 4,
    name: 'Resume',
    description:
      'Build a resume that gets past ATS filters and impresses recruiters. Learn how to present your skills, projects, and achievements for the job market.',
    icon: '📄',
    color: '#F59E0B',   // Amber
    xpRequired: 1400,
    xpReward: 400,
    badgeUnlocked: {
      badgeId: 'resume-ready',
      name: 'Resume Ready',
      icon: '📄',
      description: 'Your resume is polished and placement-ready!'
    },
    clearanceCriteria: [
      {
        criteriaId: 'complete-resume-topics',
        label: 'Complete Resume lessons',
        description: 'Finish all resume-building lessons',
        type: 'topic-completion',
        targetCount: 1
      },
      {
        criteriaId: 'submit-resume',
        label: 'Submit your resume for review',
        description: 'Upload your completed resume',
        type: 'project',
        targetCount: 1
      }
    ]
  },
  {
    order: 5,
    name: 'Interview Prep',
    description:
      'Prepare for technical and HR interviews. System design, behavioral questions, STAR framework, mock interviews, and communication skills.',
    icon: '🎤',
    color: '#EC4899',   // Pink
    xpRequired: 1800,
    xpReward: 600,
    badgeUnlocked: {
      badgeId: 'interview-ready',
      name: 'Interview Ready',
      icon: '🎤',
      description: 'Ready to ace any interview room!'
    },
    clearanceCriteria: [
      {
        criteriaId: 'complete-interview-topics',
        label: 'Complete Interview Prep lessons',
        description: 'Finish all interview preparation lessons',
        type: 'topic-completion',
        targetCount: 1
      },
      {
        criteriaId: 'complete-mock-interviews',
        label: 'Complete 3 mock interviews',
        description: 'Practice with at least 3 mock interview challenges',
        type: 'challenge',
        targetCount: 3
      }
    ]
  },
  {
    order: 6,
    name: 'Job Apply',
    description:
      'Learn how to find the right companies, craft personalized applications, use job boards effectively, and track your applications like a pro.',
    icon: '💼',
    color: '#0EA5E9',   // Sky
    xpRequired: 2400,
    xpReward: 500,
    badgeUnlocked: {
      badgeId: 'job-hunter',
      name: 'Job Hunter',
      icon: '💼',
      description: 'Actively in the hunt — applications sent!'
    },
    clearanceCriteria: [
      {
        criteriaId: 'complete-job-apply-topics',
        label: 'Complete Job Apply lessons',
        description: 'Finish all job application lessons',
        type: 'topic-completion',
        targetCount: 1
      },
      {
        criteriaId: 'apply-to-5-jobs',
        label: 'Apply to at least 5 jobs',
        description: 'Log 5 job applications on the platform',
        type: 'problem-count',
        targetCount: 5
      }
    ]
  },
  {
    order: 7,
    name: 'Placement',
    description:
      'You made it. This is the final milestone — receiving an offer and beginning your professional career. Track your placement, inspire your college, and give back to the community.',
    icon: '🎓',
    color: '#F97316',   // Orange
    xpRequired: 2900,
    xpReward: 1000,
    badgeUnlocked: {
      badgeId: 'placed',
      name: 'Placed! 🎉',
      icon: '🎓',
      description: 'Placed and ready — the journey was worth it!'
    },
    clearanceCriteria: [
      {
        criteriaId: 'receive-offer',
        label: 'Receive a job/internship offer',
        description: 'Log your placement offer on the platform',
        type: 'manual',
        targetCount: 1
      }
    ]
  }
];

async function seedLevels() {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI || process.env.DB_URI || process.env.MONGODB_URI);
  console.log('✅ Connected.\n');

  let created = 0;
  let updated = 0;

  for (const levelData of CAREER_LEVELS) {
    const existing = await Level.findOne({ order: levelData.order });

    if (existing) {
      await Level.findByIdAndUpdate(existing._id, levelData, { new: true });
      console.log(`🔄 Updated  [${levelData.order}] ${levelData.icon} ${levelData.name}`);
      updated++;
    } else {
      await Level.create(levelData);
      console.log(`✨ Created  [${levelData.order}] ${levelData.icon} ${levelData.name}`);
      created++;
    }
  }

  console.log(`\n📊 Done — ${created} created, ${updated} updated.`);
  console.log('🎓 Career levels seeded successfully!\n');

  await mongoose.disconnect();
  process.exit(0);
}

seedLevels().catch((err) => {
  console.error('❌ Seeder failed:', err.message);
  process.exit(1);
});
