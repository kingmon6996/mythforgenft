import axios from "axios";

const JWT = process.env.NEXT_PINATA_JWT || "";

export const uploadImageToIPFS = async (imageBlob: Blob) => {
  try {
    const formData = new FormData();
    formData.append("file", imageBlob, "pulse.png");

    const metadata = JSON.stringify({
      name: "CityPulse Visual",
    });
    formData.append("pinataMetadata", metadata);

    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      headers: {
        Authorization: `Bearer ${JWT}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return `ipfs://${res.data.IpfsHash}`;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
        console.error("Pinata image upload error:", error.response?.data || error.message);
    } else {
        console.error("Pinata image upload error:", error);
    }
    throw error;
  }
};

export const uploadMetadataToIPFS = async (metadata: unknown) => {
  try {
    const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", metadata, {
      headers: {
        Authorization: `Bearer ${JWT}`,
      },
    });

    return `ipfs://${res.data.IpfsHash}`;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
        console.error("Pinata metadata upload error:", error.response?.data || error.message);
    } else {
        console.error("Pinata metadata upload error:", error);
    }
    throw error;
  }
};
