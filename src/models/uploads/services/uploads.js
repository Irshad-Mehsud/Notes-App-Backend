import upLoadToCloudinary from "../middleware/cloudinary.js";
const uploadFile = async(buffer, mimetype) => {
	return await upLoadToCloudinary(buffer, mimetype);
};

export default uploadFile;