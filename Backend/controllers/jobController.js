const Job = require('../Models/job');
const Referral = require('../Models/referral');

const calculateMatchScore = (user, job) => {
  let score = 40; // base score

  // Level contribution (up to 30 points)
  // Assuming levels go up to 20 or so. Level 10 = 30 points.
  const levelBonus = Math.min(30, (user.level || 1) * 3);
  score += levelBonus;

  // Career Goal contribution (up to 20 points)
  if (user.careerGoal) {
    const goal = user.careerGoal.toLowerCase();
    const title = job.title.toLowerCase();
    const desc = job.description.toLowerCase();
    const skills = job.skills.join(' ').toLowerCase();
    
    if (title.includes(goal) || desc.includes(goal) || skills.includes(goal)) {
      score += 20;
    } else {
      score += 5; // partial match for generic
    }
  } else {
    score += 5; // default if no goal
  }

  // Branch contribution (up to 10 points)
  if (user.branch && (user.branch.toLowerCase().includes('computer') || user.branch.toLowerCase().includes('software'))) {
    score += 10;
  } else {
    score += 5;
  }

  return Math.min(99, score); // Cap at 99%
};

const getJobs = async (req, res) => {
  try {
    const user = req.user; // populated by authMiddleware
    const jobs = await Job.find().sort({ createdAt: -1 }).lean();

    const jobsWithScores = jobs.map((job) => {
      const matchScore = calculateMatchScore(user, job);
      return {
        ...job,
        id: job._id.toString(), // Add 'id' for frontend compatibility
        matchScore
      };
    });

    // Sort by match score descending
    jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json(jobsWithScores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const requestReferral = async (req, res) => {
  try {
    const { id } = req.params;
    const { resumeUrl, note } = req.body;

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (!job.referralAvailable) {
      return res.status(400).json({ message: 'Referrals are not available for this job' });
    }

    // Save to Referral collection
    const referral = new Referral({
      job: id,
      user: req.user._id,
      resumeUrl: resumeUrl || 'Not provided',
      note: note || ''
    });
    
    await referral.save();

    res.status(201).json({ message: 'Referral request sent successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getJobs, requestReferral };
