const User = require('../Models/user');

exports.getSeniors = async (req, res) => {
  try {
    const { college } = req.user;
    
    // Search query
    const search = req.query.search || '';

    // Build match criteria: role is senior and college matches current user's college
    let query = { 
      role: 'senior',
      college: college 
    };

    const seniors = await User.find(query)
      .select('firstName lastName role email photo bio college year branch seniorProfile')
      .populate('college', 'name')
      .lean();

    // In a real scenario, we might want to do a text search, but since skills and company are nested in seniorProfile,
    // and we are fetching a small number of seniors per college, we can filter in memory or use complex regex.
    // For simplicity, we filter in memory if a search string is provided.
    let filteredSeniors = seniors;
    if (search) {
      const s = search.toLowerCase();
      filteredSeniors = seniors.filter(senior => {
        const nameMatch = `${senior.firstName} ${senior.lastName}`.toLowerCase().includes(s);
        const companyMatch = senior.seniorProfile?.company?.toLowerCase().includes(s);
        const skillsMatch = senior.seniorProfile?.skills?.some(skill => skill.toLowerCase().includes(s));
        const jobTitleMatch = senior.seniorProfile?.jobTitle?.toLowerCase().includes(s);
        
        return nameMatch || companyMatch || skillsMatch || jobTitleMatch;
      });
    }

    // Map to the format expected by the frontend
    const formattedSeniors = filteredSeniors.map(senior => ({
      id: senior._id,
      name: `${senior.firstName} ${senior.lastName || ''}`.trim(),
      role: senior.seniorProfile?.jobTitle || 'Senior Student',
      company: senior.seniorProfile?.company || 'College Alumni',
      companyColor: 'from-blue-600 to-indigo-700', // Mock dynamic color for now
      college: senior.college?.name || 'Your College',
      branch: senior.branch,
      year: senior.year ? `Year ${senior.year}` : 'Senior',
      rating: 4.8, // Mock for now
      sessionsCount: Math.floor(Math.random() * 50) + 5, // Mock for now
      responseTime: senior.seniorProfile?.responseTime || '~2 hrs',
      skills: senior.seniorProfile?.skills?.length > 0 ? senior.seniorProfile.skills : ['Mentorship', 'Career Guidance'],
      bio: senior.bio || 'Passionate about helping juniors crack algorithmic rounds and craft high-impact resumes.',
      availableDays: senior.seniorProfile?.availableDays?.length > 0 ? senior.seniorProfile.availableDays : ['Weekends'],
      photo: senior.photo
    }));

    res.status(200).json({
      success: true,
      seniors: formattedSeniors
    });
  } catch (error) {
    console.error('Error in getSeniors:', error);
    res.status(500).json({ success: false, message: 'Server error fetching seniors.' });
  }
};
