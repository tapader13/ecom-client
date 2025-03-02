export const uploadImageInImgBb = async (file: File) => {
  const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY as string;
  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', imgbbApiKey);
  try {
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });
    const res = await response.json();
    return res?.data?.display_url || null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
