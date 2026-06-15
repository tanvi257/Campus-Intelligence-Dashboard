try {
  const sdk = require('@google/generative-ai');
  console.log("Keys available in sdk:", Object.keys(sdk));
  if (sdk.GoogleGenAI) {
    console.log("GoogleGenAI class is available.");
  } else {
    console.log("GoogleGenAI class NOT available in SDK root.");
  }
} catch (err) {
  console.error("Import error:", err);
}
