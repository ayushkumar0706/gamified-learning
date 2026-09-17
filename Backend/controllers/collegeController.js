const College = require('../Models/college');

// GET /api/colleges?search=iit
const searchColleges = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search && search.trim()) {
      // Text search if indexed, fallback to regex
      query = { name: { $regex: search.trim(), $options: 'i' } };
    }

    const colleges = await College.find(query)
      .select('name city state logo isVerified')
      .limit(20)
      .sort({ isVerified: -1, name: 1 });

    res.status(200).json({ colleges });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/colleges/:id
const getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) return res.status(404).json({ message: 'College not found' });
    res.status(200).json({ college });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/colleges  (admin only)
const createCollege = async (req, res) => {
  try {
    const { name, city, state, domain, logo } = req.body;

    const existing = await College.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
    if (existing) {
      return res.status(409).json({ message: 'College already exists' });
    }

    const college = await College.create({ name, city, state, domain, logo });
    res.status(201).json({ college });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/colleges/:id  (admin only)
const updateCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!college) return res.status(404).json({ message: 'College not found' });
    res.status(200).json({ college });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { searchColleges, getCollegeById, createCollege, updateCollege };
