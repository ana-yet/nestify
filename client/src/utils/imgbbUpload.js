const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

/**
 * Upload a single image file to imgbb.
 * Returns the direct display URL on success.
 * @param {File} file
 * @returns {Promise<string>} url
 */
export const uploadToImgbb = async (file) => {
  if (!IMGBB_API_KEY) {
    throw new Error("ImgBB API key is not configured");
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!res.ok) {
    throw new Error(`ImgBB upload failed (${res.status})`);
  }

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.error?.message || "ImgBB upload failed");
  }

  return json.data.url;
};
