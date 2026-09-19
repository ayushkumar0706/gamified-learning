const User = require('../Models/user');
const Booking = require('../Models/booking');

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
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.bookSession = async (req, res) => {
  try {
    const { seniorId, type, date, note } = req.body;
    const studentId = req.user._id;

    if (!seniorId || !type || !date) {
      return res.status(400).json({ message: 'Missing required booking fields.' });
    }

    const senior = await User.findById(seniorId);
    if (!senior || senior.role !== 'senior') {
      return res.status(404).json({ message: 'Senior not found.' });
    }

    const newBooking = new Booking({
      student: studentId,
      senior: seniorId,
      type,
      date,
      note
    });

    await newBooking.save();

    res.status(201).json({ success: true, booking: newBooking });
  } catch (error) {
    console.error('Error booking session:', error);
    res.status(500).json({ message: 'Server error while booking session.' });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await Booking.find({ student: userId })
      .populate('senior', 'firstName lastName seniorProfile')
      .sort({ createdAt: -1 })
      .lean();

    const formattedBookings = bookings.map(b => ({
      id: b._id,
      seniorName: `${b.senior?.firstName} ${b.senior?.lastName || ''}`.trim(),
      company: b.senior?.seniorProfile?.company || 'College Alumni',
      type: b.type,
      date: b.date,
      note: b.note,
      status: b.status
    }));

    res.status(200).json({ success: true, bookings: formattedBookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error while fetching bookings.' });
  }
};
