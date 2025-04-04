import Machinery from '../models/machineryModel.js';

/**
 * @desc    Create a new machinery listing
 * @route   POST /api/machinery
 * @access  Protected (requires authentication)
 *
 * This function creates a new machinery listing using data from the request body.
 * The seller is determined from the authenticated user or provided in the request (for testing purposes).
 */
export const createMachinery = async (req, res) => {
  try {
    const {
      title,
      serialNumber,
      usedHours,
      condition,
      qualityDescription,
      origin,
      voltage,
      category,
      equipmentDetails,
      originalInvoice,
      manufacturingDate,
      manufacturer,
      priceFils,
      location,
      images,
      video,
      isAuction,
    } = req.body;

    // req.user._id should be provided by authentication middleware
    const sellerId = req.user?._id || req.body.seller;

    const machinery = new Machinery({
      title,
      serialNumber,
      usedHours,
      condition,
      qualityDescription,
      origin,
      voltage,
      category,
      equipmentDetails,
      originalInvoice,
      manufacturingDate,
      manufacturer,
      priceFils,
      location,
      images,
      video,
      isAuction,
      seller: sellerId,
    });

    const created = await machinery.save();
    res.status(201).json(created);
  } catch (err) {
    console.error('❌ Error creating machinery:', err);
    res.status(500).json({ message: 'Server error while creating machinery' });
  }
};

/**
 * @desc    Fetch all machinery listings
 * @route   GET /api/machinery
 * @access  Public
 *
 * This function returns a list of all machinery listings,
 * including basic info about each seller.
 */
export const getAllMachinery = async (req, res) => {
  try {
    const listings = await Machinery.find().populate(
      'seller',
      'username email'
    );
    res.json(listings);
  } catch (err) {
    console.error('❌ Error fetching machinery:', err);
    res.status(500).json({ message: 'Server error while fetching listings' });
  }
};

/**
 * @desc    Fetch a single machinery listing by ID
 * @route   GET /api/machinery/:id
 * @access  Public
 *
 * This function fetches a single machinery listing based on the ID in the URL.
 * Returns 404 if the listing does not exist.
 */
export const getMachineryById = async (req, res) => {
  try {
    const listing = await Machinery.findById(req.params.id).populate(
      'seller',
      'username email'
    );

    if (!listing) {
      return res.status(404).json({ message: 'Machinery not found' });
    }

    res.json(listing);
  } catch (err) {
    console.error('❌ Error fetching machinery by ID:', err);
    res.status(500).json({ message: 'Server error while fetching listing' });
  }
};

/**
 * @desc    Update a machinery listing (partial update)
 * @route   PATCH /api/machinery/:id
 * @access  Protected (seller-only)
 *
 * This function updates specific fields of an existing machinery listing.
 * Only the original seller is allowed to make updates.
 */
export const updateMachinery = async (req, res) => {
  try {
    const machinery = await Machinery.findById(req.params.id);

    if (!machinery) {
      return res.status(404).json({ message: 'Machinery not found' });
    }

    // Ensure user is the seller
    if (req.user && machinery.seller.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this listing' });
    }

    // Update only fields provided in req.body
    Object.keys(req.body).forEach((key) => {
      machinery[key] = req.body[key] ?? machinery[key];
    });

    const updated = await machinery.save();
    res.json(updated);
  } catch (err) {
    console.error('❌ Error updating machinery:', err);
    res.status(500).json({ message: 'Server error while updating listing' });
  }
};

/**
 * @desc    Delete a machinery listing
 * @route   DELETE /api/machinery/:id
 * @access  Protected (seller-only)
 *
 * This function deletes a machinery listing based on its ID.
 * Only the original seller can perform the deletion.
 */
export const deleteMachinery = async (req, res) => {
  try {
    const machinery = await Machinery.findById(req.params.id);

    if (!machinery) {
      return res.status(404).json({ message: 'Machinery not found' });
    }

    // Ensure user is the seller
    if (req.user && machinery.seller.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this listing' });
    }

    await machinery.deleteOne();
    res.json({ message: 'Machinery deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting machinery:', err);
    res.status(500).json({ message: 'Server error while deleting listing' });
  }
};

/**
 * @desc    Get machinery listings posted by the current seller
 * @route   GET /api/machinery/my
 * @access  Protected
 *
 * This function returns all listings created by the currently logged-in seller.
 */
export const getMyMachinery = async (req, res) => {
  try {
    const sellerId = req.user?._id;

    const listings = await Machinery.find({ seller: sellerId });
    res.json(listings);
  } catch (err) {
    console.error('❌ Error fetching seller machinery:', err);
    res
      .status(500)
      .json({ message: 'Server error while fetching your listings' });
  }
};
