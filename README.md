# 🚀 AI Meta Title & Description Generator

## 📌 Description

A lightweight, WordPress-ready tool that generates SEO-optimized meta titles and descriptions using Google's Gemini AI. Paste your page content, get 3 title/description options sized to fit Google's search results — no backend server required.

---

## 🔥 Features

- ✅ Generates 3 unique SEO title + meta description options per request
- ✅ Live character counter (title: 50-60 chars, description: 140-160 chars) matching Google's SERP display limits
- ✅ One-click copy for titles and descriptions
- ✅ Fully client-side — no Python/PHP backend needed
- ✅ Drop straight into a WordPress Custom HTML block or embed via iframe
- ✅ API key stored only in the user's browser (localStorage) — never sent anywhere except Google's API

---

## 🛠️ Tech Stack

- HTML5 / CSS3 / Vanilla JavaScript
- Google Gemini API (`gemini-3.6-flash`) — generative AI, not a locally trained model
- No dataset/CSV required — this project calls a pre-trained LLM directly instead of training on custom data (unlike the Scikit-learn/TF-IDF based tools in this portfolio)

---

## 📂 Project Structure

```
ai-meta-generator/
│── index.html
│── style.css
│── script.js
│── README.md
```

---

## ⚙️ Installation / Local Setup

1. Clone the repository:
```
git clone https://github.com/fatima-890/AI-Meta-Title-Generator.git
```

2. Navigate to the project folder:
```
cd AI-Meta-Title-Description-Generator
```

3. Run a local server (no dependencies needed):
```
python -m http.server 5500
```

4. Open in your browser:
```
http://localhost:5500
```

---

## 🔑 API Key

This tool needs a free Gemini API key to generate content:

1. Get one at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Paste it into the "Gemini API key" field inside the tool
3. It's saved only in your browser — never transmitted anywhere except Google's API

---

## 🧠 Usage

1. Paste your blog post or page content into the text box
2. (Optional) Add a target keyword
3. Enter your Gemini API key (one-time)
4. Click "Generate Title & Description"
5. Copy the option that fits best

---

## 🌐 WordPress Embedding

Combine the three files into a single block (CSS in a `<style>` tag, JS in a `<script>` tag) and paste into any WordPress **Custom HTML** block — no plugin installation required.

---

## 👨‍💻 About Me

Hi, I'm Esha Fatima — building a career at the intersection of AI/ML and SEO/digital marketing. This project reflects my interest in combining generative AI with practical, deployable SEO tools for WordPress.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve this project:

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Commit your changes
5. Push to your branch
6. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License.

---

## ⭐ Support

If you like this project, don't forget to give it a ⭐ on GitHub!