from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import openai

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)

@app.route('/ask', methods=['POST'])
def ask():
    prompt = request.json.get('prompt', '')
    try:
        completion = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        return jsonify({'response': completion['choices'][0]['message']['content']})
    except Exception as e:
        return jsonify({'response': f"Error: {str(e)}"})

@app.route("/dalle", methods=["POST"])
def generate_image():
    prompt = request.json.get("prompt", "")
    try:
        response = openai.Image.create(prompt=prompt, n=1, size="512x512")
        return jsonify({"url": response["data"][0]["url"]})
    except Exception as e:
        return jsonify({"error": str(e)})

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import openai

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)

@app.route('/ask', methods=['POST'])
def ask():
    prompt = request.json.get('prompt', '')
    try:
        completion = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        return jsonify({'response': completion['choices'][0]['message']['content']})
    except Exception as e:
        return jsonify({'response': f"Error: {str(e)}"})

@app.route("/dalle", methods=["POST"])
def generate_image():
    prompt = request.json.get("prompt", "")
    try:
        response = openai.Image.create(prompt=prompt, n=1, size="512x512")
        return jsonify({"url": response["data"][0]["url"]})
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route("/chat", methods=["POST"])
def chat():
    prompt = request.json.get("prompt", "")
    agent = request.json.get("agent", "an agent")
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": f"You are {agent}, part of the Omnigen team."},
                {"role": "user", "content": prompt}
            ]
        )
        return jsonify({"response": response.choices[0].message.content})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(port=5001)
