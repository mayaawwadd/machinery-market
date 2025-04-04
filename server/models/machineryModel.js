import mongoose from 'mongoose';

const machinerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
    },

    serialNumber: {
      type: String,
      required: [true, 'Serial number is required'],
      unique: true,
      trim: true,
    },

    usedHours: {
      type: Number,
      required: [true, 'Used hours are required'],
      min: [0, 'Used hours cannot be negative'],
    },

    condition: {
      type: String,
      required: [true, 'Condition is required'],
      enum: ['new', 'used', 'refurbished'],
    },

    qualityDescription: {
      type: String,
      required: [true, 'Quality description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
    },

    origin: {
      type: String,
      required: [true, 'Origin is required'],
      trim: true,
    },

    voltage: {
      type: String,
      required: [true, 'Voltage is required'],
      match: [/^\d{3}V$/, 'Voltage must be in the format like "220V"'],
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['industrial', 'agricultural', 'construction', 'medical', 'other'],
    },

    equipmentDetails: {
      type: String,
      required: [true, 'Equipment details are required'],
      minlength: [10, 'Equipment details must be at least 10 characters'],
    },

    originalInvoice: {
      type: String,
      default: '',
    },

    manufacturingDate: {
      type: Date,
      required: [true, 'Manufacturing date is required'],
      validate: {
        validator: (value) => value <= new Date(),
        message: 'Manufacturing date cannot be in the future',
      },
    },

    manufacturer: {
      type: String,
      required: [true, 'Manufacturer is required'],
      trim: true,
    },

    priceCents: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },

    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller ID is required'],
    },

    images: {
      type: [String],
      required: [true, 'At least one image is required'],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one image must be provided',
      },
    },

    video: {
      type: String,
      default: '',
    },

    isAuction: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Machinery = mongoose.model('Machinery', machinerySchema);
export default Machinery;
