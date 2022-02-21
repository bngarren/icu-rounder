const readFileAsync = async (file) => {
  let text = await file.text().catch((err) => {
    console.error(err);
  });
  if (text && text.length > 0) {
    return text;
  } else {
    throw new Error("Received empty or null string from file.");
  }
};
export default readFileAsync;
