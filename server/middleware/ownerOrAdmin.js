import Machinery from '../models/machineryModel.js';

export const ownerOrAdmin = async (req, res, next) => {
  const userId = req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  const machineryId = req.params.id;

  const machinery = await Machinery.findById(machineryId).select('seller');
  if (!machinery) {
    return res.status(404).json({ message: 'Machinery not found' });
  }

  if (machinery.seller.toString() !== userId || isAdmin) {
    return res
      .status(403)
      .json({ message: 'Not authorized to perform this action' });
  }

  next();
};
